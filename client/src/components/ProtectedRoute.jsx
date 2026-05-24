import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

export function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="text-center py-10 text-gray-500">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold text-red-600 mb-2">Permission Denied</h2>
        <p className="text-gray-500">You do not have access to this page.</p>
      </div>
    );
  }

  return children;
}
