import React, { useState, useEffect, useCallback } from 'react';
import organizationService from '../services/organizationService';
import {
  PageHeader,
  Card,
  Button,
  Input,
  Select,
  Table,
  Badge,
  Modal,
  Skeleton,
  EmptyState,
  ErrorState,
  Toast,
  Alert,
} from '../components/ui';
import PermissionGate from '../components/PermissionGate';
import { PERMISSIONS } from '../utils/rbac';

// Initial Mock Fallback Datasets (used when offline/standalone)
const initialDepartments = [
  { id: 1, name: 'Engineering', code: 'DEP-ENG', head: 'Eleanor Vance', employeeCount: 42, status: 'ACTIVE' },
  { id: 2, name: 'Human Resources', code: 'DEP-HR', head: 'Marcus Brody', employeeCount: 12, status: 'ACTIVE' },
  { id: 3, name: 'Finance', code: 'DEP-FIN', head: 'Arthur Pendelton', employeeCount: 8, status: 'ACTIVE' },
  { id: 4, name: 'Product Management', code: 'DEP-PRD', head: 'Sophia Chen', employeeCount: 15, status: 'ACTIVE' },
  { id: 5, name: 'Marketing', code: 'DEP-MKT', head: 'Clara Oswald', employeeCount: 10, status: 'INACTIVE' },
];

const initialDesignations = [
  { id: 1, title: 'Software Engineer', code: 'DSG-SE', level: 'L3', department: 'Engineering', status: 'ACTIVE' },
  { id: 2, title: 'Lead Developer', code: 'DSG-LD', level: 'L5', department: 'Engineering', status: 'ACTIVE' },
  { id: 3, title: 'HR Manager', code: 'DSG-HRM', level: 'L5', department: 'Human Resources', status: 'ACTIVE' },
  { id: 4, title: 'Financial Analyst', code: 'DSG-FA', level: 'L3', department: 'Finance', status: 'ACTIVE' },
  { id: 5, title: 'Operations Specialist', code: 'DSG-OPS', level: 'L2', department: 'Operations', status: 'INACTIVE' },
];

const initialLocations = [
  { id: 1, name: 'Headquarters', city: 'San Francisco', country: 'United States', address: '500 Howard St, Suite 400', status: 'ACTIVE' },
  { id: 2, name: 'New York Office', city: 'New York', country: 'United States', address: '120 Broadway Ave', status: 'ACTIVE' },
  { id: 3, name: 'London Branch', city: 'London', country: 'United Kingdom', address: '25 Bank Street, Canary Wharf', status: 'ACTIVE' },
  { id: 4, name: 'Singapore Hub', city: 'Singapore', country: 'Singapore', address: '8 Marina Boulevard', status: 'ACTIVE' },
];

const initialShifts = [
  { id: 1, name: 'Morning Shift', startTime: '09:00', endTime: '17:00', breakDuration: '60 mins', status: 'ACTIVE' },
  { id: 2, name: 'Evening Shift', startTime: '14:00', endTime: '22:00', breakDuration: '45 mins', status: 'ACTIVE' },
  { id: 3, name: 'Night Shift', startTime: '22:00', endTime: '06:00', breakDuration: '60 mins', status: 'ACTIVE' },
  { id: 4, name: 'Flexible Shift', startTime: '10:00', endTime: '18:00', breakDuration: '60 mins', status: 'ACTIVE' },
];

