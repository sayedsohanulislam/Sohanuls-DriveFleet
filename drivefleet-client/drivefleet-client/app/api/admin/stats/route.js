import { NextResponse } from 'next/server';
import { getSessionUser } from '../../../../src/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized access' }, { status: 401 });
    }
    if (user.role !== 'admin') {
      return NextResponse.json({ message: 'Forbidden: Admin access required' }, { status: 403 });
    }

    return NextResponse.json({
      success: true,
      message: 'Welcome, admin!',
      stats: {
        users: 100,
        cars: 50,
        bookings: 200,
      },
    });
  } catch (error) {
    console.error('GET /api/admin/stats failed:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
