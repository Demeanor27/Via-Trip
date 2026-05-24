import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth.js';
import { ProtectedRoute } from './components/ProtectedRoute.jsx';
import Navbar from './components/Layout/Navbar.jsx';
import Login from './components/Auth/Login.jsx';
import Register from './components/Auth/Register.jsx';
import ForgotPassword from './components/Auth/ForgotPassword.jsx';
import ResetPassword from './components/Auth/ResetPassword.jsx';
import UserManagement from './components/Admin/UserManagement.jsx';
import TripSetupPage from './pages/TripSetupPage.jsx';
import HeroSection from './components/Home/HeroSection.jsx';
import FeatureBar from './components/Layout/FeatureBar.jsx';
import InspirationSection from './components/Home/InspirationSection.jsx';
import Footer from './components/Layout/Footer.jsx';

function Home() {
  const { user } = useAuth();
  return (
    <>
      <HeroSection />
      <FeatureBar variant="home" />
      <InspirationSection />
      <Footer variant="home" />
    </>
  );
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Navbar />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route
            path="/trips/new"
            element={
              <ProtectedRoute roles={['traveler', 'place_owner', 'admin']}>
                <TripSetupPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute roles={['admin']}>
                <UserManagement />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}
