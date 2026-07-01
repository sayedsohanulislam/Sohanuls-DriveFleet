import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { MongoClient, ObjectId, ServerApiVersion } from 'mongodb';
import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { toNodeHandler } from 'better-auth/node';
import { jwt } from 'better-auth/plugins';

const app = express();
const PORT = process.env.PORT || 5000;
const DB_NAME = process.env.DB_NAME || 'drivefleet';
const MONGODB_URI =
  process.env.MONGODB_URI ||
  process.env.MONGO_URI ||
  process.env.MONGO_URL ||
  process.env.DATABASE_URL ||
  process.env.CONNECTION_STRING ||
  (!process.env.VERCEL && process.env.NODE_ENV !== 'production' ? 'mongodb://127.0.0.1:27017' : '');
const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';

const parseOrigins = (value) =>
  (value || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)
    .map((origin) => origin.replace(/\/$/, ''));

const clientOrigins = parseOrigins(process.env.CLIENT_URL || 'http://localhost:3000');
const allowVercelPreviews = process.env.ALLOW_VERCEL_PREVIEWS === 'true';
const hasGoogleOAuth = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

const isAllowedOrigin = (origin) => {
  if (!origin) return true;
  if (clientOrigins.includes(origin)) return true;

  try {
    const { protocol, hostname } = new URL(origin);
    return allowVercelPreviews && protocol === 'https:' && hostname.endsWith('.vercel.app');
  } catch {
    return false;
  }
};

const authBaseURL = (process.env.BETTER_AUTH_URL || `http://localhost:${PORT}`).replace(/\/$/, '');

const mongoClient = new MongoClient(MONGODB_URI, {
  serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true },
  serverSelectionTimeoutMS: 10000,
});

const db = mongoClient.db(DB_NAME);
const carsCollection = db.collection('cars');
const bookingsCollection = db.collection('bookings');
let mongoConnectionPromise;
let indexesReady = false;

const auth = betterAuth({
  baseURL: authBaseURL,
  database: mongodbAdapter(db),
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

const connectToDatabase = async () => {
  if (!MONGODB_URI) {
    throw new Error('Missing MongoDB connection string. Set MONGODB_URI in the deployment environment.');
  }

  if (!mongoConnectionPromise) {
    mongoConnectionPromise = mongoClient.connect().catch((error) => {
      mongoConnectionPromise = undefined;
      throw error;
    });
  }

  await mongoConnectionPromise;

  if (!indexesReady) {
    await Promise.all([
      carsCollection.createIndex({ carName: 'text' }).catch(() => {}),
      carsCollection.createIndex({ ownerEmail: 1 }).catch(() => {}),
      carsCollection.createIndex({ carType: 1 }).catch(() => {}),
      bookingsCollection.createIndex({ userEmail: 1 }).catch(() => {}),
    ]);
    indexesReady = true;
    console.log('Connected to MongoDB');
  }
};

app.use(
  cors({
    origin(origin, callback) {
      if (isAllowedOrigin(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error(`CORS blocked origin: ${origin}`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  }),
);

const headersFromRequest = (req) => {
  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (Array.isArray(value)) {
      headers.set(key, value.join(', '));
    } else if (value !== undefined) {
      headers.set(key, value);
    }
  }
  return headers;
};

const parseLimitedInt = (value, fallback = 50, max = 100) => {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return Math.min(parsed, max);
};

const verifySession = async (req, res, next) => {
  try {
    const session = await auth.api.getSession({
      headers: headersFromRequest(req),
    });

    if (!session?.user?.email) {
      return res.status(401).json({ message: 'Unauthorized access' });
    }

    req.user = {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      image: session.user.image,
      role: session.user.role,
    };
    next();
  } catch (error) {
    console.error('Session verification failed:', error);
    res.status(401).json({ message: 'Unauthorized access' });
  }
};

const verifyAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden: Admin access required' });
  }
  next();
};

app.get('/', (req, res) => {
  res.json({
    status: 'DriveFleet API is running',
    auth: '/api/auth/*',
    jwt: '/api/auth/token',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/auth/ok', (req, res) => {
  res.json({ success: true, auth: 'Better Auth is mounted' });
});

app.get('/api/admin/stats', verifySession, verifyAdmin, (req, res) => {
  res.json({
    success: true,
    message: 'Welcome, admin!',
    stats: {
      users: 100, // Replace with actual stats
      cars: 50, // Replace with actual stats
      bookings: 200, // Replace with actual stats
    },
  });
});

app.all('/api/auth/*', async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    res.status(500).json({ message: 'Database connection failed' });
  }
}, toNodeHandler(auth));

app.use(express.json());

app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    res.status(500).json({ message: 'Database connection failed' });
  }
});

app.get('/cars', async (req, res) => {
  try {
    const { q, type, sort, limit } = req.query;
    const query = {};
    const resultLimit = parseLimitedInt(limit);

    if (q) {
      const escapedSearch = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      query.carName = { $regex: escapedSearch, $options: 'i' };
    }
    if (type && type !== 'All') query.carType = { $in: [type] };

    let sortOption = { dateAdded: -1 };
    if (sort === 'price_asc') sortOption = { dailyRent: 1 };
    else if (sort === 'price_desc') sortOption = { dailyRent: -1 };
    else if (sort === 'popular') sortOption = { bookingCount: -1 };

    const cars = await carsCollection
      .find(query)
      .sort(sortOption)
      .limit(resultLimit)
      .toArray();

    res.json({ success: true, count: cars.length, data: cars });
  } catch (error) {
    console.error('GET /cars failed:', error);
    res.status(500).json({ message: 'Failed to fetch cars' });
  }
});

