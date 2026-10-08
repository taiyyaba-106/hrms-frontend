import React, { useState } from 'react';
import {
  Button,
  Input,
  Select,
  Card,
  Modal,
  Badge,
  Table,
  PageHeader,
  StatCard,
  Alert,
  Toast,
  LoadingSpinner,
  Skeleton,
  EmptyState,
  ErrorState,
  ConfirmDialog,
} from '../components/ui';

const DesignSystemDemo = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [showToast, setShowToast] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const [selectValue, setSelectValue] = useState('');

  const sampleTableColumns = [
    { header: 'Employee', key: 'name' },
    { header: 'Department', key: 'department' },
    { header: 'Role', key: 'role' },
    {
      header: 'Status',
      key: 'status',
      render: (val) => <Badge variant={val.toLowerCase()}>{val}</Badge>,
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (_, row) => (
        <Button variant="ghost" size="sm" onClick={() => alert(`Clicked action for ${row.name}`)}>
          Edit
        </Button>
      ),
    },
  ];

  const sampleTableData = [
    { id: 1, name: 'Eleanor Vance', department: 'Engineering', role: 'Lead Developer', status: 'ACTIVE' },
    { id: 2, name: 'Marcus Brody', department: 'Human Resources', role: 'HR Manager', status: 'APPROVED' },
    { id: 3, name: 'Sophia Chen', department: 'Design', role: 'UI/UX Designer', status: 'PENDING' },
    { id: 4, name: 'Arthur Pendelton', department: 'Finance', role: 'Financial Analyst', status: 'REJECTED' },
    { id: 5, name: 'Clara Oswald', department: 'Operations', role: 'Operations Officer', status: 'TERMINATED' },
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <PageHeader
        title="HRMS Design System"
        subtitle="Comprehensive visual reference and reusable component library"
        badge={<Badge variant="active">System v1.0</Badge>}
        actions={
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Button variant="outline" onClick={() => setIsConfirmOpen(true)}>
              Test Confirm
            </Button>
            <Button variant="primary" onClick={() => setIsModalOpen(true)}>
              Open Modal Demo
            </Button>
          </div>
        }
      />

      {/* Color Palette Display */}
      <section style={{ marginBottom: '2.5rem' }}>
        <Card title="Global Color Tokens" description="Warm pastel palette & olive accent tokens">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
            {[
              { name: 'Pastel Yellow', hex: '#FFFDD1', var: '--pastel-yellow' },
              { name: 'Light Yellow-Green', hex: '#E8F2C7', var: '--light-yellow-green' },
              { name: 'Pastel Green', hex: '#CEEDB6', var: '--pastel-green' },
              { name: 'Soft Green', hex: '#B3D9A5', var: '--soft-green' },
              { name: 'Primary Olive', hex: '#2D4733', var: '--primary-olive', dark: true },
              { name: 'Background', hex: '#F7FAF2', var: '--background' },
              { name: 'Text Primary', hex: '#26382A', var: '--text-primary', dark: true },
              { name: 'Text Secondary', hex: '#667565', var: '--text-secondary', dark: true },
              { name: 'Border', hex: '#DDE7D6', var: '--border' },
            ].map((c) => (
              <div
                key={c.var}
                style={{
                  backgroundColor: c.hex,
                  color: c.dark ? '#FFFFFF' : '#26382A',
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                }}
              >
                <div>{c.name}</div>
                <div style={{ opacity: 0.8, marginTop: '0.25rem', fontFamily: 'monospace' }}>{c.hex}</div>
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* Stat Cards */}
      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--primary-olive)' }}>
          Stat Cards
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
          <StatCard label="Total Employees" value="1,248" subtext="↑ 12% from last month" icon="👥" />
          <StatCard label="Active Leaves" value="34" subtext="Pending approval: 8" icon="📅" />
          <StatCard label="Open Positions" value="12" subtext="4 departments hiring" icon="💼" />
          <StatCard label="Payroll Status" value="Processed" subtext="September 2026" icon="💳" />
        </div>
      </section>

      {/* Buttons & Badges */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <Card title="Buttons & Variants">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <Button variant="primary">Primary Olive</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="danger">Danger</Button>
            <Button variant="ghost">Ghost</Button>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
            <Button variant="primary" size="sm">Small</Button>
            <Button variant="primary" size="md">Medium</Button>
            <Button variant="primary" size="lg">Large</Button>
            <Button variant="primary" isLoading>Loading</Button>
            <Button variant="outline" disabled>Disabled</Button>
          </div>
        </Card>

        <Card title="Badges & Status Identifiers">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 500, width: '100px' }}>Statuses:</span>
              <Badge variant="active">Active</Badge>
              <Badge variant="pending">Pending</Badge>
              <Badge variant="approved">Approved</Badge>
              <Badge variant="rejected">Rejected</Badge>
              <Badge variant="inactive">Inactive</Badge>
              <Badge variant="terminated">Terminated</Badge>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 500, width: '100px' }}>Without Dot:</span>
              <Badge variant="active" showDot={false}>Active</Badge>
              <Badge variant="pending" showDot={false}>Pending</Badge>
              <Badge variant="neutral" showDot={false}>Neutral</Badge>
            </div>
          </div>
        </Card>
      </div>

      {/* Form Controls */}
      <section style={{ marginBottom: '2.5rem' }}>
        <Card title="Form Inputs & Select Controls" description="Clean, accessible, rounded form controls">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            <Input
              label="Employee Name"
              placeholder="e.g. John Doe"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              required
              helperText="Enter full official name"
            />
            <Input
              label="Work Email"
              type="email"
              placeholder="john@hrms.com"
              iconStart="✉"
            />
            <Select
              label="Department"
              value={selectValue}
              onChange={(e) => setSelectValue(e.target.value)}
              options={[
                { label: 'Engineering', value: 'eng' },
                { label: 'Human Resources', value: 'hr' },
                { label: 'Finance', value: 'fin' },
              ]}
              required
            />
            <Input
              label="Invalid Field Demo"
              placeholder="Invalid input"
              error="This field is required and must be valid."
            />
          </div>
        </Card>
      </section>

      {/* Data Table */}
      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--primary-olive)' }}>
          Enterprise Data Table
        </h2>
        <Table columns={sampleTableColumns} data={sampleTableData} />
      </section>

      {/* Feedback, Alerts & Loading */}
      <section style={{ marginBottom: '2.5rem' }}>
        <Card title="Feedback & Alert System">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            <Alert variant="info" title="Information Notice">
              System maintenance scheduled for Sunday at 02:00 UTC.
            </Alert>
            <Alert variant="success" title="Action Completed">
              New employee record has been successfully added.
            </Alert>
            <Alert variant="warning" title="Pending Approval">
              3 leave requests require manager sign-off.
            </Alert>
            <Alert variant="error" title="Validation Error">
              Failed to connect to authentication backend server.
            </Alert>
          </div>

          <div style={{ marginTop: '1.5rem', display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.875rem', fontWeight: 500, marginRight: '1rem' }}>Spinners:</span>
              <LoadingSpinner size="sm" /> <LoadingSpinner size="md" /> <LoadingSpinner size="lg" />
            </div>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 500, display: 'block', marginBottom: '0.5rem' }}>
                Skeleton Loaders:
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <Skeleton height="16px" width="60%" />
                <Skeleton height="12px" width="100%" />
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* Empty & Error States */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <EmptyState
          title="No Documents Uploaded"
          description="There are no employment contracts or tax forms uploaded for this profile."
          action={<Button variant="secondary" size="sm">Upload Document</Button>}
        />
        <ErrorState
          title="Failed to Load Payroll Data"
          description="A network timeout occurred while fetching the salary breakdown."
          onRetry={() => alert('Retrying...')}
        />
      </div>

      {/* Modals & Dialogs */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Sample Modal Dialog"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setIsModalOpen(false)}>
              Save Changes
            </Button>
          </>
        }
      >
        <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
          This is a reusable modal component with backdrop blur, keyboard shortcut (Esc) dismissal, and customizable header/body/footer slots.
        </p>
        <Input label="Modal Form Input" placeholder="Type something here..." />
      </Modal>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={() => {
          alert('Action Confirmed');
          setIsConfirmOpen(false);
        }}
        title="Confirm Record Deletion"
        message="Are you sure you want to delete this record? This action cannot be undone."
        variant="danger"
        confirmText="Delete Record"
      />

      {showToast && (
        <div className="hrms-toast-container">
          <Toast
            message="HRMS Design System loaded successfully"
            type="success"
            onClose={() => setShowToast(false)}
          />
        </div>
      )}
    </div>
  );
};

export default DesignSystemDemo;
