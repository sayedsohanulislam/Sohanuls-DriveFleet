export const API_BASE_URL = '';

const SITE_ORIGIN =
  typeof window !== 'undefined'
    ? window.location.origin
    : process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const AUTH_BASE_URL = `${SITE_ORIGIN}/api/auth`;
