# DriveFleet

DriveFleet is a recruiter-friendly car rental platform built with React, Better Auth, Express, and MongoDB.

## Live Site

Replace this placeholder with your deployed client URL before publishing:

`https://your-drivefleet-client.vercel.app`

## Highlights

- Browse premium cars with search, filtering, sorting, and detailed listing cards.
- Sign in with email/password or Google through Better Auth.
- Add, update, and manage your own cars from authenticated private routes.
- Book vehicles and review your bookings from a protected dashboard flow.
- Responsive layout tuned for mobile, tablet, and desktop screens.
- Route refreshes are handled by Vercel rewrites so React Router paths keep working.

## Local Setup

```bash
npm install
copy .env.example .env
npm run dev
```

Client `.env`:

```env
VITE_API_URL=http://localhost:5000
```

## Vercel

Deploy this folder as a Vercel project with:

- Root Directory: `drivefleet-client/drivefleet-client`
- Framework Preset: Vite
- Build Command: `npm run build`
- Output Directory: `dist`
- Environment Variable: `VITE_API_URL=https://your-drivefleet-server.vercel.app`

The `vercel.json` file rewrites browser routes to `index.html`, so refreshes on `/login`, `/register`, `/my-cars`, and other React Router pages work.

## Tech

- React 18
- React Router DOM
- Tailwind CSS
- Better Auth React client
- Axios with credentials
- Node.js + Express API
- MongoDB database
