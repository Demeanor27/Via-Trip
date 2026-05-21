import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';

const roleLabels = {
  guest: 'Guest',
  traveler: 'Traveler',
  place_owner: 'Place Owner',
  admin: 'Admin',
};

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">Via-Trip</Link>
      <div className="navbar-links">
        {user ? (
          <>
            <span className="navbar-role">{roleLabels[user.role] || user.role}</span>
            {user.role === 'admin' && <Link to="/admin/users">Manage Users</Link>}
            <span className="navbar-user">{user.name}</span>
            <button onClick={logout} className="btn-link">Sign Out</button>
          </>
        ) : (
          <>
            <Link to="/login">Sign In</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
