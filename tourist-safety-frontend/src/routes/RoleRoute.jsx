import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/authService';
import { resolveRoleHomePath } from '../utils/navigation';

export default function RoleRoute({ allowedRoles }) {
  const { user: contextUser } = useAuth();
  const user = contextUser ?? authService.getStoredUser();

  if (!user) return <Navigate to="/auth/login" replace />;

  const role = user.role?.toUpperCase?.();
  if (!allowedRoles.includes(role)) {
    return <Navigate to={resolveRoleHomePath(user)} replace />;
  }
  return <Outlet />;
}
