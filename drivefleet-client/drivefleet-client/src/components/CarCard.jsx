import { Link } from 'react-router-dom';
import { FiMapPin, FiUsers, FiZap } from 'react-icons/fi';
import { MdLocalFireDepartment } from 'react-icons/md';

const CAR_PLACEHOLDER = 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&q=80';

const CarCard = ({ car }) => {
  const {
    _id,
    carName,
    dailyRent,
    carType,
    imageUrl,
    seatCapacity,
    pickupLocation,
    availabilityStatus,
    bookingCount = 0,
  } = car;

  const isHot = bookingCount >= 40;
  const isNew = bookingCount === 0;
  const isElectric = carType === 'Electric';

  return (
    <div className="car-card group relative rounded-xl overflow-hidden flex flex-col"
      style={{ background: 'var(--navy-card)', border: '1px solid var(--navy-border)' }}
    >
      {/* Shimmer line on hover */}
      <div className="car-card-shine" />

      {/* Image */}
      <div className="relative overflow-hidden" style={{ height: '200px' }}>
        <img
          src={imageUrl || CAR_PLACEHOLDER}
          alt={carName}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={(e) => { e.target.src = CAR_PLACEHOLDER; }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        {/* Top gradient for badges */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent h-16" />

        {/* Type badge */}
        <span
          className="absolute top-3 left-3 font-ui font-bold text-xs tracking-wider uppercase px-2.5 py-1 rounded"
          style={{
            background: isElectric ? 'rgba(34,197,94,0.9)' : 'var(--orange)',
            color: 'white',
            backdropFilter: 'blur(4px)',
          }}
        >
          {isElectric && <FiZap className="inline mr-1" size={10} />}
          {carType || 'Car'}
        </span>

        {/* Hot / New badge */}
        {isHot && (
          <span
            className="absolute top-3 right-3 font-ui font-bold text-xs tracking-wider uppercase px-2 py-1 rounded flex items-center gap-1"
            style={{ background: 'rgba(239,68,68,0.9)', color: 'white', backdropFilter: 'blur(4px)' }}
          >
            <MdLocalFireDepartment size={12} /> HOT
          </span>
        )}
        {isNew && !isHot && (
          <span
            className="absolute top-3 right-3 font-ui font-bold text-xs tracking-wider uppercase px-2 py-1 rounded"
            style={{ background: 'rgba(59,130,246,0.9)', color: 'white', backdropFilter: 'blur(4px)' }}
          >
            NEW
          </span>
        )}
        {!isHot && !isNew && (
          <span
            className={`absolute top-3 right-3 font-ui font-bold text-xs tracking-wider uppercase px-2 py-1 rounded`}
            style={{
              background: availabilityStatus ? 'rgba(34,197,94,0.85)' : 'rgba(239,68,68,0.85)',
              color: 'white',
              backdropFilter: 'blur(4px)',
            }}
          >
            {availabilityStatus ? 'Available' : 'Booked'}
          </span>
        )}

        {/* Price on image (bottom-left) */}
        <div className="absolute bottom-3 left-3">
          <span className="font-display text-3xl" style={{ color: 'white', textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>
            ${dailyRent}
          </span>
          <span className="text-xs ml-1" style={{ color: 'rgba(255,255,255,0.7)' }}>/day</span>
        </div>

        {/* Booking count */}
        {bookingCount > 0 && (
          <div className="absolute bottom-3 right-3 font-ui text-xs px-2 py-1 rounded"
            style={{ background: 'rgba(0,0,0,0.6)', color: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(4px)' }}>
            {bookingCount} booked
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 gap-2.5">
        <h3 className="font-ui font-bold text-lg tracking-wide leading-tight"
          style={{ color: 'var(--text-primary)' }}>
          {carName}
        </h3>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-secondary)' }}>
            <FiMapPin size={11} style={{ color: 'var(--orange)', flexShrink: 0 }} />
            <span className="truncate">{pickupLocation || 'N/A'}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-secondary)' }}>
            <FiUsers size={11} style={{ color: 'var(--orange)', flexShrink: 0 }} />
            <span>{seatCapacity || '—'} seats</span>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-auto pt-3 border-t" style={{ borderColor: 'var(--navy-border)' }}>
          <Link to={`/car/${_id}`} className="block">
            <button
              className="w-full btn-primary text-xs py-2.5 group-hover:shadow-orange transition-all"
              style={{ background: availabilityStatus ? 'var(--orange)' : '#374151' }}
            >
              {availabilityStatus ? 'View Details' : 'View Car'}
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CarCard;
