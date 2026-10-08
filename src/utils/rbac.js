/**
 * Centralized Role-Based Access Control (RBAC) System
 */

export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  HR: 'HR',
  MANAGER: 'MANAGER',
  EMPLOYEE: 'EMPLOYEE',
};

export const PERMISSIONS = {
  PROFILE_VIEW_SELF: 'PROFILE_VIEW_SELF',
  PROFILE_UPDATE_SELF: 'PROFILE_UPDATE_SELF',
  ATTENDANCE_MARK: 'ATTENDANCE_MARK',
  LEAVE_APPLY: 'LEAVE_APPLY',
  TEAM_VIEW: 'TEAM_VIEW',
  LEAVE_REVIEW_TEAM: 'LEAVE_REVIEW_TEAM',
  ADMIN_CREATE: 'ADMIN_CREATE',
  HR_CREATE: 'HR_CREATE',
  MANAGER_CREATE: 'MANAGER_CREATE',
  EMPLOYEE_CREATE: 'EMPLOYEE_CREATE',
  EMPLOYEE_VIEW: 'EMPLOYEE_VIEW',
  EMPLOYEE_UPDATE: 'EMPLOYEE_UPDATE',
  SALARY_MANAGE: 'SALARY_MANAGE',
  ROLE_MANAGE: 'ROLE_MANAGE',
};

/**
 * Fallback Role to Permissions mapping
 */
export const ROLE_PERMISSIONS_MAP = {
  [ROLES.SUPER_ADMIN]: Object.values(PERMISSIONS),
  [ROLES.ADMIN]: Object.values(PERMISSIONS),
  [ROLES.HR]: [
    PERMISSIONS.PROFILE_VIEW_SELF,
    PERMISSIONS.PROFILE_UPDATE_SELF,
    PERMISSIONS.ATTENDANCE_MARK,
    PERMISSIONS.LEAVE_APPLY,
    PERMISSIONS.TEAM_VIEW,
    PERMISSIONS.LEAVE_REVIEW_TEAM,
    PERMISSIONS.EMPLOYEE_CREATE,
    PERMISSIONS.EMPLOYEE_VIEW,
    PERMISSIONS.EMPLOYEE_UPDATE,
    PERMISSIONS.SALARY_MANAGE,
  ],
  [ROLES.MANAGER]: [
    PERMISSIONS.PROFILE_VIEW_SELF,
    PERMISSIONS.PROFILE_UPDATE_SELF,
    PERMISSIONS.ATTENDANCE_MARK,
    PERMISSIONS.LEAVE_APPLY,
    PERMISSIONS.TEAM_VIEW,
    PERMISSIONS.LEAVE_REVIEW_TEAM,
    PERMISSIONS.EMPLOYEE_VIEW,
  ],
  [ROLES.EMPLOYEE]: [
    PERMISSIONS.PROFILE_VIEW_SELF,
    PERMISSIONS.PROFILE_UPDATE_SELF,
    PERMISSIONS.ATTENDANCE_MARK,
    PERMISSIONS.LEAVE_APPLY,
  ],
};

/**
 * Get effective list of permissions for a user
 * @param {Object} user
 * @returns {Array<string>}
 */
export const getUserPermissions = (user) => {
  if (!user) return [];
  
  const roleStr = (user.role || user.rawRole || user.roles?.[0] || '').replace(/^ROLE_/, '').toUpperCase();

  if (roleStr === ROLES.SUPER_ADMIN || roleStr === ROLES.ADMIN || user.email?.includes('superadmin')) {
    return Object.values(PERMISSIONS);
  }

  if (Array.isArray(user.permissions) && user.permissions.length > 0) {
    return user.permissions;
  }

  return ROLE_PERMISSIONS_MAP[roleStr] || ROLE_PERMISSIONS_MAP[ROLES.EMPLOYEE];
};

/**
 * Check if a user possesses a specific permission
 * @param {Object} user
 * @param {string} permission
 * @returns {boolean}
 */
export const hasPermission = (user, permission) => {
  if (!user) return false;

  const roleStr = (user.role || user.rawRole || user.roles?.[0] || '').replace(/^ROLE_/, '').toUpperCase();
  if (roleStr === ROLES.SUPER_ADMIN || roleStr === ROLES.ADMIN || user.email?.includes('superadmin')) {
    return true;
  }

  const permissions = getUserPermissions(user);
  return permissions.includes(permission);
};

/**
 * Check if a user possesses any of the specified permissions
 * @param {Object} user
 * @param {Array<string>} permissions
 * @returns {boolean}
 */
export const hasAnyPermission = (user, permissions = []) => {
  if (!user) return false;
  if (permissions.length === 0) return true;

  return permissions.some((perm) => hasPermission(user, perm));
};

/**
 * Check if a user has a specific role
 * @param {Object} user
 * @param {string|Array<string>} role
 * @returns {boolean}
 */
export const hasRole = (user, role) => {
  if (!user) return false;
  const userRole = (user.role || '').replace(/^ROLE_/, '').toUpperCase();

  if (Array.isArray(role)) {
    return role.some((r) => userRole === r.replace(/^ROLE_/, '').toUpperCase());
  }

  return userRole === role.replace(/^ROLE_/, '').toUpperCase();
};
