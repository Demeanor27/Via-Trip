import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';

const roleLabels = {
  guest: 'Guest',
  traveler: 'Traveler',
  place_owner: 'Place Owner',
  admin: 'Admin',
};

const navLinks = [
  { to: '/', label: 'Explore', icon: '#' },
  { to: '/how-it-works', label: 'How It Works', icon: '#' },
  { to: '/about', label: 'About Us', icon: '#' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <nav className="bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)] px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-200 rounded" />
          <div>
            <span className="font-bold text-lg text-brand-700">Via-Trip</span>
            <span className="block text-xs text-brand-400 leading-tight">Journey your way</span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                location.pathname === link.to
                  ? 'text-brand-500'
                  : 'text-[#4A4A3A] hover:text-brand-500'
              }`}
            >
              <span className="w-4 h-4 bg-gray-200 rounded inline-block" />
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                to="/trips/new"
                className="text-sm font-medium text-brand-500 hover:text-brand-600 transition-colors"
              >
                Plan Trip
              </Link>
              <span className="text-xs text-muted bg-brand-50 px-2 py-0.5 rounded">
                {roleLabels[user.role] || user.role}
              </span>
              {user.role === 'admin' && (
                <Link
                  to="/admin/users"
                  className="text-sm text-[#4A4A3A] hover:text-brand-500 transition-colors"
                >
                  Manage Users
                </Link>
              )}
              <span className="text-sm font-medium text-[#4A4A3A]">{user.name}</span>
              <button
                onClick={logout}
                className="text-sm text-[#6B6B58] hover:text-[#4A4A3A] transition-colors"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-brand-500 border-[1.5px] border-brand-500 rounded-[10px] hover:bg-[#F0F5EB] transition-colors"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-[12px] hover:bg-brand-600 transition-colors"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
