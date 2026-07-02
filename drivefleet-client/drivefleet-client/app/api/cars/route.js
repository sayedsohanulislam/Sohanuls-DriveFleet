import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../src/lib/db';
import { getSessionUser } from '../../../src/lib/auth';

export const dynamic = 'force-dynamic';

const parseLimitedInt = (value, fallback = 50, max = 100) => {
  const parsed = parseInt(value, 10);
  if (isNaN(parsed) || parsed <= 0) return fallback;
  return Math.min(parsed, max);
};

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');
    const type = searchParams.get('type');
    const sort = searchParams.get('sort');
    const limit = searchParams.get('limit');

    const { carsCollection } = await connectToDatabase();
    const query = {};
    const resultLimit = parseLimitedInt(limit);

    if (q) {
      const escapedSearch = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      query.carName = { $regex: escapedSearch, $options: 'i' };
    }
    if (type && type !== 'All') {
      query.carType = { $in: [type] };
    }

    let sortOption = { dateAdded: -1 };
    if (sort === 'price_asc') sortOption = { dailyRent: 1 };
    else if (sort === 'price_desc') sortOption = { dailyRent: -1 };
    else if (sort === 'popular') sortOption = { bookingCount: -1 };

    const cars = await carsCollection
      .find(query)
      .sort(sortOption)
      .limit(resultLimit)
      .toArray();

    return NextResponse.json({ success: true, count: cars.length, data: cars });
  } catch (error) {
    console.error('GET /cars failed:', error);
    return NextResponse.json({ message: 'Failed to fetch cars' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized access' }, { status: 401 });
    }

    const carData = await request.json();
    const required = ['carName', 'dailyRent', 'carType', 'imageUrl', 'seatCapacity', 'pickupLocation'];

    for (const field of required) {
      if (!carData[field] && carData[field] !== 0) {
        return NextResponse.json({ message: `Missing field: ${field}` }, { status: 400 });
      }
    }

    const newCar = {
      ...carData,
      ownerEmail: user.email,
      ownerName: user.name || carData.ownerName || 'DriveFleet user',
      ownerPhoto: user.image || carData.ownerPhoto || '',
      dailyRent: parseFloat(carData.dailyRent),
      seatCapacity: parseInt(carData.seatCapacity, 10),
      bookingCount: 0,
      dateAdded: new Date(),
    };

    const { carsCollection } = await connectToDatabase();
    const result = await carsCollection.insertOne(newCar);
    return NextResponse.json({ success: true, insertedId: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error('POST /cars failed:', error);
    return NextResponse.json({ message: 'Failed to add car' }, { status: 500 });
  }
}
