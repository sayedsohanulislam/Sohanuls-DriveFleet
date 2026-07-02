# DriveFleet - Premium Car Rental Platform

DriveFleet is a full-stack car rental platform where users can browse cars, view details, book vehicles, manage bookings, and maintain their own car listings. The client is built with Next.js App Router, JavaScript, Tailwind CSS, Better Auth, Axios, and React Hot Toast.

## Live Links

- Client: https://drivefleet-client-one.vercel.app
- Server: https://drivefleet-server-mu.vercel.app
- GitHub: https://github.com/sayedsohanulislam/Sohanuls-DriveFleet

## Key Features

- Search cars by name using MongoDB regex and filter cars by type.
- Secure login, registration, Google OAuth, and persistent cookie-based sessions.
- Private Add Car, My Added Cars, and My Bookings pages.
- Full car CRUD for listing owners, including update and delete confirmation modals.
- Booking workflow with driver-needed choice, special note, total price, and booking count increment.
- Responsive recruiter-friendly UI for mobile, tablet, and desktop screens.
- Loading states, toast messages, and a custom 404 page.

## Local Development

Install and run the server first, then start this client.

```bash
cd drivefleet-server/drivefleet-server
npm install
copy .env.example .env
npm run dev
```

In a second terminal:

```bash
cd drivefleet-client/drivefleet-client
npm install
copy .env.example .env.local
npm run dev
```

Client environment values:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Vercel Deployment

Deploy the server folder first and set these server variables:

```env
MONGODB_URI=your_mongodb_connection_string
DB_NAME=drivefleet
BETTER_AUTH_SECRET=your_long_secret
BETTER_AUTH_URL=https://your-drivefleet-server.vercel.app
CLIENT_URL=https://your-drivefleet-client.vercel.app
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
ALLOW_VERCEL_PREVIEWS=false
```

Deploy this client folder with:

- Root Directory: `drivefleet-client/drivefleet-client`
- Framework: Next.js
- Build Command: `npm run build`
- Output Directory: `.next`

Set these client variables on Vercel:

```env
NEXT_PUBLIC_API_URL=https://your-drivefleet-server.vercel.app
NEXT_PUBLIC_SITE_URL=https://your-drivefleet-client.vercel.app
```

## Working With GitHub In VS Code

This workspace copy is not currently a Git repository. To work with your GitHub account in VS Code, clone the repository instead of editing a downloaded ZIP:

```bash
git clone https://github.com/sayedsohanulislam/Sohanuls-DriveFleet.git
cd Sohanuls-DriveFleet
code .
```

Then commit and push normally:

```bash
git status
git add .
git commit -m "Fix Next auth build and lint setup"
git push
```

The assignment asks for at least 15 notable client commits and 8 notable server commits, so keep client and server changes separated into meaningful commits.

## Verification

```bash
npm run lint
npm run build
```
