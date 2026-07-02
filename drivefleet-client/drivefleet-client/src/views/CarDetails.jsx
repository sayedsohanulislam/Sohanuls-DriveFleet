"use client";
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import {
  FiMapPin, FiUsers, FiCalendar, FiX, FiArrowLeft, FiCheckCircle
} from 'react-icons/fi';
import { MdDirectionsCar } from 'react-icons/md';
import axiosSecure from '../hooks/useAxiosSecure';
import { API_BASE_URL } from '../lib/api';

const API = API_BASE_URL;

const CarDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const router = useRouter();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [bookingData, setBookingData] = useState({ driverNeeded: 'No', specialNote: '' });
  const [booking, setBooking] = useState(false);
  const [rentalDays, setRentalDays] = useState(1);

  useEffect(() => {
    axios.get(`${API}/cars/${id}`)
      .then(res => { setCar(res.data); setLoading(false); })
      .catch(() => { setLoading(false); });
  }, [id]);

  useEffect(() => {
    if (car) document.title = `${car.carName} — DriveFleet`;
  }, [car]);

  const handleBook = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please login to book'); router.push('/login'); return; }
    setBooking(true);
    try {
      await axiosSecure.post('/bookings', {
        carId: car._id,
        carName: car.carName,
        imageUrl: car.imageUrl,
        dailyRent: car.dailyRent,
        rentalDays,
        totalPrice: car.dailyRent * rentalDays,
        userEmail: user.email,
        userName: user.displayName,
        bookingDate: new Date(),
        ...bookingData,
      });
      toast.success('Car booked successfully! 🚗');
      setShowModal(false);
      setCar(prev => ({ ...prev, bookingCount: (prev.bookingCount || 0) + 1 }));
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Booking failed. Try again.');
    } finally {
      setBooking(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!car) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 pt-20">
      <p className="text-xl font-ui">Car not found</p>
      <button onClick={() => router.push('/explore')} className="btn-primary">Back to Explore</button>
    </div>
  );

  const totalPrice = car.dailyRent * rentalDays;

  return (
    <div className="page-enter min-h-screen pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 mb-8 font-ui text-sm tracking-wide uppercase transition-colors hover:text-white"
          style={{ color: 'var(--text-secondary)' }}
        >
          <FiArrowLeft /> Back
        </button>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Image */}
          <div className="relative">
            <div
              className="absolute -inset-1 rounded-2xl opacity-20 blur-xl"
              style={{ background: 'var(--orange)' }}
            />
            <img
              src={car.imageUrl || 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800'}
              alt={car.carName}
              className="relative w-full rounded-2xl object-cover shadow-2xl"
              style={{ height: '380px', filter: 'brightness(0.95)' }}
            />
            <span
              className={`absolute top-4 left-4 badge ${car.availabilityStatus ? 'badge-available' : 'badge-unavailable'}`}
              style={{ fontSize: '0.8rem', padding: '0.3rem 0.8rem' }}
            >
              {car.availabilityStatus ? '● Available' : '● Unavailable'}
            </span>
            <span
              className="absolute top-4 right-4 font-ui font-bold text-sm px-3 py-1 rounded"
              style={{ background: 'var(--orange)', color: 'white' }}
            >
              {car.carType}
            </span>
          </div>

          {/* Details */}
          <div>
            <h1
              className="font-display mb-2"
              style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'var(--text-primary)' }}
            >
              {car.carName}
            </h1>

            <div className="flex items-baseline gap-2 mb-6">
              <span className="font-display text-5xl" style={{ color: 'var(--orange)' }}>
                ${car.dailyRent}
              </span>
              <span className="font-ui text-sm" style={{ color: 'var(--text-secondary)' }}>/day</span>
            </div>

            {/* Specs grid */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                { icon: <FiUsers />, label: 'Seats', value: `${car.seatCapacity} people` },
                { icon: <FiMapPin />, label: 'Pickup', value: car.pickupLocation },
                { icon: <MdDirectionsCar />, label: 'Type', value: car.carType },
                { icon: <FiCalendar />, label: 'Bookings', value: `${car.bookingCount || 0} total` },
              ].map((spec) => (
                <div
                  key={spec.label}
                  className="flex items-center gap-3 p-3 rounded-xl"
                  style={{ background: 'var(--navy-card)', border: '1px solid var(--navy-border)' }}
                >
                  <span style={{ color: 'var(--orange)' }}>{spec.icon}</span>
                  <div>
                    <div className="font-ui text-xs tracking-wide uppercase" style={{ color: 'var(--text-secondary)' }}>
                      {spec.label}
                    </div>
                    <div className="text-sm font-semibold">{spec.value}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Description */}
            {car.description && (
              <p className="text-sm leading-relaxed mb-8" style={{ color: 'var(--text-secondary)' }}>
                {car.description}
              </p>
            )}

            {/* Book Now */}
            {car.availabilityStatus ? (
              <button
                onClick={() => {
                  if (!user) { toast.error('Please login to book'); router.push('/login'); return; }
                  setShowModal(true);
                }}
                className="btn-primary w-full text-lg py-4 animate-pulse-orange"
              >
                Book Now
              </button>
            ) : (
              <div
                className="text-center py-4 rounded-xl font-ui tracking-wide uppercase text-sm"
                style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }}
              >
                Currently Unavailable
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─── BOOKING MODAL ─── */}
      {showModal && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div className="modal-box">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-3xl" style={{ color: 'var(--orange)' }}>BOOK CAR</h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-lg hover:bg-white/5"
                style={{ color: 'var(--text-secondary)' }}
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Car summary */}
            <div
              className="flex items-center gap-3 p-3 rounded-xl mb-6"
              style={{ background: 'rgba(255,85,0,0.08)', border: '1px solid rgba(255,85,0,0.2)' }}
            >
              <img
                src={car.imageUrl}
                className="w-16 h-12 object-cover rounded-lg"
                alt={car.carName}
              />
              <div>
                <div className="font-ui font-bold">{car.carName}</div>
                <div className="font-display text-xl" style={{ color: 'var(--orange)' }}>
                  ${car.dailyRent}/day
                </div>
              </div>
            </div>

            <form onSubmit={handleBook} className="space-y-4">
              {/* Rental days */}
              <div>
                <label className="font-ui text-xs tracking-wider uppercase block mb-2" style={{ color: 'var(--text-secondary)' }}>
                  Number of Days
                </label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={rentalDays}
                  onChange={(e) => setRentalDays(Math.max(1, parseInt(e.target.value) || 1))}
                  className="df-input"
                  required
                />
              </div>

              {/* Driver needed */}
              <div>
                <label className="font-ui text-xs tracking-wider uppercase block mb-2" style={{ color: 'var(--text-secondary)' }}>
                  Driver Needed
                </label>
                <select
                  value={bookingData.driverNeeded}
                  onChange={(e) => setBookingData(p => ({ ...p, driverNeeded: e.target.value }))}
                  className="df-select"
                >
                  <option value="No">No - I will drive myself</option>
                  <option value="Yes">Yes — Provide a driver</option>
                </select>
              </div>

              {/* Special note */}
              <div>
                <label className="font-ui text-xs tracking-wider uppercase block mb-2" style={{ color: 'var(--text-secondary)' }}>
                  Special Note (optional)
                </label>
                <textarea
                  placeholder="Any special requests or notes..."
                  value={bookingData.specialNote}
                  onChange={(e) => setBookingData(p => ({ ...p, specialNote: e.target.value }))}
                  className="df-input resize-none"
                  rows={3}
                />
              </div>

              {/* Total */}
              <div
                className="flex items-center justify-between p-4 rounded-xl"
                style={{ background: 'rgba(255,85,0,0.08)', border: '1px solid rgba(255,85,0,0.2)' }}
              >
                <span className="font-ui font-semibold tracking-wide">Total Price</span>
                <span className="font-display text-3xl" style={{ color: 'var(--orange)' }}>
                  ${totalPrice}
                </span>
              </div>

              <button
                type="submit"
                className="btn-primary w-full py-4 flex items-center justify-center gap-2 text-base"
                disabled={booking}
              >
                {booking ? (
                  <><div className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} /> Processing...</>
                ) : (
                  <><FiCheckCircle /> Confirm Booking</>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarDetails;
