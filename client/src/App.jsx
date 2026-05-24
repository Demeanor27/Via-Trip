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

function Home() {
  const { user } = useAuth();
  return (
    <div className="home-page">
      <h1>Welcome to Via-Trip</h1>
      {user ? (
        <p>Signed in as <strong>{user.name}</strong> ({user.role})</p>
      ) : (
        <p>Browse routes, discover places, and plan your journey.</p>
      )}
    </div>
  );
}

export default function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/trips/new" element={
            <ProtectedRoute roles={['traveler', 'place_owner', 'admin']}>
              <TripSetupPage />
            </ProtectedRoute>
          } />
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
      </main>
    </div>
  );
}
