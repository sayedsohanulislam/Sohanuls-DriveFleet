"use client";
import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4"
      style={{ background: 'var(--navy)' }}
    >
      <h1 className="font-display text-9xl mb-4" style={{ color: 'var(--orange)' }}>
        404
      </h1>
      <h2 className="text-3xl font-ui font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
        Lost in the Parking Lot?
      </h2>
      <p className="text-base mb-8 max-w-md" style={{ color: 'var(--text-secondary)' }}>
        We cannot seem to find the page you are looking for. The car might have been rented out, or the link is broken.
      </p>
      <Link href="/">
        <button className="btn-primary flex items-center gap-2 px-8 py-4 text-base">
          <FiArrowLeft /> Back to Home
        </button>
      </Link>
    </div>
  );
}