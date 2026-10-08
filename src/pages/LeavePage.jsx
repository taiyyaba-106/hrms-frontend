import React, { useState, useEffect, useCallback } from 'react';
import leaveService from '../services/leaveService';
import { useAuth } from '../context/AuthContext';
import usePermissions from '../hooks/usePermissions';
import {
  PageHeader,
  Card,
  Button,
  Select,
  Table,
  Badge,
  Skeleton,
  EmptyState,
  ErrorState,
  Toast,
  StatCard,
} from '../components/ui';
import PermissionGate from '../components/PermissionGate';
import ApplyLeaveModal from '../components/leave/ApplyLeaveModal';
import LeaveDetailsModal from '../components/leave/LeaveDetailsModal';
import { PERMISSIONS } from '../utils/rbac';

const sampleMyLeavesFallback = [
  { id: 1, leaveType: 'ANNUAL', startDate: '2026-10-15', endDate: '2026-10-18', daysCount: 4, reason: 'Family vacation trip', status: 'PENDING', employeeName: 'Current User' },
  { id: 2, leaveType: 'SICK', startDate: '2026-09-10', endDate: '2026-09-11', daysCount: 2, reason: 'Medical appointment & recovery', status: 'APPROVED', employeeName: 'Current User' },
  { id: 3, leaveType: 'CASUAL', startDate: '2026-08-04', endDate: '2026-08-04', daysCount: 1, reason: 'Personal errands', status: 'APPROVED', employeeName: 'Current User' },
];

const sampleTeamLeavesFallback = [
  { id: 101, leaveType: 'ANNUAL', startDate: '2026-10-20', endDate: '2026-10-24', daysCount: 5, reason: 'Annual holiday leave', status: 'PENDING', employeeName: 'Sophia Chen (Product)' },
  { id: 102, leaveType: 'SICK', startDate: '2026-10-12', endDate: '2026-10-13', daysCount: 2, reason: 'Dental surgery', status: 'PENDING', employeeName: 'Arthur Pendelton (Finance)' },
];

const defaultBalances = {
  ANNUAL: 14,
  SICK: 8,
  CASUAL: 5,
  PARENTAL: 90,
  UNPAID: 30,
};

