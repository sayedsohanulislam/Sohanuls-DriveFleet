# DriveFleet

DriveFleet is a recruiter-friendly car rental platform built with Next.js, Better Auth, Express, and MongoDB.

## Live Site

Replace this placeholder with your deployed client URL before publishing:

`https://your-drivefleet-client.vercel.app`

## Highlights

- Browse premium cars with search, filtering, sorting, and detailed listing cards.
- Sign in with email/password or Google through Better Auth.
- Add, update, and manage your own cars from authenticated private routes.
- Book vehicles and review your bookings from a protected dashboard flow.
- Responsive layout tuned for mobile, tablet, and desktop screens.
- Built with Next.js for optimized performance, routing, and SEO.

## Local Setup

```bash
npm install
copy .env.example .env
npm run dev
```

Client `.env`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

If you deploy the client and server separately, set `NEXT_PUBLIC_API_URL` to your live server URL.

## Vercel

Deploy this folder as a Vercel project with:

- Root Directory: `drivefleet-client/drivefleet-client`
- Framework Preset: Next.js
- Build Command: `npm run build`
- Output Directory: `.next`
- Environment Variable: `NEXT_PUBLIC_API_URL=https://your-drivefleet-server.vercel.app`

## Tech

- React 18
- Next.js App Router
- Tailwind CSS
- Better Auth React client
- Axios with credentials
- Node.js + Express API
- MongoDB database
