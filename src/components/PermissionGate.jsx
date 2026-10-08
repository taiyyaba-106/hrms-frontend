import React from 'react';
import usePermissions from '../hooks/usePermissions';

/**
 * Reusable PermissionGate component to conditionally render UI actions, buttons, or sub-views.
 *
 * Example usage:
 * <PermissionGate permission="EMPLOYEE_CREATE">
 *   <Button variant="primary">+ Create Employee</Button>
 * </PermissionGate>
 */
const PermissionGate = ({
  permission,
  role,
  requireAll = false,
  fallback = null,
  children,
}) => {
  const { hasPermission, hasAnyPermission, hasRole } = usePermissions();

  let isAllowed = true;

  // Evaluate role constraint if provided
  if (role) {
    isAllowed = isAllowed && hasRole(role);
  }

  // Evaluate permission constraint if provided
  if (permission) {
    if (Array.isArray(permission)) {
      if (requireAll) {
        isAllowed = isAllowed && permission.every((perm) => hasPermission(perm));
      } else {
        isAllowed = isAllowed && hasAnyPermission(permission);
      }
    } else {
      isAllowed = isAllowed && hasPermission(permission);
    }
  }

  if (!isAllowed) {
    return fallback;
  }

  return children;
};

export default PermissionGate;
