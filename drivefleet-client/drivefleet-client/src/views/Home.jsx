"use client";
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { API_BASE_URL } from '../lib/api';
import CarCard from '../components/CarCard';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  FiArrowRight, FiStar, FiCheckCircle, FiMapPin,
} from 'react-icons/fi';
import { MdSpeed, MdSecurity, MdSupportAgent } from 'react-icons/md';

const API = API_BASE_URL;

// Animated number counter
const CountUp = ({ end, label, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const duration = 1500; // 1.5 seconds
        const startTime = performance.now();
        
        const animate = (currentTime) => {
          const progress = Math.min((currentTime - startTime) / duration, 1);
          const currentCount = Math.floor(progress * end);
          setCount(currentCount);
          
          if (progress < 1) {
            requestAnimationFrame(animate);
          }
        };
        requestAnimationFrame(animate);
      }
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end]);

  return (
    <div ref={ref} className="text-center">
      <div className="font-display text-5xl md:text-6xl glow-orange-text" style={{ color: 'var(--orange)' }}>
        {count.toLocaleString()}{suffix}
      </div>
      <div className="font-ui tracking-widest uppercase text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
        {label}
      </div>
    </div>
  );
};

// Marquee brands ticker
const brands = ['BMW', 'PORSCHE', 'MERCEDES', 'FERRARI', 'LAMBORGHINI', 'AUDI', 'BENTLEY', 'TESLA', 'MASERATI', 'ROLLS-ROYCE', 'JAGUAR', 'LEXUS'];
const BrandTicker = () => (
  <div className="overflow-hidden border-y py-4" style={{ borderColor: 'rgba(255,85,0,0.2)' }}>
    <div className="brand-marquee flex items-center gap-12 whitespace-nowrap">
      {[...brands, ...brands].map((b, i) => (
        <span key={i} className="font-display text-xl tracking-widest shrink-0 flex items-center gap-12">
          <span style={{ color: i % 2 === 0 ? 'var(--orange)' : 'rgba(255,255,255,0.2)' }}>{b}</span>
        </span>
      ))}
    </div>
  </div>
);

// Testimonial card
const testimonials = [
  {
    name: 'Marcus Williams',
    role: 'Business Executive',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    rating: 5,
    text: 'Rented the BMW M5 for a weekend trip. Absolutely flawless — the car was immaculate, pickup was effortless, and the drive was unforgettable. DriveFleet sets the gold standard.',
    car: 'BMW M5 Competition',
  },
  {
    name: 'Sophia Chen',
    role: 'Travel Blogger',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    rating: 5,
    text: 'Booked a Range Rover for a mountain road trip. The booking process was seamless and the car was in perfect condition. I\'ve tried other rental platforms — none come close to this.',
    car: 'Range Rover Sport HSE',
  },
  {
    name: 'James Okafor',
    role: 'Software Engineer',
    avatar: 'https://randomuser.me/api/portraits/men/78.jpg',
    rating: 5,
    text: 'The Tesla Model S Plaid blew my mind. Lightning fast, futuristic interior, and zero hassle with the booking. The app was incredibly intuitive. 10/10 would book again.',
    car: 'Tesla Model S Plaid',
  },
];

