const DEFAULT_PROD_API_URL = 'https://drivefleet-server-mu.vercel.app';

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === 'production' ? DEFAULT_PROD_API_URL : 'http://localhost:5000');
