"use client";

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import { API_BASE_URL } from '../lib/api';
import CarCard from '../components/CarCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { FiSearch, FiFilter, FiX } from 'react-icons/fi';

const API = API_BASE_URL;
const CAR_TYPES = ['All', 'SUV', 'Sedan', 'Hatchback', 'Luxury', 'Electric', 'Convertible', 'Pickup'];

const ExploreCars = () => {
  const searchParams = useSearchParams();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [activeType, setActiveType] = useState(searchParams.get('type') || 'All');
  const [sortBy, setSortBy] = useState('newest');

  const fetchCars = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('q', search);
      if (activeType !== 'All') params.set('type', activeType);
      params.set('sort', sortBy);

      const res = await axios.get(`${API}/cars?${params.toString()}`);
      setCars(res.data?.data || res.data || []);
    } catch {
      setCars([]);
    } finally {
      setLoading(false);
    }
  }, [search, activeType, sortBy]);

  useEffect(() => {
    document.title = 'Explore Cars — DriveFleet';
    fetchCars();
  }, [fetchCars]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCars();
  };

  const clearFilters = () => {
    setSearch('');
    setActiveType('All');
    setSortBy('newest');
  };

  return (
    <div className="page-enter min-h-screen pt-24 pb-20">
      {/* Header */}
      <div
        className="py-14 relative overflow-hidden"
        style={{ background: 'linear-gradient(to bottom, var(--navy-card), var(--navy))' }}
      >
        <div
          className="absolute inset-0 opacity-20 orange-stripe pointer-events-none"
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <p className="font-ui font-semibold tracking-widest uppercase text-sm mb-3" style={{ color: 'var(--orange)' }}>
            Our Fleet
          </p>
          <h1 className="section-title mb-4">EXPLORE ALL CARS</h1>
          <p className="text-base max-w-lg mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Browse our complete fleet. Filter by type, search by name, and find your perfect drive.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-10">
        {/* Search + Sort bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <form onSubmit={handleSearch} className="flex-1 relative">
            <FiSearch
              className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: 'var(--text-secondary)' }}
            />
            <input
              type="text"
              placeholder="Search by car name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="df-input pl-11 pr-4"
            />
          </form>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="df-select sm:w-48"
          >
            <option value="newest">Newest First</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="popular">Most Popular</option>
          </select>
          <button onClick={handleSearch} className="btn-primary flex items-center gap-2">
            <FiSearch /> Search
          </button>
        </div>

        {/* Type filter pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CAR_TYPES.map((type) => (
            <button
              key={type}
              onClick={() => setActiveType(type)}
              className="font-ui font-semibold text-xs tracking-wider uppercase px-4 py-2 rounded-full transition-all border"
              style={{
                background: activeType === type ? 'var(--orange)' : 'transparent',
                color: activeType === type ? 'white' : 'var(--text-secondary)',
                borderColor: activeType === type ? 'var(--orange)' : 'var(--navy-border)',
              }}
            >
              {type}
            </button>
          ))}
          {(search || activeType !== 'All') && (
            <button
              onClick={clearFilters}
              className="font-ui font-semibold text-xs tracking-wider uppercase px-4 py-2 rounded-full flex items-center gap-1 transition-all"
              style={{
                background: 'rgba(239,68,68,0.1)',
                color: '#f87171',
                border: '1px solid rgba(239,68,68,0.2)',
              }}
            >
              <FiX size={12} /> Clear
            </button>
          )}
        </div>

        {/* Results info */}
        {!loading && (
          <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
            Showing <span style={{ color: 'var(--text-primary)' }}>{cars.length}</span> vehicles
            {activeType !== 'All' && <> in <span style={{ color: 'var(--orange)' }}>{activeType}</span></>}
            {search && <> matching "<span style={{ color: 'var(--orange)' }}>{search}</span>"</>}
          </p>
        )}

        {/* Cars grid */}
        {loading ? (
          <LoadingSpinner fullPage={false} />
        ) : cars.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">🚗</div>
            <h3 className="font-ui font-bold text-xl mb-2">No cars found</h3>
            <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
              Try adjusting your search or filters
            </p>
            <button onClick={clearFilters} className="btn-outline">Clear Filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {cars.map((car) => <CarCard key={car._id} car={car} />)}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExploreCars;
