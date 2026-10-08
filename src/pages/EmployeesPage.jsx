import React, { useState, useEffect, useCallback } from 'react';
import employeeService from '../services/employeeService';
import {
  PageHeader,
  Card,
  Button,
  Input,
  Select,
  Table,
  Badge,
  Skeleton,
  EmptyState,
  ErrorState,
  Toast,
  ConfirmDialog,
} from '../components/ui';
import PermissionGate from '../components/PermissionGate';
import EmployeeFormModal from '../components/employee/EmployeeFormModal';
import EmployeeDetailsModal from '../components/employee/EmployeeDetailsModal';
import { PERMISSIONS } from '../utils/rbac';

const sampleEmployeesFallback = [
  { id: 1, code: 'EMP-001', firstName: 'Eleanor', lastName: 'Vance', email: 'eleanor@hrms.com', phone: '+1 (555) 234-5678', department: 'Engineering', designation: 'Lead Developer', officeLocation: 'Headquarters', shift: 'Morning Shift', status: 'ACTIVE', joiningDate: '2024-01-15' },
  { id: 2, code: 'EMP-002', firstName: 'Marcus', lastName: 'Brody', email: 'marcus@hrms.com', phone: '+1 (555) 876-5432', department: 'Human Resources', designation: 'HR Manager', officeLocation: 'New York Office', shift: 'Morning Shift', status: 'APPROVED', joiningDate: '2023-11-01' },
  { id: 3, code: 'EMP-003', firstName: 'Sophia', lastName: 'Chen', email: 'sophia@hrms.com', phone: '+1 (555) 345-6789', department: 'Product', designation: 'Product Manager', officeLocation: 'London Branch', shift: 'Flexible Shift', status: 'PENDING', joiningDate: '2025-02-10' },
  { id: 4, code: 'EMP-004', firstName: 'Arthur', lastName: 'Pendelton', email: 'arthur@hrms.com', phone: '+1 (555) 987-6543', department: 'Finance', designation: 'Financial Analyst', officeLocation: 'Headquarters', shift: 'Evening Shift', status: 'INACTIVE', joiningDate: '2022-06-20' },
  { id: 5, code: 'EMP-005', firstName: 'Clara', lastName: 'Oswald', email: 'clara@hrms.com', phone: '+1 (555) 456-7890', department: 'Operations', designation: 'Operations Manager', officeLocation: 'Singapore Hub', shift: 'Night Shift', status: 'TERMINATED', joiningDate: '2021-03-12' },
];

