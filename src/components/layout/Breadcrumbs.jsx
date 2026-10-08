import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const breadcrumbMap = {
  dashboard: 'Dashboard',
  employees: 'Employees',
  organization: 'Organization',
  attendance: 'Attendance',
  timesheets: 'Timesheets',
  leave: 'Leave Requests',
  payroll: 'Payroll',
  profile: 'My Profile',
  users: 'User Accounts',
  'roles-permissions': 'Roles & Permissions',
  demo: 'Design System Demo',
};

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  if (pathnames.length === 0) {
    return (
      <div className="hrms-breadcrumb">
        <span className="hrms-breadcrumb-item hrms-breadcrumb-item--active">Dashboard</span>
      </div>
    );
  }

  return (
    <nav aria-label="Breadcrumb">
      <ol className="hrms-breadcrumb" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        <li>
          <Link to="/dashboard" className="hrms-breadcrumb-item">
            HRMS
          </Link>
        </li>
        {pathnames.map((name, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;
          const label = breadcrumbMap[name] || name.charAt(0).toUpperCase() + name.slice(1);

          return (
            <React.Fragment key={routeTo}>
              <li className="hrms-breadcrumb-separator">/</li>
              <li>
                {isLast ? (
                  <span className="hrms-breadcrumb-item hrms-breadcrumb-item--active">{label}</span>
                ) : (
                  <Link to={routeTo} className="hrms-breadcrumb-item">
                    {label}
                  </Link>
                )}
              </li>
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
