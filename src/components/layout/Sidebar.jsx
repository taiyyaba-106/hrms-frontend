import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import usePermissions from '../../hooks/usePermissions';
import { PERMISSIONS } from '../../utils/rbac';

const mainNavigationItems = [
  { name: 'Dashboard', path: '/dashboard', icon: '📊', permission: PERMISSIONS.PROFILE_VIEW_SELF },
  { name: 'Employees', path: '/employees', icon: '👥', permission: PERMISSIONS.EMPLOYEE_VIEW },
  { name: 'Organization', path: '/organization', icon: '🏢', permission: PERMISSIONS.EMPLOYEE_VIEW },
  { name: 'Attendance', path: '/attendance', icon: '⏱️', permission: PERMISSIONS.ATTENDANCE_MARK },
  { name: 'Timesheets', path: '/timesheets', icon: '📋', permission: PERMISSIONS.ATTENDANCE_MARK },
  { name: 'Leave', path: '/leave', icon: '🌴', permission: PERMISSIONS.LEAVE_APPLY },
  { name: 'Payroll', path: '/payroll', icon: '💳', permission: PERMISSIONS.SALARY_MANAGE },
  { name: 'Profile', path: '/profile', icon: '👤', permission: PERMISSIONS.PROFILE_VIEW_SELF },
];

const adminNavigationItems = [
  { name: 'Users', path: '/users', icon: '🔑', permission: PERMISSIONS.EMPLOYEE_CREATE },
  { name: 'Roles & Permissions', path: '/roles-permissions', icon: '🛡️', permission: PERMISSIONS.ROLE_MANAGE },
];

const Sidebar = ({ isCollapsed, onToggleCollapse, isMobileOpen, onCloseMobile }) => {
  const { hasPermission } = usePermissions();

  const visibleMainItems = mainNavigationItems.filter((item) =>
    item.permission ? hasPermission(item.permission) : true
  );

  const visibleAdminItems = adminNavigationItems.filter((item) =>
    item.permission ? hasPermission(item.permission) : true
  );

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      <div
        className={`hrms-mobile-overlay ${isMobileOpen ? 'hrms-mobile-overlay--open' : ''}`}
        onClick={onCloseMobile}
      />

      <aside
        className={`hrms-sidebar ${isCollapsed ? 'hrms-sidebar--collapsed' : ''} ${
          isMobileOpen ? 'hrms-sidebar--mobile-open' : ''
        }`}
      >
        {/* Brand Header */}
        <div className="hrms-sidebar-header">
          <Link to="/dashboard" className="hrms-sidebar-brand" onClick={onCloseMobile}>
            <div className="hrms-sidebar-logo">HR</div>
            {!isCollapsed && <span className="hrms-sidebar-brand-name">HRMS Portal</span>}
          </Link>

          <button
            type="button"
            className="hrms-sidebar-collapse-btn"
            onClick={onToggleCollapse}
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            aria-label="Toggle Sidebar"
          >
            {isCollapsed ? '➔' : '◀'}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="hrms-sidebar-nav">
          <div className="hrms-nav-section-title">{!isCollapsed ? 'Main Menu' : '•••'}</div>
          {visibleMainItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `hrms-nav-item ${isActive ? 'hrms-nav-item--active' : ''}`
              }
              title={isCollapsed ? item.name : undefined}
            >
              <span className="hrms-nav-icon">{item.icon}</span>
              {!isCollapsed && <span>{item.name}</span>}
            </NavLink>
          ))}

          {/* Admin Menu (Permission-Aware) */}
          {visibleAdminItems.length > 0 && (
            <>
              <div className="hrms-nav-section-title" style={{ marginTop: '0.75rem' }}>
                {!isCollapsed ? 'Administration' : '•••'}
              </div>
              {visibleAdminItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onCloseMobile}
                  className={({ isActive }) =>
                    `hrms-nav-item ${isActive ? 'hrms-nav-item--active' : ''}`
                  }
                  title={isCollapsed ? item.name : undefined}
                >
                  <span className="hrms-nav-icon">{item.icon}</span>
                  {!isCollapsed && <span>{item.name}</span>}
                </NavLink>
              ))}
            </>
          )}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
