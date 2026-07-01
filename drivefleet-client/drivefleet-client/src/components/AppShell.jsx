"use client";

import { usePathname } from 'next/navigation';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '../context/AuthContext';
import Footer from './Footer';
import Navbar from './Navbar';

const HIDE_FOOTER_PATHS = new Set(['/login', '/register']);

const AppShell = ({ children }) => {
  const pathname = usePathname();
  const hideFooter = HIDE_FOOTER_PATHS.has(pathname);

  return (
    <AuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#0D1222',
            color: '#F0F0F0',
            border: '1px solid #1A2035',
            fontFamily: '"Barlow Condensed", sans-serif',
            letterSpacing: '0.03em',
          },
          success: {
            iconTheme: { primary: '#FF5500', secondary: '#F0F0F0' },
          },
          error: {
            iconTheme: { primary: '#f87171', secondary: '#F0F0F0' },
          },
        }}
      />
      <Navbar />
      <main>{children}</main>
      {!hideFooter && <Footer />}
    </AuthProvider>
  );
};

export default AppShell;
