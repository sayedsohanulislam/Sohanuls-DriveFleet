import 'dotenv/config';
import { MongoClient, ServerApiVersion } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017';
const client = new MongoClient(uri, { serverApi: { version: ServerApiVersion.v1 } });

const cars = [
  {
    carName: 'BMW M5 Competition',
    dailyRent: 249,
    carType: 'Luxury',
    imageUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80',
    seatCapacity: 5,
    pickupLocation: 'Downtown Manhattan, NY',
    description: 'The ultimate sports sedan. 625hp V8 biturbo, 0–60 in 3.1 seconds. M Carbon ceramic brakes, adaptive M suspension, and a spine-tingling exhaust note.',
    availabilityStatus: true,
    bookingCount: 47,
    ownerEmail: 'fleet@drivefleet.com',
    ownerName: 'DriveFleet Official',
    dateAdded: new Date('2024-01-10'),
  },
  {
    carName: 'Porsche 911 Carrera S',
    dailyRent: 299,
    carType: 'Convertible',
    imageUrl: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80',
    seatCapacity: 4,
    pickupLocation: 'Beverly Hills, CA',
    description: 'Iconic sports car with 450hp flat-six engine. PDK transmission, Sport Chrono package included. A driving experience unlike any other.',
    availabilityStatus: true,
    bookingCount: 63,
    ownerEmail: 'fleet@drivefleet.com',
    ownerName: 'DriveFleet Official',
    dateAdded: new Date('2024-01-15'),
  },
  {
    carName: 'Range Rover Sport HSE',
    dailyRent: 189,
    carType: 'SUV',
    imageUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&q=80',
    seatCapacity: 7,
    pickupLocation: 'Chicago O\'Hare Airport, IL',
    description: 'The pinnacle of luxury SUVs. Panoramic roof, Meridian surround sound, terrain response 2 system. Perfect for city commutes and off-road adventures.',
    availabilityStatus: true,
    bookingCount: 38,
    ownerEmail: 'fleet@drivefleet.com',
    ownerName: 'DriveFleet Official',
    dateAdded: new Date('2024-02-01'),
  },
  {
    carName: 'Tesla Model S Plaid',
    dailyRent: 199,
    carType: 'Electric',
    imageUrl: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&q=80',
    seatCapacity: 5,
    pickupLocation: 'San Francisco, CA',
    description: '1,020hp tri-motor electric beast. 0–60 in under 2 seconds. 396mi range, Autopilot FSD, 17" cinematic display. The future is here.',
    availabilityStatus: true,
    bookingCount: 55,
    ownerEmail: 'fleet@drivefleet.com',
    ownerName: 'DriveFleet Official',
    dateAdded: new Date('2024-02-10'),
  },
  {
    carName: 'Mercedes-AMG G63',
    dailyRent: 349,
    carType: 'SUV',
    imageUrl: 'https://images.unsplash.com/photo-1520031441872-265e4ff70366?w=800&q=80',
    seatCapacity: 5,
    pickupLocation: 'Miami Beach, FL',
    description: 'The legendary G-Wagon with AMG power. 577hp biturbo V8, 3 locking differentials, Burmester 3D surround sound. An icon that commands attention.',
    availabilityStatus: true,
    bookingCount: 71,
    ownerEmail: 'fleet@drivefleet.com',
    ownerName: 'DriveFleet Official',
    dateAdded: new Date('2024-02-15'),
  },
  {
    carName: 'Audi RS6 Avant',
    dailyRent: 229,
    carType: 'Luxury',
    imageUrl: 'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=800&q=80',
    seatCapacity: 5,
    pickupLocation: 'Austin, TX',
    description: '591hp V8 biturbo estate. Quattro AWD, adaptive air suspension, matrix LED headlights. The world\'s fastest family car — subtle but devastating.',
    availabilityStatus: true,
    bookingCount: 29,
    ownerEmail: 'fleet@drivefleet.com',
    ownerName: 'DriveFleet Official',
    dateAdded: new Date('2024-03-01'),
  },
  {
    carName: 'Toyota Camry Hybrid',
    dailyRent: 79,
    carType: 'Sedan',
    imageUrl: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&q=80',
    seatCapacity: 5,
    pickupLocation: 'Atlanta, GA',
    description: 'The ultimate reliable sedan. 208hp hybrid powertrain, 51mpg city, Apple CarPlay, heated front seats. Comfort and efficiency in perfect balance.',
    availabilityStatus: true,
    bookingCount: 92,
    ownerEmail: 'fleet@drivefleet.com',
    ownerName: 'DriveFleet Official',
    dateAdded: new Date('2024-03-05'),
  },
  {
    carName: 'Lamborghini Huracán EVO',
    dailyRent: 599,
    carType: 'Luxury',
    imageUrl: 'https://images.unsplash.com/photo-1592198084033-aade902d1aae?w=800&q=80',
    seatCapacity: 2,
    pickupLocation: 'Las Vegas Strip, NV',
    description: '640hp naturally aspirated V10 mid-engine masterpiece. LDVI AI system, magnetorheological suspension, 202mph top speed. Make heads turn.',
    availabilityStatus: true,
    bookingCount: 18,
    ownerEmail: 'fleet@drivefleet.com',
    ownerName: 'DriveFleet Official',
    dateAdded: new Date('2024-03-10'),
  },
  {
    carName: 'Honda Civic Sport',
    dailyRent: 55,
    carType: 'Hatchback',
    imageUrl: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=800&q=80',
    seatCapacity: 5,
    pickupLocation: 'Seattle, WA',
    description: '158hp turbocharged engine, sporty bodywork, Honda Sensing safety suite. The best everyday hatchback — fun to drive, cheap to run.',
    availabilityStatus: true,
    bookingCount: 84,
    ownerEmail: 'fleet@drivefleet.com',
    ownerName: 'DriveFleet Official',
    dateAdded: new Date('2024-03-15'),
  },
  {
    carName: 'Ford F-150 Raptor R',
    dailyRent: 179,
    carType: 'Pickup',
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    seatCapacity: 5,
    pickupLocation: 'Denver, CO',
    description: '700hp supercharged V8 off-road monster. Fox Racing shocks, 37" BFGoodrich tires, 13" SYNC 4 display. Conquer any terrain with authority.',
    availabilityStatus: true,
    bookingCount: 43,
    ownerEmail: 'fleet@drivefleet.com',
    ownerName: 'DriveFleet Official',
    dateAdded: new Date('2024-04-01'),
  },
  {
    carName: 'Rivian R1S Electric SUV',
    dailyRent: 159,
    carType: 'Electric',
    imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80',
    seatCapacity: 7,
    pickupLocation: 'Portland, OR',
    description: '835hp quad-motor electric adventure SUV. 316mi range, air suspension, Camp Mode, 0–60 in 3 seconds. The off-road EV that changes everything.',
    availabilityStatus: true,
    bookingCount: 31,
    ownerEmail: 'fleet@drivefleet.com',
    ownerName: 'DriveFleet Official',
    dateAdded: new Date('2024-04-10'),
  },
  {
    carName: 'Bentley Continental GT',
    dailyRent: 449,
    carType: 'Luxury',
    imageUrl: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&q=80',
    seatCapacity: 4,
    pickupLocation: 'New York City, NY',
    description: '626hp W12 twin-turbo grand tourer. Hand-stitched leather, Naim 1500W audio, diamond-knurled controls. The definition of effortless luxury speed.',
    availabilityStatus: false,
    bookingCount: 22,
    ownerEmail: 'fleet@drivefleet.com',
    ownerName: 'DriveFleet Official',
    dateAdded: new Date('2024-04-15'),
  },
];

async function seed() {
  try {
    await client.connect();
    const db = client.db(process.env.DB_NAME || 'drivefleet');
    const carsCollection = db.collection('cars');

    const existing = await carsCollection.countDocuments();
    if (existing > 0) {
      console.log(`✅ Database already has ${existing} cars. Skipping seed.`);
      console.log('   To reseed, drop the cars collection first.');
    } else {
      const result = await carsCollection.insertMany(cars);
      console.log(`✅ Seeded ${result.insertedCount} cars into the database!`);
    }
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
  } finally {
    await client.close();
  }
}

seed();
