# DriveFleet Server

Node.js + Express API for DriveFleet. Authentication uses Better Auth with MongoDB and Google OAuth.

## Local Setup

```bash
npm install
copy .env.example .env
npm run dev
```

Required `.env` values:

```env
PORT=5000
MONGODB_URI=mongodb+srv://...
DB_NAME=drivefleet
BETTER_AUTH_SECRET=replace_with_a_long_random_secret
BETTER_AUTH_URL=http://localhost:5000
CLIENT_URL=http://localhost:5173
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
ALLOW_VERCEL_PREVIEWS=false
```

## Vercel

Deploy this folder as a Vercel project with:

- Root Directory: `drivefleet-server/drivefleet-server`
- Build Command: leave empty or `npm install`
- Start Command: `npm start`

After deployment, set `BETTER_AUTH_URL` to your server URL, for example:

```env
BETTER_AUTH_URL=https://your-drivefleet-server.vercel.app
CLIENT_URL=https://your-drivefleet-client.vercel.app
```

Google OAuth callback URL:

```text
https://your-drivefleet-server.vercel.app/api/auth/callback/google
```

## API

| Method | Route | Auth | Description |
| --- | --- | --- | --- |
| GET | `/` | No | Health check |
| GET | `/api/auth/ok` | No | Better Auth health check |
| POST | `/api/auth/sign-in/email` | No | Better Auth email login |
| POST | `/api/auth/sign-up/email` | No | Better Auth email signup |
| GET/POST | `/api/auth/*` | No | Better Auth routes |
| GET | `/cars` | No | Get cars |
| GET | `/cars/:id` | No | Get one car |
| GET | `/my-cars?email=` | Yes | Get owner's cars |
| POST | `/cars` | Yes | Add car |
| PUT | `/cars/:id` | Yes | Update own car |
| DELETE | `/cars/:id` | Yes | Delete own car |
| GET | `/bookings?email=` | Yes | Get user's bookings |
| POST | `/bookings` | Yes | Create booking |
