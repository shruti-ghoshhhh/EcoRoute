import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const ProtectedRoute = ({ children, requireAdmin }) => {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    // If not logged in, boot to login
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && user.role !== 'admin') {
    // If ordinary user tries to hit /admin, boot to dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
