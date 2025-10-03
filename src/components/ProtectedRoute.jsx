import { useAuth } from '../context/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  console.log('🛡️ ProtectedRoute - State:', { 
    user: user ? 'Authenticated' : 'Not authenticated', 
    loading, 
    path: location.pathname 
  });

  if (loading) {
    console.log('🛡️ ProtectedRoute - Showing loading...');
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log('🛡️ ProtectedRoute - No user, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && user.role !== 'admin') {
    console.log('🛡️ ProtectedRoute - Not admin, redirecting to dashboard');
    return <Navigate to="/dashboard" replace />;
  }

  console.log('🛡️ ProtectedRoute - Access granted');
  return children;
};

export default ProtectedRoute;