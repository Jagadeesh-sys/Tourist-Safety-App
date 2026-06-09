import { Navigate, Outlet } from 'react-router-dom';
import { authService } from '../services/authService';

export default function ProtectedRoute() {
  return authService.isAuthenticated() ? <Outlet /> : <Navigate to="/auth/login" replace />;
}
