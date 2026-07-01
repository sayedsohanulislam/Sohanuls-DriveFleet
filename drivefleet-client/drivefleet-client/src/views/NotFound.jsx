"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const NotFound = () => {
  const router = useRouter();
  useEffect(() => { document.title = '404 — DriveFleet'; }, []);

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background: 'radial-gradient(ellipse at 50% 50%, rgba(255,85,0,0.05) 0%, var(--navy) 70%)',
      }}
    >
      <div className="text-center max-w-lg">
        {/* Big 404 */}
        <div
          className="font-display leading-none mb-4"
          style={{
            fontSize: 'clamp(8rem, 20vw, 14rem)',
            color: 'transparent',
            WebkitTextStroke: '2px rgba(255,85,0,0.3)',
            textShadow: '0 0 80px rgba(255,85,0,0.15)',
            letterSpacing: '-0.02em',
          }}
        >
          404
        </div>

        <div className="text-5xl mb-4">🚗💨</div>
        <h1 className="font-display text-4xl mb-3">ROAD CLOSED AHEAD</h1>
        <p className="text-base leading-relaxed mb-8" style={{ color: 'var(--text-secondary)' }}>
          Looks like you've taken a wrong turn. The page you're looking for
          doesn't exist or has been moved.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link href="/">
            <button className="btn-primary px-8 py-4 text-base">
              Back to Home
            </button>
          </Link>
          <button
            onClick={() => router.back()}
            className="btn-outline px-8 py-4 text-base"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
