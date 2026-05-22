import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosSecure from '../hooks/useAxiosSecure';
import toast from 'react-hot-toast';
import { FiPlus, FiImage, FiInfo } from 'react-icons/fi';

const CAR_TYPES = ['SUV', 'Sedan', 'Hatchback', 'Luxury', 'Electric', 'Convertible', 'Pickup'];

const AddCar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    carName: '',
    dailyRent: '',
    carType: 'SUV',
    imageUrl: '',
    seatCapacity: '',
    pickupLocation: '',
    description: '',
    availabilityStatus: true,
  });

  useEffect(() => { document.title = 'Add Car — DriveFleet'; }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axiosSecure.post('/cars', {
        ...form,
        dailyRent: parseFloat(form.dailyRent),
        seatCapacity: parseInt(form.seatCapacity),
        ownerEmail: user.email,
        ownerName: user.displayName,
        ownerPhoto: user.photoURL,
        dateAdded: new Date(),
        bookingCount: 0,
      });
      toast.success('Car listed successfully! 🚗');
      navigate('/my-cars');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to add car. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const Field = ({ label, children }) => (
    <div>
      <label className="font-ui text-xs tracking-widest uppercase block mb-2" style={{ color: 'var(--text-secondary)' }}>
        {label}
      </label>
      {children}
    </div>
  );

  return (
    <div className="page-enter min-h-screen pt-24 pb-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-10">
          <p className="font-ui font-semibold tracking-widest uppercase text-sm mb-2" style={{ color: 'var(--orange)' }}>
            Fleet Management
          </p>
          <h1 className="section-title">ADD YOUR CAR</h1>
          <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
            List your vehicle and start earning. Fill in all details accurately.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl p-8 space-y-5"
          style={{ background: 'var(--navy-card)', border: '1px solid var(--navy-border)' }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="Car Name *">
              <input
                type="text"
                name="carName"
                required
                placeholder="e.g. Toyota RAV4"
                value={form.carName}
                onChange={handleChange}
                className="df-input"
              />
            </Field>

            <Field label="Daily Rent (USD) *">
              <input
                type="number"
                name="dailyRent"
                required
                min="1"
                placeholder="e.g. 75"
                value={form.dailyRent}
                onChange={handleChange}
                className="df-input"
              />
            </Field>

            <Field label="Car Type *">
              <select
                name="carType"
                required
                value={form.carType}
                onChange={handleChange}
                className="df-select"
              >
                {CAR_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </Field>

            <Field label="Seat Capacity *">
              <input
                type="number"
                name="seatCapacity"
                required
                min="1"
                max="20"
                placeholder="e.g. 5"
                value={form.seatCapacity}
                onChange={handleChange}
                className="df-input"
              />
            </Field>
          </div>

          <Field label="Image URL *">
            <div className="relative">
              <FiImage
                className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: 'var(--text-secondary)' }}
              />
              <input
                type="url"
                name="imageUrl"
                required
                placeholder="https://i.ibb.co/your-image.jpg"
                value={form.imageUrl}
                onChange={handleChange}
                className="df-input pl-10"
              />
            </div>
          </Field>

          {/* Preview */}
          {form.imageUrl && (
            <div className="rounded-xl overflow-hidden h-40">
              <img
                src={form.imageUrl}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>
          )}

          <Field label="Pickup Location *">
            <input
              type="text"
              name="pickupLocation"
              required
              placeholder="e.g. Downtown New York"
              value={form.pickupLocation}
              onChange={handleChange}
              className="df-input"
            />
          </Field>

          <Field label="Description">
            <textarea
              name="description"
              rows={4}
              placeholder="Describe your car — features, condition, special amenities..."
              value={form.description}
              onChange={handleChange}
              className="df-input resize-none"
            />
          </Field>

          {/* Availability */}
          <div
            className="flex items-center justify-between p-4 rounded-xl"
            style={{ background: 'rgba(255,85,0,0.06)', border: '1px solid rgba(255,85,0,0.15)' }}
          >
            <div>
              <div className="font-ui font-semibold tracking-wide">Availability Status</div>
              <div className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                Mark as available to start receiving bookings
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="availabilityStatus"
                checked={form.availabilityStatus}
                onChange={handleChange}
                className="sr-only peer"
              />
              <div
                className="w-11 h-6 rounded-full peer transition-all"
                style={{
                  background: form.availabilityStatus ? 'var(--orange)' : 'var(--navy-border)',
                  position: 'relative',
                }}
              >
                <span
                  className="absolute top-0.5 transition-all w-5 h-5 rounded-full"
                  style={{
                    background: 'white',
                    left: form.availabilityStatus ? '22px' : '2px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                  }}
                />
              </div>
            </label>
          </div>

          <div className="flex items-center gap-2 text-xs p-3 rounded-lg" style={{ background: 'rgba(59,130,246,0.08)', color: '#60a5fa' }}>
            <FiInfo size={14} className="flex-shrink-0" />
            Use imgbb.com or postimage.org to host your car image and paste the direct URL above.
          </div>

          <button
            type="submit"
            className="btn-primary w-full py-4 text-base flex items-center justify-center gap-2"
            disabled={submitting}
          >
            {submitting ? (
              <><div className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} /> Listing Car...</>
            ) : (
              <><FiPlus /> List My Car</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCar;
