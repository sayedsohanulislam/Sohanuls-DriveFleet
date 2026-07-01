/** @type {import('next').NextConfig} */
const serverUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '');

const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/auth/:path*',
        destination: `${serverUrl}/api/auth/:path*`,
      },
      {
        source: '/cars/:path*',
        destination: `${serverUrl}/cars/:path*`,
      },
      {
        source: '/bookings/:path*',
        destination: `${serverUrl}/bookings/:path*`,
      },
      {
        source: '/my-cars',
        destination: `${serverUrl}/my-cars`,
      },
      {
        source: '/api/admin/stats',
        destination: `${serverUrl}/api/admin/stats`,
      },
    ];
  },
};

export default nextConfig;
