"use client";
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosSecure from '../hooks/useAxiosSecure';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { FiCalendar, FiUser, FiMapPin, FiExternalLink } from 'react-icons/fi';
import Link from 'next/link';
import { format } from 'date-fns';

const MyBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'My Bookings — DriveFleet';
    axiosSecure.get(`/bookings?email=${user.email}`)
      .then(res => { setBookings(res.data?.data || res.data || []); setLoading(false); })
      .catch(() => { toast.error('Failed to load bookings'); setLoading(false); });
  }, [user.email]);

  const formatDate = (dateStr) => {
    try { return format(new Date(dateStr), 'MMM dd, yyyy — hh:mm a'); }
    catch { return 'N/A'; }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="page-enter min-h-screen pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-10">
          <p className="font-ui font-semibold tracking-widest uppercase text-sm mb-2" style={{ color: 'var(--orange)' }}>
            Your History
          </p>
          <h1 className="section-title">MY BOOKINGS</h1>
          <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
            {bookings.length} booking{bookings.length !== 1 ? 's' : ''} in total
          </p>
        </div>

        {bookings.length === 0 ? (
          <div
            className="text-center py-24 rounded-2xl"
            style={{ background: 'var(--navy-card)', border: '1px solid var(--navy-border)' }}
          >
            <div className="text-6xl mb-4">📋</div>
            <h3 className="font-ui font-bold text-xl mb-2">No bookings yet</h3>
            <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
              Find and book your perfect car today
            </p>
            <Link href="/explore">
              <button className="btn-primary">Explore Cars</button>
            </Link>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div
              className="hidden md:block rounded-2xl overflow-hidden"
              style={{ background: 'var(--navy-card)', border: '1px solid var(--navy-border)' }}
            >
              <table className="df-table">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--navy-border)' }}>
                    <th>Car</th>
                    <th>Rental Days</th>
                    <th>Total Price</th>
                    <th>Driver</th>
                    <th>Booking Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b._id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <img
                            src={b.imageUrl}
                            alt={b.carName}
                            className="w-14 h-10 object-cover rounded-lg flex-shrink-0"
                            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=200'; }}
                          />
                          <span className="font-ui font-semibold">{b.carName}</span>
                        </div>
                      </td>
                      <td>
                        <span className="font-ui font-semibold">{b.rentalDays || 1}</span>
                        <span className="text-xs ml-1" style={{ color: 'var(--text-secondary)' }}>days</span>
                      </td>
                      <td>
                        <span className="font-display text-xl" style={{ color: 'var(--orange)' }}>
                          ${b.totalPrice}
                        </span>
                      </td>
                      <td>
                        <span
                          className="badge"
                          style={{
                            background: b.driverNeeded === 'Yes' ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.08)',
                            color: b.driverNeeded === 'Yes' ? '#60a5fa' : 'var(--text-secondary)',
                          }}
                        >
                          {b.driverNeeded === 'Yes' ? 'With Driver' : 'Self Drive'}
                        </span>
                      </td>
                      <td>
                        <a
                          href={`https://www.timeanddate.com/calendar/`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-sm hover:underline"
                          style={{ color: 'var(--text-secondary)' }}
                        >
                          <FiCalendar size={12} />
                          {formatDate(b.bookingDate)}
                          <FiExternalLink size={10} />
                        </a>
                      </td>
                      <td>
                        <span className="badge badge-available">Confirmed</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden space-y-4">
              {bookings.map((b) => (
                <div
                  key={b._id}
                  className="rounded-xl overflow-hidden"
                  style={{ background: 'var(--navy-card)', border: '1px solid var(--navy-border)' }}
                >
                  <div className="flex gap-3 p-4">
                    <img
                      src={b.imageUrl}
                      alt={b.carName}
                      className="w-20 h-16 object-cover rounded-lg flex-shrink-0"
                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=200'; }}
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-ui font-bold truncate">{b.carName}</h3>
                      <div className="font-display text-2xl" style={{ color: 'var(--orange)' }}>${b.totalPrice}</div>
                      <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                        {b.rentalDays || 1} day(s) · {b.driverNeeded === 'Yes' ? 'With Driver' : 'Self Drive'}
                      </div>
                    </div>
                  </div>
                  <div
                    className="px-4 py-3 flex items-center justify-between border-t text-xs"
                    style={{ borderColor: 'var(--navy-border)', color: 'var(--text-secondary)' }}
                  >
                    <span className="flex items-center gap-1"><FiCalendar size={11} /> {formatDate(b.bookingDate)}</span>
                    <span className="badge badge-available">Confirmed</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div
              className="mt-8 p-6 rounded-2xl flex flex-wrap gap-6 justify-between"
              style={{ background: 'var(--navy-card)', border: '1px solid var(--navy-border)' }}
            >
              <div>
                <div className="font-ui text-xs tracking-wider uppercase mb-1" style={{ color: 'var(--text-secondary)' }}>Total Bookings</div>
                <div className="font-display text-4xl" style={{ color: 'var(--orange)' }}>{bookings.length}</div>
              </div>
              <div>
                <div className="font-ui text-xs tracking-wider uppercase mb-1" style={{ color: 'var(--text-secondary)' }}>Total Spent</div>
                <div className="font-display text-4xl" style={{ color: 'var(--orange)' }}>
                  ${bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0)}
                </div>
              </div>
              <div>
                <div className="font-ui text-xs tracking-wider uppercase mb-1" style={{ color: 'var(--text-secondary)' }}>Total Days</div>
                <div className="font-display text-4xl" style={{ color: 'var(--orange)' }}>
                  {bookings.reduce((sum, b) => sum + (b.rentalDays || 1), 0)}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
