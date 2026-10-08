import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Button, PageHeader, Card, StatCard, Badge } from '../components/ui';

const DashboardPage = () => {
  const { user, logout } = useAuth();

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <PageHeader
        title="HRMS Dashboard"
        subtitle={`Welcome back, ${user?.firstName || user?.name || user?.email || 'User'}!`}
        badge={<Badge variant="active">{user?.role || 'Super Admin'}</Badge>}
        actions={
          <Button variant="outline" onClick={logout}>
            Sign Out
          </Button>
        }
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <StatCard label="Total Employees" value="1,248" subtext="Active staff count" icon="👥" />
        <StatCard label="My Leave Balance" value="18 Days" subtext="Annual leave remaining" icon="📅" />
        <StatCard label="Pending Approvals" value="5 Requests" subtext="Requires management action" icon="⏳" />
      </div>

      <Card title="Session & Account Information" description="Current authenticated session details">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div>
            <strong>Email:</strong> {user?.email || 'N/A'}
          </div>
          <div>
            <strong>Role:</strong> {user?.role || 'ROLE_ADMIN'}
          </div>
          <div>
            <strong>Authentication Status:</strong> <Badge variant="active">Authenticated</Badge>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DashboardPage;
