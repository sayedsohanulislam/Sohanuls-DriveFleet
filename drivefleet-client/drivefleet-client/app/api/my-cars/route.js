import { NextResponse } from 'next/server';
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

    const { carsCollection } = await connectToDatabase();
    const cars = await carsCollection
      .find({ ownerEmail: email })
      .sort({ dateAdded: -1 })
      .toArray();

    return NextResponse.json({ success: true, data: cars });
  } catch (error) {
    console.error('GET /my-cars failed:', error);
    return NextResponse.json({ message: 'Failed to fetch your cars' }, { status: 500 });
  }
}