const OrganizationPage = () => {
  const [activeTab, setActiveTab] = useState('departments'); // 'departments' | 'designations' | 'locations' | 'shifts'
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Data lists
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [locations, setLocations] = useState([]);
  const [shifts, setShifts] = useState([]);

  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalApiError, setModalApiError] = useState('');

  // Toast Notifications
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Fetch data for active tab
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      if (activeTab === 'departments') {
        const res = await organizationService.getDepartments();
        setDepartments(Array.isArray(res) ? res : res?.data || initialDepartments);
      } else if (activeTab === 'designations') {
        const res = await organizationService.getDesignations();
        setDesignations(Array.isArray(res) ? res : res?.data || initialDesignations);
      } else if (activeTab === 'locations') {
        const res = await organizationService.getLocations();
        setLocations(Array.isArray(res) ? res : res?.data || initialLocations);
      } else if (activeTab === 'shifts') {
        const res = await organizationService.getShifts();
        setShifts(Array.isArray(res) ? res : res?.data || initialShifts);
      }
    } catch (err) {
      if (err.status === 404 || err.status === 0) {
        // Fallback datasets
        if (activeTab === 'departments') setDepartments(initialDepartments);
        if (activeTab === 'designations') setDesignations(initialDesignations);
        if (activeTab === 'locations') setLocations(initialLocations);
        if (activeTab === 'shifts') setShifts(initialShifts);
      } else {
        setError(err.message || 'Failed to fetch organization data.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    setSearchQuery('');
    fetchData();
  }, [fetchData, activeTab]);

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditItem(null);
    setModalApiError('');
    setFormErrors({});

    if (activeTab === 'departments') {
      setFormData({ name: '', code: '', head: '', status: 'ACTIVE' });
    } else if (activeTab === 'designations') {
      setFormData({ title: '', code: '', level: 'L3', department: 'Engineering', status: 'ACTIVE' });
    } else if (activeTab === 'locations') {
      setFormData({ name: '', city: '', country: '', address: '', status: 'ACTIVE' });
    } else if (activeTab === 'shifts') {
      setFormData({ name: '', startTime: '09:00', endTime: '17:00', breakDuration: '60 mins', status: 'ACTIVE' });
    }

    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (item) => {
    setEditItem(item);
    setModalApiError('');
    setFormErrors({});
    setFormData({ ...item });
    setIsModalOpen(true);
  };

  // Validate form fields
  const validateForm = () => {
    const errs = {};
    if (activeTab === 'departments') {
      if (!formData.name?.trim()) errs.name = 'Department name is required';
      if (!formData.code?.trim()) errs.code = 'Department code is required';
    } else if (activeTab === 'designations') {
      if (!formData.title?.trim()) errs.title = 'Designation title is required';
      if (!formData.code?.trim()) errs.code = 'Designation code is required';
    } else if (activeTab === 'locations') {
      if (!formData.name?.trim()) errs.name = 'Location name is required';
      if (!formData.city?.trim()) errs.city = 'City is required';
    } else if (activeTab === 'shifts') {
      if (!formData.name?.trim()) errs.name = 'Shift name is required';
      if (!formData.startTime) errs.startTime = 'Start time is required';
      if (!formData.endTime) errs.endTime = 'End time is required';
    }

    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Form Submit Handler
  const handleModalSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setModalApiError('');

    try {
      if (activeTab === 'departments') {
        if (editItem) {
          await organizationService.updateDepartment(editItem.id, formData);
          showToast('Department updated successfully');
        } else {
          await organizationService.createDepartment(formData);
          showToast('Department created successfully');
        }
      } else if (activeTab === 'designations') {
        if (editItem) {
          await organizationService.updateDesignation(editItem.id, formData);
          showToast('Designation updated successfully');
        } else {
          await organizationService.createDesignation(formData);
          showToast('Designation created successfully');
        }
      } else if (activeTab === 'locations') {
        if (editItem) {
          await organizationService.updateLocation(editItem.id, formData);
          showToast('Office Location updated successfully');
        } else {
          await organizationService.createLocation(formData);
          showToast('Office Location created successfully');
        }
      } else if (activeTab === 'shifts') {
        if (editItem) {
          await organizationService.updateShift(editItem.id, formData);
          showToast('Work Shift updated successfully');
        } else {
          await organizationService.createShift(formData);
          showToast('Work Shift created successfully');
        }
      }

      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      if (err.status === 409) {
        setModalApiError('Conflict: Entry with this code/name already exists.');
      } else {
        setModalApiError(err.message || 'An error occurred while saving.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render Table Columns dynamically based on Active Tab
  const getColumns = () => {
    if (activeTab === 'departments') {
      return [
        { header: 'Code', key: 'code', render: (val) => <strong style={{ fontFamily: 'monospace' }}>{val}</strong> },
        { header: 'Department Name', key: 'name' },
        { header: 'Head of Dept', key: 'head', render: (val) => val || 'Unassigned' },
        { header: 'Employees', key: 'employeeCount', render: (val) => val || 0 },
        { header: 'Status', key: 'status', render: (val) => <Badge variant={val === 'ACTIVE' ? 'active' : 'inactive'}>{val}</Badge> },
        {
          header: 'Actions',
          key: 'actions',
          render: (_, row) => (
            <PermissionGate permission={PERMISSIONS.ROLE_MANAGE}>
              <Button variant="outline" size="sm" onClick={() => handleOpenEdit(row)}>
                Edit
              </Button>
            </PermissionGate>
          ),
        },
      ];
    }

    if (activeTab === 'designations') {
      return [
        { header: 'Code', key: 'code', render: (val) => <strong style={{ fontFamily: 'monospace' }}>{val}</strong> },
        { header: 'Designation Title', key: 'title' },
        { header: 'Job Level', key: 'level' },
        { header: 'Department', key: 'department' },
        { header: 'Status', key: 'status', render: (val) => <Badge variant={val === 'ACTIVE' ? 'active' : 'inactive'}>{val}</Badge> },
        {
          header: 'Actions',
          key: 'actions',
          render: (_, row) => (
            <PermissionGate permission={PERMISSIONS.ROLE_MANAGE}>
              <Button variant="outline" size="sm" onClick={() => handleOpenEdit(row)}>
                Edit
              </Button>
            </PermissionGate>
          ),
        },
      ];
    }

    if (activeTab === 'locations') {
      return [
        { header: 'Location Name', key: 'name', render: (val) => <strong>{val}</strong> },
        { header: 'City', key: 'city' },
        { header: 'Country', key: 'country' },
        { header: 'Address', key: 'address' },
        { header: 'Status', key: 'status', render: (val) => <Badge variant={val === 'ACTIVE' ? 'active' : 'inactive'}>{val}</Badge> },
        {
          header: 'Actions',
          key: 'actions',
          render: (_, row) => (
            <PermissionGate permission={PERMISSIONS.ROLE_MANAGE}>
              <Button variant="outline" size="sm" onClick={() => handleOpenEdit(row)}>
                Edit
              </Button>
            </PermissionGate>
          ),
        },
      ];
    }

    return [
      { header: 'Shift Name', key: 'name', render: (val) => <strong>{val}</strong> },
      { header: 'Start Time', key: 'startTime' },
      { header: 'End Time', key: 'endTime' },
      { header: 'Break Duration', key: 'breakDuration' },
      { header: 'Status', key: 'status', render: (val) => <Badge variant={val === 'ACTIVE' ? 'active' : 'inactive'}>{val}</Badge> },
      {
        header: 'Actions',
        key: 'actions',
        render: (_, row) => (
          <PermissionGate permission={PERMISSIONS.ROLE_MANAGE}>
            <Button variant="outline" size="sm" onClick={() => handleOpenEdit(row)}>
              Edit
            </Button>
          </PermissionGate>
        ),
      },
    ];
  };

  // Filter Active Data List by Search Term
  const getFilteredData = () => {
    let list = [];
    if (activeTab === 'departments') list = departments;
    else if (activeTab === 'designations') list = designations;
    else if (activeTab === 'locations') list = locations;
    else list = shifts;

    if (!searchQuery.trim()) return list;

    const q = searchQuery.toLowerCase();
    return list.filter(
      (item) =>
        (item.name && item.name.toLowerCase().includes(q)) ||
        (item.title && item.title.toLowerCase().includes(q)) ||
        (item.code && item.code.toLowerCase().includes(q)) ||
        (item.city && item.city.toLowerCase().includes(q))
    );
  };

  const filteredData = getFilteredData();

  return (
    <div>
      <PageHeader
        title="Organization Management"
        subtitle="Manage company departments, designations, office locations, and work shifts"
        actions={
          <PermissionGate permission={PERMISSIONS.ROLE_MANAGE}>
            <Button variant="primary" onClick={handleOpenCreate}>
              + Add {activeTab.slice(0, -1)}
            </Button>
          </PermissionGate>
        }
      />

      {/* Pastel Yellow Highlight Header Navigation Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          marginBottom: '1.5rem',
          borderBottom: '1px solid var(--border)',
          paddingBottom: '0.5rem',
        }}
      >
        {[
          { id: 'departments', label: 'Departments', icon: '🏢' },
          { id: 'designations', label: 'Designations', icon: '🎖️' },
          { id: 'locations', label: 'Office Locations', icon: '📍' },
          { id: 'shifts', label: 'Work Shifts', icon: '⏱️' },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.625rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid',
                borderColor: isActive ? 'var(--border)' : 'transparent',
                backgroundColor: isActive ? 'var(--pastel-yellow)' : 'transparent',
                color: isActive ? 'var(--primary-olive)' : 'var(--text-secondary)',
                fontWeight: isActive ? 600 : 500,
                cursor: 'pointer',
                fontSize: '0.875rem',
                transition: 'all 0.15s ease',
              }}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Search Bar Toolbar */}
      <Card style={{ marginBottom: '1.5rem' }}>
        <div style={{ maxWidth: '360px' }}>
          <Input
            placeholder={`Search ${activeTab}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            iconStart="🔍"
          />
        </div>
      </Card>

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
        <ErrorState title="Failed to Load Data" description={error} onRetry={fetchData} />
      ) : filteredData.length === 0 ? (
        <EmptyState
          title={`No ${activeTab} found`}
          description={searchQuery ? 'No records match your search criteria.' : `No ${activeTab} have been created yet.`}
          icon="📂"
          action={
            <PermissionGate permission={PERMISSIONS.ROLE_MANAGE}>
              <Button variant="primary" size="sm" onClick={handleOpenCreate}>
                Create First Entry
              </Button>
            </PermissionGate>
          }
        />
      ) : (
        <Table columns={getColumns()} data={filteredData} />
      )}

      {/* Reusable Form Modal for Create & Edit */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editItem ? `Edit ${activeTab.slice(0, -1)}` : `Create New ${activeTab.slice(0, -1)}`}
        footer={
          <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleModalSubmit} isLoading={isSubmitting}>
              {editItem ? 'Save Changes' : 'Create Entry'}
            </Button>
          </>
        }
        maxWidth="520px"
      >
        {modalApiError && (
          <Alert variant="error" style={{ marginBottom: '1rem' }}>
            {modalApiError}
          </Alert>
        )}

        <form onSubmit={handleModalSubmit}>
          {/* Department Fields */}
          {activeTab === 'departments' && (
            <>
              <Input
                label="Department Name"
                placeholder="e.g. Engineering"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                error={formErrors.name}
                required
                style={{ marginBottom: '1rem' }}
              />
              <Input
                label="Department Code"
                placeholder="e.g. DEP-ENG"
                value={formData.code || ''}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                error={formErrors.code}
                required
                style={{ marginBottom: '1rem' }}
              />
              <Input
                label="Department Head"
                placeholder="e.g. John Doe"
                value={formData.head || ''}
                onChange={(e) => setFormData({ ...formData, head: e.target.value })}
                style={{ marginBottom: '1rem' }}
              />
            </>
          )}

          {/* Designation Fields */}
          {activeTab === 'designations' && (
            <>
              <Input
                label="Designation Title"
                placeholder="e.g. Senior Software Engineer"
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                error={formErrors.title}
                required
                style={{ marginBottom: '1rem' }}
              />
              <Input
                label="Designation Code"
                placeholder="e.g. DSG-SE"
                value={formData.code || ''}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                error={formErrors.code}
                required
                style={{ marginBottom: '1rem' }}
              />
              <Select
                label="Job Level"
                value={formData.level || 'L3'}
                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                options={[
                  { label: 'L1 - Executive', value: 'L1' },
                  { label: 'L2 - Junior', value: 'L2' },
                  { label: 'L3 - Mid Level', value: 'L3' },
                  { label: 'L4 - Senior', value: 'L4' },
                  { label: 'L5 - Lead / Manager', value: 'L5' },
                  { label: 'L6 - Executive Director', value: 'L6' },
                ]}
                style={{ marginBottom: '1rem' }}
              />
            </>
          )}

          {/* Location Fields */}
          {activeTab === 'locations' && (
            <>
              <Input
                label="Location Name"
                placeholder="e.g. Headquarters"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                error={formErrors.name}
                required
                style={{ marginBottom: '1rem' }}
              />
              <Input
                label="City"
                placeholder="e.g. San Francisco"
                value={formData.city || ''}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                error={formErrors.city}
                required
                style={{ marginBottom: '1rem' }}
              />
              <Input
                label="Country"
                placeholder="e.g. United States"
                value={formData.country || ''}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                style={{ marginBottom: '1rem' }}
              />
              <Input
                label="Street Address"
                placeholder="e.g. 500 Howard St"
                value={formData.address || ''}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                style={{ marginBottom: '1rem' }}
              />
            </>
          )}

          {/* Shift Fields */}
          {activeTab === 'shifts' && (
            <>
              <Input
                label="Shift Name"
                placeholder="e.g. Morning Shift"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                error={formErrors.name}
                required
                style={{ marginBottom: '1rem' }}
              />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <Input
                  label="Start Time"
                  type="time"
                  value={formData.startTime || '09:00'}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  required
                />
                <Input
                  label="End Time"
                  type="time"
                  value={formData.endTime || '17:00'}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  required
                />
              </div>
              <Input
                label="Break Duration"
                placeholder="e.g. 60 mins"
                value={formData.breakDuration || '60 mins'}
                onChange={(e) => setFormData({ ...formData, breakDuration: e.target.value })}
                style={{ marginBottom: '1rem' }}
              />
            </>
          )}

          <Select
            label="Status"
            value={formData.status || 'ACTIVE'}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            options={[
              { label: 'ACTIVE', value: 'ACTIVE' },
              { label: 'INACTIVE', value: 'INACTIVE' },
            ]}
          />
        </form>
      </Modal>

      {/* Toast Notification Container */}
      {toast && (
        <div className="hrms-toast-container">
          <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
        </div>
      )}
    </div>
  );
};

export default OrganizationPage;
