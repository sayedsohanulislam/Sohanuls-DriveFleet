"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import axiosSecure from '../../hooks/useAxiosSecure';
import toast from 'react-hot-toast';

export default function AddCar() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const form = e.target;
    const carData = {
      carName: form.carName.value,
      dailyRent: parseFloat(form.dailyRent.value),
      carType: form.carType.value,
      imageUrl: form.imageUrl.value,
      seatCapacity: parseInt(form.seatCapacity.value),
      pickupLocation: form.pickupLocation.value,
      description: form.description.value,
      availabilityStatus: true, // Defaults to available
      ownerEmail: user.email,
    };

    try {
      await axiosSecure.post('/cars', carData);
      toast.success('Car listed successfully!');
      router.push('/my-cars');
    } catch (error) {
      toast.error('Failed to add car. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-3xl mx-auto p-8 rounded-2xl" style={{ background: 'var(--navy-card)', border: '1px solid var(--navy-border)' }}>
        <h1 className="font-display text-4xl mb-6 text-center">ADD A NEW CAR</h1>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-1 md:col-span-2">
            <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--text-secondary)' }}>Car Model Name</label>
            <input type="text" name="carName" required className="df-input w-full" placeholder="e.g. BMW M5 Competition" />
          </div>
          
          <div>
            <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--text-secondary)' }}>Daily Rent Price ($)</label>
            <input type="number" name="dailyRent" required min="1" className="df-input w-full" placeholder="150" />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--text-secondary)' }}>Car Type</label>
            <select name="carType" required className="df-input w-full">
              <option value="SUV">SUV</option>
              <option value="Sedan">Sedan</option>
              <option value="Hatchback">Hatchback</option>
              <option value="Luxury">Luxury</option>
              <option value="Electric">Electric</option>
            </select>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--text-secondary)' }}>Seat Capacity</label>
            <input type="number" name="seatCapacity" required min="1" max="15" className="df-input w-full" placeholder="5" />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--text-secondary)' }}>Pickup Location</label>
            <input type="text" name="pickupLocation" required className="df-input w-full" placeholder="e.g. Downtown NY" />
          </div>

          <div className="col-span-1 md:col-span-2">
            <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--text-secondary)' }}>Image URL</label>
            <input type="url" name="imageUrl" required className="df-input w-full" placeholder="https://i.ibb.co/..." />
          </div>

          <div className="col-span-1 md:col-span-2">
            <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--text-secondary)' }}>Description</label>
            <textarea name="description" required rows="4" className="df-input w-full py-3" placeholder="Tell us about the car..."></textarea>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full col-span-1 md:col-span-2 py-4">
            {loading ? 'Listing Car...' : 'List Car for Rent'}
          </button>
        </form>
      </div>
    </div>
  );
}