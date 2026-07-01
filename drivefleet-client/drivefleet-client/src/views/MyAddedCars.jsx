"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosSecure from '../hooks/useAxiosSecure';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { FiEdit2, FiTrash2, FiX, FiCheck, FiPlus } from 'react-icons/fi';
import Link from 'next/link';

const CAR_TYPES = ['SUV', 'Sedan', 'Hatchback', 'Luxury', 'Electric', 'Convertible', 'Pickup'];

const MyAddedCars = () => {
  const { user } = useAuth();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updateModal, setUpdateModal] = useState(null); // car object
  const [deleteModal, setDeleteModal] = useState(null); // car id
  const [submitting, setSubmitting] = useState(false);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    document.title = 'My Cars — DriveFleet';
    fetchMyCars();
  }, []);

  const fetchMyCars = async () => {
    setLoading(true);
    try {
      const res = await axiosSecure.get(`/my-cars?email=${user.email}`);
      setCars(res.data?.data || res.data || []);
    } catch {
      toast.error('Failed to load your cars');
    } finally {
      setLoading(false);
    }
  };

  const openUpdate = (car) => {
    setEditForm({
      dailyRent: car.dailyRent,
      carType: car.carType,
      imageUrl: car.imageUrl,
      pickupLocation: car.pickupLocation,
      description: car.description || '',
      availabilityStatus: car.availabilityStatus,
    });
    setUpdateModal(car);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axiosSecure.put(`/cars/${updateModal._id}`, {
        ...editForm,
        dailyRent: parseFloat(editForm.dailyRent),
      });
      toast.success('Car updated successfully!');
      setCars(prev => prev.map(c => c._id === updateModal._id ? { ...c, ...editForm } : c));
      setUpdateModal(null);
    } catch {
      toast.error('Update failed. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setSubmitting(true);
    try {
      await axiosSecure.delete(`/cars/${deleteModal}`);
      toast.success('Car removed from listing');
      setCars(prev => prev.filter(c => c._id !== deleteModal));
      setDeleteModal(null);
    } catch {
      toast.error('Delete failed. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="page-enter min-h-screen pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <p className="font-ui font-semibold tracking-widest uppercase text-sm mb-2" style={{ color: 'var(--orange)' }}>
              Fleet Management
            </p>
            <h1 className="section-title">MY ADDED CARS</h1>
            <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
              {cars.length} car{cars.length !== 1 ? 's' : ''} listed
            </p>
          </div>
          <Link href="/add-car">
            <button className="btn-primary flex items-center gap-2">
              <FiPlus /> Add New
            </button>
          </Link>
        </div>

        {cars.length === 0 ? (
          <div
            className="text-center py-24 rounded-2xl"
            style={{ background: 'var(--navy-card)', border: '1px solid var(--navy-border)' }}
          >
            <div className="text-6xl mb-4">🚗</div>
            <h3 className="font-ui font-bold text-xl mb-2">No cars listed yet</h3>
            <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
              Start earning by listing your first car
            </p>
            <Link href="/add-car">
              <button className="btn-primary">List Your First Car</button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.map((car) => (
              <div
                key={car._id}
                className="rounded-xl overflow-hidden flex flex-col"
                style={{ background: 'var(--navy-card)', border: '1px solid var(--navy-border)' }}
              >
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={car.imageUrl}
                    alt={car.carName}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600'; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <span
                    className={`absolute top-3 right-3 badge ${car.availabilityStatus ? 'badge-available' : 'badge-unavailable'}`}
                  >
                    {car.availabilityStatus ? 'Available' : 'Unavailable'}
                  </span>
                  <span
                    className="absolute bottom-3 left-3 font-ui font-bold text-xs px-2 py-1 rounded"
                    style={{ background: 'var(--orange)', color: 'white' }}
                  >
                    {car.carType}
                  </span>
                </div>

                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-ui font-bold text-lg mb-1">{car.carName}</h3>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-display text-2xl" style={{ color: 'var(--orange)' }}>
                      ${car.dailyRent}<span className="text-sm font-body" style={{ color: 'var(--text-secondary)' }}>/day</span>
                    </span>
                    <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      {car.bookingCount || 0} bookings
                    </span>
                  </div>
                  <p className="text-xs mb-4" style={{ color: 'var(--text-secondary)' }}>
                    📍 {car.pickupLocation}
                  </p>
                  <div className="flex gap-2 mt-auto">
                    <button
                      onClick={() => openUpdate(car)}
                      className="flex-1 btn-outline flex items-center justify-center gap-2 py-2 text-sm"
                    >
                      <FiEdit2 size={14} /> Update
                    </button>
                    <button
                      onClick={() => setDeleteModal(car._id)}
                      className="flex-1 flex items-center justify-center gap-2 py-2 text-sm rounded font-ui font-semibold uppercase tracking-wider transition-all"
                      style={{
                        background: 'rgba(239,68,68,0.1)',
                        color: '#f87171',
                        border: '1px solid rgba(239,68,68,0.2)',
                      }}
                    >
                      <FiTrash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ─── UPDATE MODAL ─── */}
      {updateModal && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setUpdateModal(null); }}>
          <div className="modal-box max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-3xl" style={{ color: 'var(--orange)' }}>UPDATE CAR</h2>
              <button onClick={() => setUpdateModal(null)} className="p-2 rounded-lg hover:bg-white/5" style={{ color: 'var(--text-secondary)' }}>
                <FiX size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4">
              {[
                { label: 'Daily Rent (USD)', name: 'dailyRent', type: 'number', placeholder: '75' },
                { label: 'Image URL', name: 'imageUrl', type: 'url', placeholder: 'https://...' },
                { label: 'Pickup Location', name: 'pickupLocation', type: 'text', placeholder: 'City, Country' },
              ].map((f) => (
                <div key={f.name}>
                  <label className="font-ui text-xs tracking-widest uppercase block mb-2" style={{ color: 'var(--text-secondary)' }}>
                    {f.label}
                  </label>
                  <input
                    type={f.type}
                    name={f.name}
                    value={editForm[f.name] || ''}
                    onChange={(e) => setEditForm(p => ({ ...p, [f.name]: e.target.value }))}
                    placeholder={f.placeholder}
                    className="df-input"
                  />
                </div>
              ))}

              <div>
                <label className="font-ui text-xs tracking-widest uppercase block mb-2" style={{ color: 'var(--text-secondary)' }}>Car Type</label>
                <select
                  value={editForm.carType}
                  onChange={(e) => setEditForm(p => ({ ...p, carType: e.target.value }))}
                  className="df-select"
                >
                  {CAR_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div>
                <label className="font-ui text-xs tracking-widest uppercase block mb-2" style={{ color: 'var(--text-secondary)' }}>Description</label>
                <textarea
                  rows={3}
                  value={editForm.description}
                  onChange={(e) => setEditForm(p => ({ ...p, description: e.target.value }))}
                  className="df-input resize-none"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'rgba(255,85,0,0.06)', border: '1px solid rgba(255,85,0,0.15)' }}>
                <span className="font-ui font-semibold">Available</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editForm.availabilityStatus}
                    onChange={(e) => setEditForm(p => ({ ...p, availabilityStatus: e.target.checked }))}
                    className="sr-only"
                  />
                  <div style={{ width: 44, height: 24, background: editForm.availabilityStatus ? 'var(--orange)' : 'var(--navy-border)', borderRadius: 12, position: 'relative', transition: 'background 0.2s' }}>
                    <span style={{ position: 'absolute', top: 2, left: editForm.availabilityStatus ? 20 : 2, width: 20, height: 20, background: 'white', borderRadius: '50%', transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }} />
                  </div>
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setUpdateModal(null)} className="flex-1 btn-ghost">Cancel</button>
                <button type="submit" className="flex-1 btn-primary flex items-center justify-center gap-2" disabled={submitting}>
                  {submitting ? <div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> : <><FiCheck /> Save Changes</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── DELETE CONFIRM MODAL ─── */}
      {deleteModal && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setDeleteModal(null); }}>
          <div className="modal-box text-center">
            <div className="text-5xl mb-4">🗑️</div>
            <h2 className="font-display text-3xl mb-2" style={{ color: '#f87171' }}>DELETE CAR?</h2>
            <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
              This action cannot be undone. The listing will be permanently removed.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteModal(null)} className="flex-1 btn-ghost">Cancel</button>
              <button
                onClick={handleDelete}
                className="flex-1 font-ui font-semibold uppercase tracking-wider py-3 rounded flex items-center justify-center gap-2 transition-all"
                style={{ background: '#ef4444', color: 'white' }}
                disabled={submitting}
              >
                {submitting ? <div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> : <><FiTrash2 /> Delete</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyAddedCars;
