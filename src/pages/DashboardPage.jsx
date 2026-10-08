import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button, PageHeader, Card, StatCard, Badge, Skeleton } from '../components/ui';
import employeeService from '../services/employeeService';
import leaveService from '../services/leaveService';

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({
    employeeCount: null,
    pendingLeaves: null,
    leaveBalance: 18,
  });
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchDashboardStats = async () => {
      try {
        setIsLoadingStats(true);
        const [empRes, leaveRes] = await Promise.allSettled([
          employeeService.getAllEmployees({ size: 1 }),
          leaveService.getLeaveRequests({ status: 'PENDING', size: 1 }),
        ]);

        if (isMounted) {
          let empCount = 0;
          if (empRes.status === 'fulfilled' && empRes.value) {
            const data = empRes.value;
            empCount = data.totalElements ?? data.total ?? (Array.isArray(data) ? data.length : (data.content?.length || 0));
          }

          let pendingCount = 0;
          if (leaveRes.status === 'fulfilled' && leaveRes.value) {
            const data = leaveRes.value;
            pendingCount = data.totalElements ?? data.total ?? (Array.isArray(data) ? data.length : (data.content?.length || 0));
          }

          setStats({
            employeeCount: empCount,
            pendingLeaves: pendingCount,
            leaveBalance: 18,
          });
        }
      } catch (err) {
        if (isMounted) {
          setStats({ employeeCount: 0, pendingLeaves: 0, leaveBalance: 18 });
        }
      } finally {
        if (isMounted) setIsLoadingStats(false);
      }
    };

    fetchDashboardStats();
    return () => {
      isMounted = false;
    };
  }, []);

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
        {isLoadingStats ? (
          <>
            <Skeleton height="110px" borderRadius="var(--radius-lg)" />
            <Skeleton height="110px" borderRadius="var(--radius-lg)" />
            <Skeleton height="110px" borderRadius="var(--radius-lg)" />
          </>
        ) : (
          <>
            <StatCard
              label="Total Employees"
              value={stats.employeeCount !== null ? stats.employeeCount.toLocaleString() : '0'}
              subtext="Active staff count"
              icon="👥"
            />
            <StatCard
              label="My Leave Balance"
              value={`${stats.leaveBalance} Days`}
              subtext="Annual leave remaining"
              icon="📅"
            />
            <StatCard
              label="Pending Approvals"
              value={`${stats.pendingLeaves} Requests`}
              subtext="Requires management action"
              icon="⏳"
            />
          </>
        )}
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
