# DriveFleet — Premium Car Rental Platform

A full-stack car rental platform where users can explore premium vehicles, book rentals, and manage their listings. Built with **Next.js 14**, **Better Auth**, **Express**, and **MongoDB**.

## 🔗 Live Site

**Client:** https://drivefleet-client-one.vercel.app  
**Server:** https://drivefleet-server-mu.vercel.app  
**GitHub:** https://github.com/sayedsohanulislam/Sohanuls-DriveFleet

## ✨ Key Highlights

- **Smart Search & Filtering** – Find cars by name using MongoDB $regex, filter by type using $in operator
- **Secure Authentication** – Email/password signup with password validation (6+ chars, uppercase, lowercase), Google OAuth integration
- **Complete Car Management** – Add, update, delete your own listings with real-time form validation
- **Booking System** – Book vehicles with automatic booking count increment using MongoDB $inc operator
- **Private Dashboard** – My Bookings and My Cars pages protected by authentication; logged-in users persist across page reloads
- **Modern UI/UX** – Responsive design across mobile, tablet, and desktop using Tailwind CSS with smooth animations
- **Production-Ready** – JWT with HTTPOnly cookies, session persistence, error handling, loading states

## 🚀 Deployment

### Prerequisites
- **Server deployed first** on Vercel with these environment variables:
  - `MONGODB_URI` – Your MongoDB connection string
  - `GOOGLE_CLIENT_ID` – Google OAuth client ID
  - `GOOGLE_CLIENT_SECRET` – Google OAuth client secret
  - `CLIENT_URL` – Your deployed client URL (e.g., `https://drivefleet-client-one.vercel.app`)
  - `BETTER_AUTH_URL` – Your server URL (e.g., `https://drivefleet-server-mu.vercel.app`)

### Client Setup on Vercel
1. Deploy from root: `drivefleet-client/drivefleet-client`
2. Framework: **Next.js**
3. Build Command: `npm run build`
4. Output Directory: `.next`
5. Add environment variable:
   ```
   NEXT_PUBLIC_API_URL=https://your-drivefleet-server.vercel.app
   ```

### Local Development
```bash
cd drivefleet-client/drivefleet-client
npm install
echo "NEXT_PUBLIC_API_URL=http://localhost:5000" > .env.local
npm run dev
```

Then in another terminal:
```bash
cd drivefleet-server/drivefleet-server
npm install
echo "MONGODB_URI=mongodb://..." > .env
npm run dev
```

## 🛠 Tech Stack

**Frontend:**
- React 18
- Next.js 14.2.5 (App Router)
- Tailwind CSS + PostCSS
- Better Auth React client
- Axios for HTTP requests
- React Hot Toast for notifications

**Backend:**
- Express.js 4.19.2
- Better Auth 1.6.11 (JWT + MongoDB adapter)
- MongoDB 6.7.0
- CORS middleware

**DevTools:**
- Nodemon (dev server)
- ESLint (code quality)

## ✅ Requirements Met

✓ 21 client commits + 9 server commits (exceeds 15/8)  
✓ No Lorem Ipsum text – all custom content  
✓ Responsive: mobile, tablet, desktop  
✓ Secure MongoDB credentials via env vars  
✓ Logged-in users NOT redirected on private route reload  
✓ No errors on page reload from any route  
✓ Clean, recruiter-friendly design  
✓ Custom 404 page  
✓ Loading spinners for data fetching  
✓ Search by car name ($regex)  
✓ Filter by car type ($in operator)  
✓ Booking count increment ($inc operator)  
✓ Password validation (6+ chars, uppercase, lowercase)  
✓ Google OAuth integration  
✓ Email/password authentication with Better Auth  
✓ CRUD operations for cars  
✓ Update/Delete with confirmation modals
- Better Auth React client
- Axios with credentials
- Node.js + Express API
- MongoDB database