const Home = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'DriveFleet — Premium Car Rental';
    axios.get(`${API}/cars?limit=6&sort=popular`)
      .then(res => { setCars(res.data?.data || res.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="page-enter">
      {/* ─── HERO ─── */}
      <section
        className="relative min-h-screen flex flex-col justify-center overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #040609 0%, #070B14 50%, #0a0d1a 100%)' }}
      >
        {/* Background decorations */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-5"
            style={{ background: 'linear-gradient(135deg, transparent 40%, var(--orange) 100%)', clipPath: 'polygon(30% 0, 100% 0, 100% 100%, 0% 100%)' }}
          />
          <div className="absolute inset-0 opacity-5 orange-stripe" />
          <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-10"
            style={{ background: 'var(--orange)' }} />
          <div className="absolute bottom-1/4 left-1/4 w-64 h-64 rounded-full blur-3xl opacity-5"
            style={{ background: '#3b82f6' }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-12 grid md:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <div>
            <div
              className="inline-flex items-center gap-2 font-ui text-xs tracking-widest uppercase mb-6 px-3 py-2 rounded-full border"
              style={{ color: 'var(--orange)', borderColor: 'rgba(255,85,0,0.3)', background: 'rgba(255,85,0,0.08)' }}
            >
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--orange)' }} />
              Premium Fleet Available Now
            </div>

            <h1 className="font-display leading-none mb-6"
              style={{ fontSize: 'clamp(3.5rem, 8vw, 6rem)', letterSpacing: '0.02em' }}>
              <span style={{ color: 'var(--text-primary)' }}>YOUR DRIVE</span><br />
              <span style={{ color: 'var(--orange)' }}>YOUR RULES.</span>
            </h1>

            <p className="text-base leading-relaxed mb-8 max-w-md" style={{ color: 'var(--text-secondary)' }}>
              Explore our curated fleet of premium vehicles. From city sedans to mountain SUVs —
              find the perfect car for every adventure.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/explore">
                <button className="btn-primary flex items-center gap-2 text-base px-8 py-4">
                  Explore Fleet <FiArrowRight />
                </button>
              </Link>
              <Link href="/register">
                <button className="btn-outline flex items-center gap-2 text-base px-8 py-4">
                  Get Started Free
                </button>
              </Link>
            </div>

            {/* Mini stats */}
            <div className="flex flex-wrap gap-8 mt-10">
              {[
                { value: '500+', label: 'Vehicles' },
                { value: '50+', label: 'Locations' },
                { value: '4.9★', label: 'Rating' },
              ].map((s) => (
                <div key={s.label}>
                  <div className="font-display text-2xl" style={{ color: 'var(--orange)' }}>{s.value}</div>
                  <div className="font-ui text-xs tracking-wider uppercase" style={{ color: 'var(--text-secondary)' }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero image */}
          <div className="relative hidden md:block">
            <div className="absolute -inset-4 rounded-2xl opacity-20"
              style={{ background: 'radial-gradient(circle, var(--orange), transparent 70%)' }} />
            <img
              src="https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&q=80"
              alt="Premium car"
              className="relative rounded-2xl w-full object-cover shadow-2xl"
              style={{ height: '420px', filter: 'brightness(0.9) contrast(1.05)' }}
            />
            {/* Floating badge */}
            <div className="absolute -bottom-5 -left-6 px-5 py-3 rounded-xl shadow-xl"
              style={{ background: 'var(--navy-card)', border: '1px solid var(--navy-border)' }}>
              <div className="font-ui text-xs tracking-wider uppercase" style={{ color: 'var(--text-secondary)' }}>From only</div>
              <div className="font-display text-3xl" style={{ color: 'var(--orange)' }}>$55<span className="text-base font-body font-normal">/day</span></div>
            </div>
            {/* Floating review card */}
            <div className="absolute -top-5 -right-4 px-4 py-3 rounded-xl shadow-xl flex items-center gap-3"
              style={{ background: 'var(--navy-card)', border: '1px solid var(--navy-border)' }}>
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="review" className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="flex gap-0.5 mb-0.5">
                  {[...Array(5)].map((_, i) => <FiStar key={i} size={10} fill="#FF5500" style={{ color: 'var(--orange)' }} />)}
                </div>
                <div className="font-ui text-xs" style={{ color: 'var(--text-secondary)' }}>5.0 · 2,400+ reviews</div>
              </div>
            </div>
          </div>
        </div>

        {/* Brand ticker */}
        <div className="relative z-10 mt-4">
          <BrandTicker />
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <div className="font-ui text-xs tracking-widest uppercase" style={{ color: 'var(--text-secondary)' }}>Scroll</div>
          <div className="w-px h-8 animate-pulse" style={{ background: 'var(--orange)' }} />
        </div>
      </section>

      {/* ─── STATS SECTION ─── */}
      <section className="py-16 border-y" style={{ borderColor: 'var(--navy-border)', background: 'var(--navy-card)' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          <CountUp end={5000} label="Happy Customers" suffix="+" />
          <CountUp end={500} label="Fleet Size" suffix="+" />
          <CountUp end={50} label="City Locations" suffix="+" />
          <CountUp end={99} label="Satisfaction Rate" suffix="%" />
        </div>
      </section>

      {/* ─── AVAILABLE CARS ─── */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <p className="font-ui font-semibold tracking-widest uppercase text-sm mb-2" style={{ color: 'var(--orange)' }}>
              Most Popular
            </p>
            <h2 className="section-title" style={{ color: 'var(--text-primary)' }}>
              TOP PICKS
            </h2>
          </div>
          <Link href="/explore">
            <button className="btn-outline flex items-center gap-2 text-sm">
              View All Cars <FiArrowRight />
            </button>
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner fullPage={false} />
        ) : cars.length === 0 ? (
          <div className="text-center py-16" style={{ color: 'var(--text-secondary)' }}>
            <p className="text-lg">No cars available yet.</p>
            <Link href="/add-car" className="mt-4 inline-block">
              <button className="btn-primary mt-4">Add First Car</button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.map((car) => <CarCard key={car._id} car={car} />)}
          </div>
        )}
      </section>

      {/* ─── WHY CHOOSE US ─── */}
      <section className="py-20 relative overflow-hidden"
        style={{ background: 'linear-gradient(to bottom, var(--navy), var(--navy-card))' }}>
        <div className="absolute inset-0 opacity-30 orange-stripe pointer-events-none" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <p className="font-ui font-semibold tracking-widest uppercase text-sm mb-2" style={{ color: 'var(--orange)' }}>
              Why Us
            </p>
            <h2 className="section-title">THE DRIVEFLEET DIFFERENCE</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <MdSpeed size={32} />,
                title: 'Instant Booking',
                desc: 'Reserve your car in under 60 seconds. No paperwork, no waiting — just pick up and drive.',
              },
              {
                icon: <MdSecurity size={32} />,
                title: 'Fully Insured',
                desc: 'Every vehicle comes with comprehensive insurance. Drive with total peace of mind.',
              },
              {
                icon: <MdSupportAgent size={32} />,
                title: '24/7 Roadside Support',
                desc: 'Our support team is always on standby to help you, anywhere, any time.',
              },
              {
                icon: <FiCheckCircle size={28} />,
                title: 'No Hidden Fees',
                desc: 'Transparent pricing. What you see is what you pay — no surprises at checkout.',
              },
              {
                icon: <FiStar size={28} />,
                title: 'Premium Fleet',
                desc: 'Carefully maintained vehicles ranging from everyday commuters to exotic luxury cars.',
              },
              {
                icon: <FiMapPin size={28} />,
                title: 'Flexible Pickup',
                desc: 'Multiple convenient pickup locations across the city to fit your schedule.',
              },
            ].map((item, i) => (
              <div key={i} className="card-hover p-6 rounded-xl"
                style={{ background: 'var(--navy-card)', border: '1px solid var(--navy-border)' }}>
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                  style={{ background: 'rgba(255,85,0,0.12)', color: 'var(--orange)' }}>
                  {item.icon}
                </div>
                <h3 className="font-ui font-bold tracking-wide text-lg mb-2">{item.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <p className="font-ui font-semibold tracking-widest uppercase text-sm mb-2" style={{ color: 'var(--orange)' }}>
            Reviews
          </p>
          <h2 className="section-title">WHAT DRIVERS SAY</h2>
          <div className="flex items-center justify-center gap-1 mt-4">
            {[...Array(5)].map((_, i) => (
              <FiStar key={i} size={18} fill="#FF5500" style={{ color: 'var(--orange)' }} />
            ))}
            <span className="ml-2 font-ui text-sm" style={{ color: 'var(--text-secondary)' }}>4.9 · 2,400+ reviews</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div key={i} className="card-hover p-6 rounded-xl relative overflow-hidden flex flex-col gap-4"
              style={{ background: 'var(--navy-card)', border: '1px solid var(--navy-border)' }}>
              {/* Quote mark decoration */}
              <span className="absolute top-4 right-5 font-display text-8xl opacity-5 leading-none select-none"
                style={{ color: 'var(--orange)' }}>"</span>

              {/* Stars */}
              <div className="flex gap-0.5">
                {[...Array(t.rating)].map((_, j) => (
                  <FiStar key={j} size={14} fill="#FF5500" style={{ color: 'var(--orange)' }} />
                ))}
              </div>

              {/* Review text */}
              <p className="text-sm leading-relaxed flex-1" style={{ color: 'var(--text-secondary)' }}>
                "{t.text}"
              </p>

              {/* Car tag */}
              <div className="text-xs px-3 py-1 rounded-full inline-block self-start"
                style={{ background: 'rgba(255,85,0,0.1)', color: 'var(--orange)', border: '1px solid rgba(255,85,0,0.2)' }}>
                Rented: {t.car}
              </div>

              {/* Author */}
              <div className="flex items-center gap-3 pt-3 border-t" style={{ borderColor: 'var(--navy-border)' }}>
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover"
                  style={{ border: '2px solid var(--orange)' }}
                  onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${t.name}&background=FF5500&color=fff`; }}
                />
                <div>
                  <div className="font-ui font-bold text-sm">{t.name}</div>
                  <div className="font-ui text-xs" style={{ color: 'var(--text-secondary)' }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="py-20 relative overflow-hidden"
        style={{ background: 'linear-gradient(to bottom, var(--navy-card), var(--navy))' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <p className="font-ui font-semibold tracking-widest uppercase text-sm mb-2" style={{ color: 'var(--orange)' }}>
              Simple Steps
            </p>
            <h2 className="section-title">HOW IT WORKS</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-px"
              style={{ background: 'linear-gradient(to right, transparent, var(--orange), transparent)' }} />
            {[
              { step: '01', title: 'Choose Your Car', desc: 'Browse our fleet and find the perfect vehicle for your needs.' },
              { step: '02', title: 'Book Instantly', desc: 'Select dates and confirm your booking in seconds.' },
              { step: '03', title: 'Pick It Up', desc: 'Head to the nearest pickup point and grab your keys.' },
              { step: '04', title: 'Enjoy the Ride', desc: 'Hit the road and return the car when you\'re done.' },
            ].map((s) => (
              <div key={s.step} className="text-center relative">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 relative z-10"
                  style={{ background: 'var(--navy-card)', border: '2px solid var(--orange)', boxShadow: '0 0 20px rgba(255,85,0,0.2)' }}>
                  <span className="font-display text-2xl" style={{ color: 'var(--orange)' }}>{s.step}</span>
                </div>
                <h3 className="font-ui font-bold tracking-wide text-lg mb-2">{s.title}</h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/explore">
              <button className="btn-primary text-base px-10 py-4 flex items-center gap-2 mx-auto">
                Start Driving Now <FiArrowRight />
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
