import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import usePermissions from '../hooks/usePermissions';
import { LoadingSpinner, ErrorState } from './ui';

const ProtectedRoute = ({
  requiredPermission = null,
  requiredRole = null,
  children,
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const { hasPermission, hasRole } = usePermissions();
  const location = useLocation();

  if (isLoading) {
    return (
      <div style={styles.loadingContainer}>
        <LoadingSpinner size="lg" />
        <p style={styles.loadingText}>Authenticating HRMS Session...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check route permission requirement
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return (
      <div style={{ padding: '2rem 1rem', maxWidth: '600px', margin: '0 auto' }}>
        <ErrorState
          title="403 - Access Forbidden"
          description="You do not have permission to view this page. If you believe this is an error, please contact your HR Administrator."
          icon="🛡️"
        />
      </div>
    );
  }

  // Check route role requirement
  if (requiredRole && !hasRole(requiredRole)) {
    return (
      <div style={{ padding: '2rem 1rem', maxWidth: '600px', margin: '0 auto' }}>
        <ErrorState
          title="403 - Access Restricted"
          description="This section is restricted to higher administrative roles."
          icon="🔒"
        />
      </div>
    );
  }

  return children;
};

const styles = {
  loadingContainer: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'var(--background)',
    gap: '1rem',
  },
  loadingText: {
    fontSize: '0.925rem',
    fontWeight: 500,
    color: 'var(--text-secondary)',
  },
};

export default ProtectedRoute;
