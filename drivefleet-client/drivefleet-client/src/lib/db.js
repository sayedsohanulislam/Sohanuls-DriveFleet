import { MongoClient, ServerApiVersion } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017';
const DB_NAME = process.env.DB_NAME || 'drivefleet';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside your configuration.');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongo;

if (!cached) {
  cached = global.mongo = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true },
      serverSelectionTimeoutMS: 10000,
    };

    const client = new MongoClient(MONGODB_URI, opts);

    cached.promise = client.connect().then((connectedClient) => {
      const db = connectedClient.db(DB_NAME);
      return {
        client: connectedClient,
        db: db,
        carsCollection: db.collection('cars'),
        bookingsCollection: db.collection('bookings'),
      };
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  // Set up indexes if they haven't been configured yet
  try {
    await Promise.all([
      cached.conn.carsCollection.createIndex({ carName: 'text' }).catch(() => {}),
      cached.conn.carsCollection.createIndex({ ownerEmail: 1 }).catch(() => {}),
      cached.conn.carsCollection.createIndex({ carType: 1 }).catch(() => {}),
      cached.conn.bookingsCollection.createIndex({ userEmail: 1 }).catch(() => {}),
    ]);
  } catch (err) {
    console.error('Failed to create indexes:', err);
  }

  return cached.conn;
}
