import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import {
  FiMenu, FiX, FiChevronDown, FiLogOut, FiPlus,
  FiCalendar, FiList, FiUser
} from 'react-icons/fi';
import { MdDirectionsCar } from 'react-icons/md';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setDropOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/');
    } catch {
      toast.error('Logout failed');
    }
    setDropOpen(false);
    setMenuOpen(false);
  };

  const navLinkClass = ({ isActive }) =>
    `font-ui font-semibold tracking-wider uppercase text-sm transition-colors ${
      isActive ? 'text-orange-500' : 'text-gray-300 hover:text-white'
    }`;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'py-3 border-b'
          : 'py-5'
      }`}
      style={{
        background: scrolled
          ? 'rgba(7, 11, 20, 0.95)'
          : 'linear-gradient(to bottom, rgba(7,11,20,0.9), transparent)',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderColor: scrolled ? 'var(--navy-border)' : 'transparent',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <MdDirectionsCar style={{ color: 'var(--orange)', fontSize: '1.8rem' }} />
          <span
            className="font-display text-2xl tracking-widest"
            style={{ color: 'var(--text-primary)' }}
          >
            DRIVE<span style={{ color: 'var(--orange)' }}>FLEET</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <NavLink to="/" className={navLinkClass} end>Home</NavLink>
          <NavLink to="/explore" className={navLinkClass}>Explore Cars</NavLink>
          {user && (
            <>
              <NavLink to="/add-car" className={navLinkClass}>Add Car</NavLink>
              <NavLink to="/my-bookings" className={navLinkClass}>My Bookings</NavLink>
            </>
          )}
        </div>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="relative" ref={dropRef}>
              <button
                onClick={() => setDropOpen(!dropOpen)}
                className="flex items-center gap-2 p-1 rounded-full transition-all hover:ring-2"
                style={{ ringColor: 'var(--orange)' }}
              >
                <img
                  src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || 'User')}&background=FF5500&color=fff`}
                  alt="Profile"
                  className="w-9 h-9 rounded-full object-cover border-2"
                  style={{ borderColor: 'var(--orange)' }}
                />
                <FiChevronDown
                  size={14}
                  className={`transition-transform ${dropOpen ? 'rotate-180' : ''}`}
                  style={{ color: 'var(--text-secondary)' }}
                />
              </button>

              {dropOpen && (
                <div
                  className="absolute right-0 mt-3 w-56 rounded-xl border overflow-hidden shadow-2xl"
                  style={{
                    background: 'var(--navy-card)',
                    borderColor: 'var(--navy-border)',
                    animation: 'slideUp 0.2s ease',
                  }}
                >
                  <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--navy-border)' }}>
                    <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                      {user.displayName || 'Driver'}
                    </p>
                    <p className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>
                      {user.email}
                    </p>
                  </div>
                  {[
                    { to: '/add-car', icon: <FiPlus />, label: 'Add Car' },
                    { to: '/my-bookings', icon: <FiCalendar />, label: 'My Bookings' },
                    { to: '/my-cars', icon: <FiList />, label: 'My Added Cars' },
                  ].map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setDropOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm transition-colors hover:bg-white/5"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      <span style={{ color: 'var(--orange)' }}>{item.icon}</span>
                      <span className="font-ui tracking-wide">{item.label}</span>
                    </Link>
                  ))}
                  <div className="border-t" style={{ borderColor: 'var(--navy-border)' }}>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-4 py-3 text-sm transition-colors hover:bg-red-500/10"
                      style={{ color: '#f87171' }}
                    >
                      <FiLogOut />
                      <span className="font-ui tracking-wide">Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login">
              <button className="btn-primary text-sm">Login</button>
            </Link>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ color: 'var(--text-primary)' }}
        >
          {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="md:hidden border-t mt-2"
          style={{
            background: 'rgba(7, 11, 20, 0.98)',
            borderColor: 'var(--navy-border)',
            animation: 'slideUp 0.2s ease',
          }}
        >
          <div className="px-4 py-4 flex flex-col gap-1">
            {[
              { to: '/', label: 'Home' },
              { to: '/explore', label: 'Explore Cars' },
              ...(user ? [
                { to: '/add-car', label: 'Add Car' },
                { to: '/my-bookings', label: 'My Bookings' },
                { to: '/my-cars', label: 'My Added Cars' },
              ] : []),
            ].map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-3 py-3 rounded-lg font-ui font-semibold tracking-wider uppercase text-sm transition-colors ${
                    isActive
                      ? 'bg-orange-500/10 text-orange-500'
                      : 'text-gray-300 hover:bg-white/5'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}

            {user ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-3 mt-2 rounded-lg text-sm font-ui tracking-wide"
                style={{ color: '#f87171', background: 'rgba(239, 68, 68, 0.06)' }}
              >
                <FiLogOut /> Logout
              </button>
            ) : (
              <Link to="/login" onClick={() => setMenuOpen(false)}>
                <button className="btn-primary w-full mt-2">Login</button>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