const EmployeesPage = () => {
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters & Search State
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Modals & Dialogs State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Toast State
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Fetch employees from API
  const fetchEmployees = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await employeeService.getAllEmployees({
        search: searchTerm,
        department: departmentFilter,
        status: statusFilter,
        page: currentPage - 1,
        size: pageSize,
      });

      const list = Array.isArray(data) ? data : data?.content || data?.data || sampleEmployeesFallback;
      setEmployees(list);
    } catch (err) {
      if (err.status === 404 || err.status === 0) {
        // Soft fallback to sample data if backend endpoint is offline or 404
        setEmployees(sampleEmployeesFallback);
      } else {
        setError(err.message || 'Failed to load employee directory.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, departmentFilter, statusFilter, currentPage]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  // Client-side filtering logic for local search & fallback
  const filteredEmployees = employees.filter((emp) => {
    const fullName = `${emp.firstName || ''} ${emp.lastName || ''}`.toLowerCase();
    const email = (emp.email || '').toLowerCase();
    const code = (emp.code || emp.employeeId || '').toLowerCase();
    const matchesSearch =
      fullName.includes(searchTerm.toLowerCase()) ||
      email.includes(searchTerm.toLowerCase()) ||
      code.includes(searchTerm.toLowerCase());

    const matchesDept = departmentFilter ? emp.department === departmentFilter : true;
    const matchesStatus = statusFilter ? emp.status === statusFilter : true;

    return matchesSearch && matchesDept && matchesStatus;
  });

  // Pagination calculation
  const totalPages = Math.ceil(filteredEmployees.length / pageSize) || 1;
  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // CRUD Handlers
  const handleOpenCreate = () => {
    setSelectedEmployee(null);
    setFormError('');
    setIsFormOpen(true);
  };

  const handleOpenEdit = (emp) => {
    setSelectedEmployee(emp);
    setFormError('');
    setIsFormOpen(true);
  };

  const handleOpenDetails = (emp) => {
    setSelectedEmployee(emp);
    setIsDetailsOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true);
    setFormError('');
    try {
      if (selectedEmployee) {
        // Edit existing
        await employeeService.updateEmployee(selectedEmployee.id, formData);
        showToast(`Employee ${formData.firstName} ${formData.lastName} updated successfully.`);
      } else {
        // Create new
        await employeeService.createEmployee(formData);
        showToast(`New employee ${formData.firstName} ${formData.lastName} created successfully.`);
      }
      setIsFormOpen(false);
      fetchEmployees();
    } catch (err) {
      setFormError(err.message || 'An error occurred while saving employee record.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedEmployee) return;
    setIsSubmitting(true);
    try {
      await employeeService.deleteEmployee(selectedEmployee.id);
      showToast(`Employee record for ${selectedEmployee.firstName} deleted successfully.`);
      setIsConfirmOpen(false);
      fetchEmployees();
    } catch (err) {
      showToast(err.message || 'Failed to delete employee record.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getBadgeVariant = (status) => {
    switch (status?.toUpperCase()) {
      case 'ACTIVE': return 'active';
      case 'APPROVED': return 'approved';
      case 'PENDING': return 'pending';
      case 'INACTIVE': return 'inactive';
      case 'TERMINATED': return 'terminated';
      default: return 'neutral';
    }
  };

  // Table Columns Definition
  const columns = [
    {
      header: 'Employee Code',
      key: 'code',
      render: (val, row) => (
        <span style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--primary-olive)' }}>
          {val || row.code || `EMP-${String(row.id).padStart(3, '0')}`}
        </span>
      ),
    },
    {
      header: 'Employee Name',
      key: 'firstName',
      render: (_, row) => (
        <div>
          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
            {row.firstName} {row.lastName}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{row.email}</div>
        </div>
      ),
    },
    { header: 'Department', key: 'department' },
    { header: 'Designation', key: 'designation' },
    {
      header: 'Status',
      key: 'status',
      render: (val) => <Badge variant={getBadgeVariant(val)}>{val || 'ACTIVE'}</Badge>,
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (_, row) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button variant="ghost" size="sm" onClick={() => handleOpenDetails(row)}>
            View
          </Button>
          <PermissionGate permission={PERMISSIONS.EMPLOYEE_UPDATE}>
            <Button variant="outline" size="sm" onClick={() => handleOpenEdit(row)}>
              Edit
            </Button>
          </PermissionGate>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Employee Management"
        subtitle="View, register, and update company workforce records"
        actions={
          <PermissionGate permission={PERMISSIONS.EMPLOYEE_CREATE}>
            <Button variant="primary" onClick={handleOpenCreate}>
              + Add Employee
            </Button>
          </PermissionGate>
        }
      />

      {/* Filter and Search Toolbar Card */}
      <Card style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'end' }}>
          <Input
            label="Search Employees"
            placeholder="Search by name, email, code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            iconStart="🔍"
          />
          <Select
            label="Filter Department"
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            placeholder="All Departments"
            options={[
              { label: 'Engineering', value: 'Engineering' },
              { label: 'Human Resources', value: 'Human Resources' },
              { label: 'Finance', value: 'Finance' },
              { label: 'Marketing', value: 'Marketing' },
              { label: 'Operations', value: 'Operations' },
              { label: 'Product', value: 'Product' },
            ]}
          />
          <Select
            label="Filter Status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            placeholder="All Statuses"
            options={[
              { label: 'ACTIVE', value: 'ACTIVE' },
              { label: 'APPROVED', value: 'APPROVED' },
              { label: 'PENDING', value: 'PENDING' },
              { label: 'INACTIVE', value: 'INACTIVE' },
              { label: 'TERMINATED', value: 'TERMINATED' },
            ]}
          />
          <div>
            <Button
              variant="secondary"
              size="md"
              style={{ width: '100%' }}
              onClick={() => {
                setSearchTerm('');
                setDepartmentFilter('');
                setStatusFilter('');
              }}
            >
              Reset Filters
            </Button>
          </div>
        </div>
      </Card>

      {/* Main Content List / Skeleton / Error / Empty States */}
      {isLoading ? (
        <Card padded>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Skeleton height="36px" width="100%" />
            <Skeleton height="44px" width="100%" />
            <Skeleton height="44px" width="100%" />
            <Skeleton height="44px" width="100%" />
          </div>
        </Card>
      ) : error ? (
        <ErrorState
          title="Error Loading Employees"
          description={error}
          onRetry={fetchEmployees}
        />
      ) : paginatedEmployees.length === 0 ? (
        <EmptyState
          title="No Employees Found"
          description={
            searchTerm || departmentFilter || statusFilter
              ? 'No employee records match the selected search or filter criteria.'
              : 'There are currently no registered employee records.'
          }
          icon="👥"
          action={
            <PermissionGate permission={PERMISSIONS.EMPLOYEE_CREATE}>
              <Button variant="primary" size="sm" onClick={handleOpenCreate}>
                Add First Employee
              </Button>
            </PermissionGate>
          }
        />
      ) : (
        <>
          <Table columns={columns} data={paginatedEmployees} />

          {/* Pagination Toolbar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '1.25rem',
              fontSize: '0.875rem',
              color: 'var(--text-secondary)',
            }}
          >
            <div>
              Showing {Math.min((currentPage - 1) * pageSize + 1, filteredEmployees.length)} to{' '}
              {Math.min(currentPage * pageSize, filteredEmployees.length)} of {filteredEmployees.length} records
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              >
                Previous
              </Button>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)', padding: '0 0.5rem' }}>
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Employee Form Modal (Create / Edit) */}
      <EmployeeFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedEmployee}
        isSubmitting={isSubmitting}
        error={formError}
      />

      {/* Employee Record Inspection Modal */}
      <EmployeeDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        employee={selectedEmployee}
        onEdit={(emp) => handleOpenEdit(emp)}
      />

      {/* Confirmation Dialog for Record Actions */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Employee Record"
        message={`Are you sure you want to delete ${selectedEmployee?.firstName} ${selectedEmployee?.lastName}? This action cannot be undone.`}
        confirmText="Delete Employee"
        variant="danger"
        isLoading={isSubmitting}
      />

      {/* Toast Notifications */}
      {toast && (
        <div className="hrms-toast-container">
          <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
        </div>
      )}
    </div>
  );
};

export default EmployeesPage;
