import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';

import Home from './pages/Home';
import ExploreCars from './pages/ExploreCars';
import CarDetails from './pages/CarDetails';
import AddCar from './pages/AddCar';
import MyAddedCars from './pages/MyAddedCars';
import MyBookings from './pages/MyBookings';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';

const Layout = ({ children, hideFooter = false }) => (
  <>
    <Navbar />
    <main>{children}</main>
    {!hideFooter && <Footer />}
  </>
);

const App = () => {
  return (
    <BrowserRouter>
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

        <Routes>
          {/* Public */}
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/explore" element={<Layout><ExploreCars /></Layout>} />
          <Route path="/car/:id" element={<Layout><CarDetails /></Layout>} />
          <Route path="/login" element={<Layout hideFooter><Login /></Layout>} />
          <Route path="/register" element={<Layout hideFooter><Register /></Layout>} />

          {/* Private */}
          <Route path="/add-car" element={
            <Layout>
              <PrivateRoute><AddCar /></PrivateRoute>
            </Layout>
          } />
          <Route path="/my-cars" element={
            <Layout>
              <PrivateRoute><MyAddedCars /></PrivateRoute>
            </Layout>
          } />
          <Route path="/my-bookings" element={
            <Layout>
              <PrivateRoute><MyBookings /></PrivateRoute>
            </Layout>
          } />

          {/* 404 */}
          <Route path="*" element={<Layout hideFooter><NotFound /></Layout>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