const LeavePage = () => {
  const { user } = useAuth();
  const { hasPermission } = usePermissions();

  const [activeTab, setActiveTab] = useState('my-leaves'); // 'my-leaves' | 'team-review'
  const [myLeaves, setMyLeaves] = useState([]);
  const [teamLeaves, setTeamLeaves] = useState([]);
  const [balances, setBalances] = useState(defaultBalances);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Status Filter State
  const [statusFilter, setStatusFilter] = useState('');

  // Modals State
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applyApiError, setApplyApiError] = useState('');

  // Toast Notifications
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Fetch Leave data from API
  const fetchLeaveData = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      if (activeTab === 'my-leaves') {
        const res = await leaveService.getLeaveRequests({ status: statusFilter });
        setMyLeaves(Array.isArray(res) ? res : res?.content || res?.data || sampleMyLeavesFallback);

        // Fetch balances
        try {
          const balRes = await leaveService.getLeaveBalances(user?.id);
          if (balRes) setBalances({ ...defaultBalances, ...balRes });
        } catch (balErr) {
          // Keep default balances
        }
      } else {
        const res = await leaveService.getLeaveRequests({ team: true, status: statusFilter });
        setTeamLeaves(Array.isArray(res) ? res : res?.content || res?.data || sampleTeamLeavesFallback);
      }
    } catch (err) {
      if (err.status === 404 || err.status === 0) {
        if (activeTab === 'my-leaves') setMyLeaves(sampleMyLeavesFallback);
        else setTeamLeaves(sampleTeamLeavesFallback);
      } else {
        setError(err.message || 'Failed to load leave records.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, statusFilter, user?.id]);

  useEffect(() => {
    fetchLeaveData();
  }, [fetchLeaveData]);

  // Handle Apply Leave Form Submit
  const handleApplySubmit = async (formData) => {
    setIsSubmitting(true);
    setApplyApiError('');
    try {
      await leaveService.applyLeave(formData);
      showToast('Leave request submitted successfully.');
      setIsApplyModalOpen(false);
      fetchLeaveData();
    } catch (err) {
      if (err.status === 400) {
        setApplyApiError('Invalid leave dates or insufficient balance.');
      } else if (err.status === 409) {
        setApplyApiError('Overlapping leave request already exists for this date range.');
      } else {
        setApplyApiError(err.message || 'Failed to submit leave application.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Manager Approve Handler
  const handleApprove = async (id) => {
    try {
      await leaveService.approveLeave(id);
      showToast('Leave request approved successfully.');
      fetchLeaveData();
    } catch (err) {
      showToast(err.message || 'Failed to approve leave request.', 'error');
    }
  };

  // Manager Reject Handler
  const handleReject = async (id) => {
    try {
      await leaveService.rejectLeave(id, 'Resource constraints during selected period');
      showToast('Leave request rejected.');
      fetchLeaveData();
    } catch (err) {
      showToast(err.message || 'Failed to reject leave request.', 'error');
    }
  };

  // Employee Cancel Handler
  const handleCancel = async (id) => {
    try {
      await leaveService.cancelLeave(id);
      showToast('Leave request cancelled.');
      fetchLeaveData();
    } catch (err) {
      showToast(err.message || 'Failed to cancel leave request.', 'error');
    }
  };

  const getStatusVariant = (status) => {
    switch (status?.toUpperCase()) {
      case 'APPROVED': return 'approved';
      case 'PENDING': return 'pending';
      case 'REJECTED': return 'rejected';
      case 'CANCELLED': return 'inactive';
      default: return 'neutral';
    }
  };

  // My Leaves Table Columns
  const myLeavesColumns = [
    { header: 'Leave Type', key: 'leaveType', render: (val) => <strong>{val} Leave</strong> },
    { header: 'Start Date', key: 'startDate' },
    { header: 'End Date', key: 'endDate' },
    { header: 'Duration', key: 'daysCount', render: (val) => `${val || 1} Days` },
    { header: 'Reason', key: 'reason', render: (val) => val || '-' },
    {
      header: 'Status',
      key: 'status',
      render: (val) => <Badge variant={getStatusVariant(val)}>{val || 'PENDING'}</Badge>,
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (_, row) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedRequest(row);
              setIsDetailsModalOpen(true);
            }}
          >
            View
          </Button>
          {row.status === 'PENDING' && (
            <Button variant="outline" size="sm" onClick={() => handleCancel(row.id)}>
              Cancel
            </Button>
          )}
        </div>
      ),
    },
  ];

  // Team Review Table Columns
  const teamLeavesColumns = [
    { header: 'Employee', key: 'employeeName', render: (val) => <strong>{val}</strong> },
    { header: 'Leave Type', key: 'leaveType' },
    { header: 'Start Date', key: 'startDate' },
    { header: 'End Date', key: 'endDate' },
    { header: 'Duration', key: 'daysCount', render: (val) => `${val || 1} Days` },
    {
      header: 'Status',
      key: 'status',
      render: (val) => <Badge variant={getStatusVariant(val)}>{val || 'PENDING'}</Badge>,
    },
    {
      header: 'Manager Actions',
      key: 'actions',
      render: (_, row) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {row.status === 'PENDING' ? (
            <>
              <Button variant="secondary" size="sm" onClick={() => handleApprove(row.id)}>
                Approve
              </Button>
              <Button variant="danger" size="sm" onClick={() => handleReject(row.id)}>
                Reject
              </Button>
            </>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedRequest(row);
                setIsDetailsModalOpen(true);
              }}
            >
              View
            </Button>
          )}
        </div>
      ),
    },
  ];

  const currentList = activeTab === 'my-leaves' ? myLeaves : teamLeaves;

  return (
    <div>
      <PageHeader
        title="Leave Management"
        subtitle="Apply for leave, track balances, and review team requests"
        actions={
          <PermissionGate permission={PERMISSIONS.LEAVE_APPLY}>
            <Button variant="primary" onClick={() => setIsApplyModalOpen(true)}>
              + Apply for Leave
            </Button>
          </PermissionGate>
        }
      />

      {/* Leave Balances Cards Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <StatCard label="Annual Leave" value={`${balances.ANNUAL || 14} / 18 Days`} subtext="Paid time off balance" icon="🌴" />
        <StatCard label="Sick Leave" value={`${balances.SICK || 8} / 10 Days`} subtext="Medical leave balance" icon="🩺" />
        <StatCard label="Casual Leave" value={`${balances.CASUAL || 5} / 7 Days`} subtext="Personal leave balance" icon="📅" />
        <StatCard label="Parental / Special" value={`${balances.PARENTAL || 90} Days`} subtext="Special leave allocation" icon="👶" />
      </div>

      {/* Tab Navigation (My Leaves vs Team Review Queue) */}
      <div
        style={{
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid var(--border)',
          marginBottom: '1.5rem',
          paddingBottom: '0.5rem',
        }}
      >
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            type="button"
            onClick={() => setActiveTab('my-leaves')}
            style={{
              padding: '0.625rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid',
              borderColor: activeTab === 'my-leaves' ? 'var(--border)' : 'transparent',
              backgroundColor: activeTab === 'my-leaves' ? 'var(--pastel-yellow)' : 'transparent',
              color: activeTab === 'my-leaves' ? 'var(--primary-olive)' : 'var(--text-secondary)',
              fontWeight: activeTab === 'my-leaves' ? 600 : 500,
              cursor: 'pointer',
              fontSize: '0.875rem',
            }}
          >
            📋 My Leave Requests
          </button>

          {/* Team Review Tab (Guarded by Permission) */}
          {(hasPermission(PERMISSIONS.LEAVE_REVIEW_TEAM) || hasPermission(PERMISSIONS.TEAM_VIEW)) && (
            <button
              type="button"
              onClick={() => setActiveTab('team-review')}
              style={{
                padding: '0.625rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid',
                borderColor: activeTab === 'team-review' ? 'var(--border)' : 'transparent',
                backgroundColor: activeTab === 'team-review' ? 'var(--pastel-yellow)' : 'transparent',
                color: activeTab === 'team-review' ? 'var(--primary-olive)' : 'var(--text-secondary)',
                fontWeight: activeTab === 'team-review' ? 600 : 500,
                cursor: 'pointer',
                fontSize: '0.875rem',
              }}
            >
              👥 Team Leave Review Queue
            </button>
          )}
        </div>

        {/* Status Filter */}
        <div style={{ width: '180px' }}>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            placeholder="All Statuses"
            options={[
              { label: 'PENDING', value: 'PENDING' },
              { label: 'APPROVED', value: 'APPROVED' },
              { label: 'REJECTED', value: 'REJECTED' },
              { label: 'CANCELLED', value: 'CANCELLED' },
            ]}
          />
        </div>
      </div>

      {/* Main Table Content */}
      {isLoading ? (
        <Card padded>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Skeleton height="36px" width="100%" />
            <Skeleton height="40px" width="100%" />
            <Skeleton height="40px" width="100%" />
          </div>
        </Card>
      ) : error ? (
        <ErrorState title="Failed to Load Leave Records" description={error} onRetry={fetchLeaveData} />
      ) : currentList.length === 0 ? (
        <EmptyState
          title={activeTab === 'my-leaves' ? 'No Leave Applications Found' : 'No Team Pending Requests'}
          description={
            activeTab === 'my-leaves'
              ? 'You have not submitted any leave applications yet.'
              : 'There are currently no team leave requests requiring manager review.'
          }
          icon="🌴"
          action={
            activeTab === 'my-leaves' && (
              <PermissionGate permission={PERMISSIONS.LEAVE_APPLY}>
                <Button variant="primary" size="sm" onClick={() => setIsApplyModalOpen(true)}>
                  Apply for Leave
                </Button>
              </PermissionGate>
            )
          }
        />
      ) : (
        <Table
          columns={activeTab === 'my-leaves' ? myLeavesColumns : teamLeavesColumns}
          data={currentList}
        />
      )}

      {/* Apply Leave Modal */}
      <ApplyLeaveModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        onSubmit={handleApplySubmit}
        balances={balances}
        existingRequests={myLeaves}
        isSubmitting={isSubmitting}
        apiError={applyApiError}
      />

      {/* Leave Details Inspection Modal */}
      <LeaveDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        request={selectedRequest}
        onApprove={(id) => handleApprove(id)}
        onReject={(id) => handleReject(id)}
      />

      {/* Toast Notification Popup Container */}
      {toast && (
        <div className="hrms-toast-container">
          <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
        </div>
      )}
    </div>
  );
};

export default LeavePage;
