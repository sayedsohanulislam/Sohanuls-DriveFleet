"use client";

import Link from 'next/link';
import { MdDirectionsCar, MdPhone, MdEmail, MdLocationOn } from 'react-icons/md';
import {
  FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube,
} from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

const Footer = () => {
  return (
    <footer
      className="border-t mt-24"
      style={{
        borderColor: 'var(--navy-border)',
        background: 'linear-gradient(to bottom, var(--navy), #040609)',
      }}
    >
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <MdDirectionsCar style={{ color: 'var(--orange)', fontSize: '1.8rem' }} />
            <span className="font-display text-2xl tracking-widest">
              DRIVE<span style={{ color: 'var(--orange)' }}>FLEET</span>
            </span>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Premium car rental for every journey. Experience luxury, freedom, and
            reliability on every road.
          </p>
          <div className="flex gap-3 mt-5">
            {[
              { icon: <FaFacebookF />, href: '#' },
              { icon: <FaXTwitter />, href: '#' },
              { icon: <FaInstagram />, href: '#' },
              { icon: <FaLinkedinIn />, href: '#' },
              { icon: <FaYoutube />, href: '#' },
            ].map((s, i) => (
              <a
                key={i}
                href={s.href}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-sm transition-all hover:scale-110"
                style={{
                  background: 'var(--navy-card)',
                  border: '1px solid var(--navy-border)',
                  color: 'var(--text-secondary)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--orange)';
                  e.currentTarget.style.color = 'var(--orange)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--navy-border)';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }}
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Useful Links */}
        <div>
          <h4 className="font-ui font-semibold tracking-widest uppercase text-sm mb-5"
            style={{ color: 'var(--orange)' }}>
            Useful Links
          </h4>
          <ul className="space-y-2">
            {[
              { to: '/', label: 'Home' },
              { to: '/explore', label: 'Explore Cars' },
              { to: '/add-car', label: 'List Your Car' },
              { to: '/my-bookings', label: 'My Bookings' },
              { to: '/login', label: 'Sign In' },
              { to: '/register', label: 'Create Account' },
            ].map((link) => (
              <li key={link.to}>
                <Link
                  href={link.to}
                  className="text-sm transition-colors hover:text-white flex items-center gap-2"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <span style={{ color: 'var(--orange)', fontSize: '0.5rem' }}>▶</span>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Car Types */}
        <div>
          <h4 className="font-ui font-semibold tracking-widest uppercase text-sm mb-5"
            style={{ color: 'var(--orange)' }}>
            Car Categories
          </h4>
          <ul className="space-y-2">
            {['SUV', 'Sedan', 'Hatchback', 'Luxury', 'Electric', 'Convertible'].map((cat) => (
              <li key={cat}>
                <Link
                  href={`/explore?type=${cat}`}
                  className="text-sm transition-colors hover:text-white flex items-center gap-2"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <span style={{ color: 'var(--orange)', fontSize: '0.5rem' }}>▶</span>
                  {cat}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-ui font-semibold tracking-widest uppercase text-sm mb-5"
            style={{ color: 'var(--orange)' }}>
            Contact Info
          </h4>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <MdLocationOn style={{ color: 'var(--orange)', marginTop: 2, flexShrink: 0 }} />
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                123 Fleet Avenue, Motor City, MC 10001
              </span>
            </li>
            <li className="flex items-center gap-3">
              <MdPhone style={{ color: 'var(--orange)' }} />
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                +1 (800) 555-FLEET
              </span>
            </li>
            <li className="flex items-center gap-3">
              <MdEmail style={{ color: 'var(--orange)' }} />
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                hello@drivefleet.com
              </span>
            </li>
          </ul>

          <div className="mt-6 p-3 rounded-lg" style={{ background: 'var(--navy-card)', border: '1px solid var(--navy-border)' }}>
            <p className="font-ui text-xs tracking-wider uppercase mb-1" style={{ color: 'var(--orange)' }}>
              24/7 Support
            </p>
            <p className="text-sm font-semibold">Always here to help you drive.</p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="border-t"
        style={{ borderColor: 'var(--navy-border)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            © {new Date().getFullYear()} DriveFleet. All rights reserved.
          </p>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            Built with passion for the open road.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
