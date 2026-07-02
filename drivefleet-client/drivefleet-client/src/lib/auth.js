import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { jwt } from 'better-auth/plugins';
import { MongoClient, ServerApiVersion } from 'mongodb';
import { headers } from 'next/headers';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017';
const DB_NAME = process.env.DB_NAME || 'drivefleet';

const clientOrigins = (process.env.CLIENT_URL || 'http://localhost:3000')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)
  .map((origin) => origin.replace(/\/$/, ''));

const allowVercelPreviews = process.env.ALLOW_VERCEL_PREVIEWS === 'true';
const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';
const hasGoogleOAuth = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

const mongoClient = new MongoClient(MONGODB_URI, {
  serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true },
});
const db = mongoClient.db(DB_NAME);

// For Next.js unified project, the auth URL is served at /api/auth
const authBaseURL = (process.env.BETTER_AUTH_URL || 'http://localhost:3000').replace(/\/$/, '');

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client: mongoClient,
  }),
  hooks: {
    onUserCreated: (user) => {
      return { ...user, role: user.role || 'user' };
    },
  },
  trustedOrigins: [
    ...clientOrigins,
    ...(allowVercelPreviews ? ['https://*.vercel.app'] : []),
  ],
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: hasGoogleOAuth
    ? {
        google: {
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        },
      }
    : undefined,
  plugins: [
    jwt({
      jwt: {
        expirationTime: '12h',
        issuer: authBaseURL,
        audience: authBaseURL,
        definePayload: ({ user }) => ({
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
        }),
      },
    }),
  ],
  advanced: {
    defaultCookieAttributes: {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
    },
  },
});

export async function getSessionUser() {
  const session = await auth.api.getSession({
    headers: headers(),
  });
  if (!session?.user?.email) return null;
  return session.user;
}
