import { useAuth } from '../context/AuthContext';
import {
  hasPermission as checkPermission,
  hasAnyPermission as checkAnyPermission,
  hasRole as checkRole,
  getUserPermissions,
} from '../utils/rbac';

/**
 * Custom Hook for evaluating permissions and roles in components
 */
export const usePermissions = () => {
  const { user } = useAuth();

  const userPermissions = getUserPermissions(user);
  const userRole = (user?.role || '').replace(/^ROLE_/, '').toUpperCase();

  const hasPermission = (permission) => checkPermission(user, permission);
  const hasAnyPermission = (permissions) => checkAnyPermission(user, permissions);
  const hasRole = (role) => checkRole(user, role);

  return {
    user,
    userRole,
    userPermissions,
    hasPermission,
    hasAnyPermission,
    hasRole,
  };
};

export default usePermissions;
