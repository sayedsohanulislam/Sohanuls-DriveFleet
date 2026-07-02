import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../../../../src/lib/db';
import { getSessionUser } from '../../../../src/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: 'Invalid car ID' }, { status: 400 });
    }

    const { carsCollection } = await connectToDatabase();
    const car = await carsCollection.findOne({ _id: new ObjectId(id) });
    if (!car) {
      return NextResponse.json({ message: 'Car not found' }, { status: 404 });
    }

    return NextResponse.json(car);
  } catch (error) {
    console.error('GET /cars/:id failed:', error);
    return NextResponse.json({ message: 'Failed to fetch car' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized access' }, { status: 401 });
    }

    const { id } = params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: 'Invalid car ID' }, { status: 400 });
    }

    const { carsCollection } = await connectToDatabase();
    const existing = await carsCollection.findOne({ _id: new ObjectId(id) });
    if (!existing) {
      return NextResponse.json({ message: 'Car not found' }, { status: 404 });
    }
    if (existing.ownerEmail !== user.email) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const update = await request.json();
    delete update._id;
    delete update.ownerEmail;
    delete update.ownerName;
    delete update.ownerPhoto;
    delete update.bookingCount;
    delete update.dateAdded;

    if (update.dailyRent) update.dailyRent = parseFloat(update.dailyRent);
    if (update.seatCapacity) update.seatCapacity = parseInt(update.seatCapacity, 10);

    await carsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...update, updatedAt: new Date() } },
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('PUT /cars/:id failed:', error);
    return NextResponse.json({ message: 'Failed to update car' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized access' }, { status: 401 });
    }

    const { id } = params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: 'Invalid car ID' }, { status: 400 });
    }

    const { carsCollection } = await connectToDatabase();
    const existing = await carsCollection.findOne({ _id: new ObjectId(id) });
    if (!existing) {
      return NextResponse.json({ message: 'Car not found' }, { status: 404 });
    }
    if (existing.ownerEmail !== user.email) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    await carsCollection.deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /cars/:id failed:', error);
    return NextResponse.json({ message: 'Failed to delete car' }, { status: 500 });
  }
}