app.get('/cars/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid car ID' });

    const car = await carsCollection.findOne({ _id: new ObjectId(id) });
    if (!car) return res.status(404).json({ message: 'Car not found' });

    res.json(car);
  } catch (error) {
    console.error('GET /cars/:id failed:', error);
    res.status(500).json({ message: 'Failed to fetch car' });
  }
});

app.get('/my-cars', verifySession, async (req, res) => {
  try {
    const { email } = req.query;
    if (req.user.email !== email) return res.status(403).json({ message: 'Forbidden' });

    const cars = await carsCollection.find({ ownerEmail: email }).sort({ dateAdded: -1 }).toArray();
    res.json({ success: true, data: cars });
  } catch (error) {
    console.error('GET /my-cars failed:', error);
    res.status(500).json({ message: 'Failed to fetch your cars' });
  }
});

app.post('/cars', verifySession, async (req, res) => {
  try {
    const carData = req.body;
    const required = ['carName', 'dailyRent', 'carType', 'imageUrl', 'seatCapacity', 'pickupLocation'];

    for (const field of required) {
      if (!carData[field] && carData[field] !== 0) {
        return res.status(400).json({ message: `Missing field: ${field}` });
      }
    }

    const newCar = {
      ...carData,
      ownerEmail: req.user.email,
      ownerName: req.user.name || carData.ownerName || 'DriveFleet user',
      ownerPhoto: req.user.image || carData.ownerPhoto || '',
      dailyRent: Number.parseFloat(carData.dailyRent),
      seatCapacity: Number.parseInt(carData.seatCapacity, 10),
      bookingCount: 0,
      dateAdded: new Date(),
    };

    const result = await carsCollection.insertOne(newCar);
    res.status(201).json({ success: true, insertedId: result.insertedId });
  } catch (error) {
    console.error('POST /cars failed:', error);
    res.status(500).json({ message: 'Failed to add car' });
  }
});

app.put('/cars/:id', verifySession, async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid car ID' });

    const existing = await carsCollection.findOne({ _id: new ObjectId(id) });
    if (!existing) return res.status(404).json({ message: 'Car not found' });
    if (existing.ownerEmail !== req.user.email) return res.status(403).json({ message: 'Forbidden' });

    const update = { ...req.body };
    delete update._id;
    delete update.ownerEmail;
    delete update.ownerName;
    delete update.ownerPhoto;
    delete update.bookingCount;
    delete update.dateAdded;

    if (update.dailyRent) update.dailyRent = Number.parseFloat(update.dailyRent);
    if (update.seatCapacity) update.seatCapacity = Number.parseInt(update.seatCapacity, 10);

    await carsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...update, updatedAt: new Date() } },
    );

    res.json({ success: true });
  } catch (error) {
    console.error('PUT /cars/:id failed:', error);
    res.status(500).json({ message: 'Failed to update car' });
  }
});

app.delete('/cars/:id', verifySession, async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid car ID' });

    const existing = await carsCollection.findOne({ _id: new ObjectId(id) });
    if (!existing) return res.status(404).json({ message: 'Car not found' });
    if (existing.ownerEmail !== req.user.email) return res.status(403).json({ message: 'Forbidden' });

    await carsCollection.deleteOne({ _id: new ObjectId(id) });
    res.json({ success: true });
  } catch (error) {
    console.error('DELETE /cars/:id failed:', error);
    res.status(500).json({ message: 'Failed to delete car' });
  }
});

app.get('/bookings', verifySession, async (req, res) => {
  try {
    const { email } = req.query;
    if (req.user.email !== email) return res.status(403).json({ message: 'Forbidden' });

    const bookings = await bookingsCollection.find({ userEmail: email }).sort({ bookingDate: -1 }).toArray();
    res.json({ success: true, data: bookings });
  } catch (error) {
    console.error('GET /bookings failed:', error);
    res.status(500).json({ message: 'Failed to fetch bookings' });
  }
});

app.post('/bookings', verifySession, async (req, res) => {
  try {
    const data = req.body;
    if (!data.carId || !data.userEmail) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    if (data.userEmail !== req.user.email) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    if (!ObjectId.isValid(data.carId)) {
      return res.status(400).json({ message: 'Invalid car ID' });
    }

    const car = await carsCollection.findOne({ _id: new ObjectId(data.carId) });
    if (!car) return res.status(404).json({ message: 'Car not found' });
    if (!car.availabilityStatus) return res.status(400).json({ message: 'Car is not available' });
    if (car.ownerEmail === req.user.email) return res.status(400).json({ message: 'You cannot book your own listed car' });

    const newBooking = {
      ...data,
      userEmail: req.user.email,
      userName: req.user.name || data.userName || 'DriveFleet user',
      rentalDays: Number.parseInt(data.rentalDays, 10) || 1,
      totalPrice: Number.parseFloat(data.totalPrice),
      bookingDate: new Date(),
      status: 'confirmed',
    };

    const [insertResult] = await Promise.all([
      bookingsCollection.insertOne(newBooking),
      carsCollection.updateOne({ _id: new ObjectId(data.carId) }, { $inc: { bookingCount: 1 } }),
    ]);

    res.status(201).json({ success: true, insertedId: insertResult.insertedId });
  } catch (error) {
    console.error('POST /bookings failed:', error);
    res.status(500).json({ message: 'Booking failed' });
  }
});

app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`DriveFleet server running on port ${PORT}`);
  });
}

export default app;
