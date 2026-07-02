import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../../../src/lib/db';
import { getSessionUser } from '../../../src/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized access' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (user.email !== email) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const { bookingsCollection } = await connectToDatabase();
    const bookings = await bookingsCollection
      .find({ userEmail: email })
      .sort({ bookingDate: -1 })
      .toArray();

    return NextResponse.json({ success: true, data: bookings });
  } catch (error) {
    console.error('GET /bookings failed:', error);
    return NextResponse.json({ message: 'Failed to fetch bookings' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized access' }, { status: 401 });
    }

    const data = await request.json();
    if (!data.carId || !data.userEmail) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }
    if (data.userEmail !== user.email) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }
    if (!ObjectId.isValid(data.carId)) {
      return NextResponse.json({ message: 'Invalid car ID' }, { status: 400 });
    }

    const { carsCollection, bookingsCollection } = await connectToDatabase();
    const car = await carsCollection.findOne({ _id: new ObjectId(data.carId) });
    if (!car) {
      return NextResponse.json({ message: 'Car not found' }, { status: 404 });
    }
    if (!car.availabilityStatus) {
      return NextResponse.json({ message: 'Car is not available' }, { status: 400 });
    }
    if (car.ownerEmail === user.email) {
      return NextResponse.json({ message: 'You cannot book your own listed car' }, { status: 400 });
    }

    const newBooking = {
      ...data,
      userEmail: user.email,
      userName: user.name || data.userName || 'DriveFleet user',
      rentalDays: parseInt(data.rentalDays, 10) || 1,
      totalPrice: parseFloat(data.totalPrice),
      bookingDate: new Date(),
      status: 'confirmed',
    };

    const [insertResult] = await Promise.all([
      bookingsCollection.insertOne(newBooking),
      carsCollection.updateOne({ _id: new ObjectId(data.carId) }, { $inc: { bookingCount: 1 } }),
    ]);

    return NextResponse.json({ success: true, insertedId: insertResult.insertedId }, { status: 201 });
  } catch (error) {
    console.error('POST /bookings failed:', error);
    return NextResponse.json({ message: 'Booking failed' }, { status: 500 });
  }
}
