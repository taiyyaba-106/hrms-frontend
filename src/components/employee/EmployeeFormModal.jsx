import React, { useState, useEffect } from 'react';
import { Modal, Input, Select, Button, Alert } from '../ui';

const departmentOptions = [
  { label: 'Engineering', value: 'Engineering' },
  { label: 'Human Resources', value: 'Human Resources' },
  { label: 'Finance', value: 'Finance' },
  { label: 'Marketing', value: 'Marketing' },
  { label: 'Operations', value: 'Operations' },
  { label: 'Product', value: 'Product' },
];

const designationOptions = [
  { label: 'Software Engineer', value: 'Software Engineer' },
  { label: 'Lead Developer', value: 'Lead Developer' },
  { label: 'HR Manager', value: 'HR Manager' },
  { label: 'HR Specialist', value: 'HR Specialist' },
  { label: 'Financial Analyst', value: 'Financial Analyst' },
  { label: 'Operations Manager', value: 'Operations Manager' },
  { label: 'Product Manager', value: 'Product Manager' },
];

const locationOptions = [
  { label: 'Headquarters', value: 'Headquarters' },
  { label: 'New York Office', value: 'New York Office' },
  { label: 'London Branch', value: 'London Branch' },
  { label: 'Singapore Hub', value: 'Singapore Hub' },
  { label: 'Remote', value: 'Remote' },
];

const shiftOptions = [
  { label: 'Morning Shift (09:00 - 17:00)', value: 'Morning Shift' },
  { label: 'Evening Shift (14:00 - 22:00)', value: 'Evening Shift' },
  { label: 'Night Shift (22:00 - 06:00)', value: 'Night Shift' },
  { label: 'Flexible Shift', value: 'Flexible Shift' },
];

const statusOptions = [
  { label: 'ACTIVE', value: 'ACTIVE' },
  { label: 'INACTIVE', value: 'INACTIVE' },
  { label: 'PENDING', value: 'PENDING' },
  { label: 'TERMINATED', value: 'TERMINATED' },
];

const defaultFormState = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  department: 'Engineering',
  designation: 'Software Engineer',
  officeLocation: 'Headquarters',
  shift: 'Morning Shift',
  joiningDate: new Date().toISOString().split('T')[0],
  status: 'ACTIVE',
};

const EmployeeFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  isSubmitting = false,
  error = '',
}) => {
  const [formData, setFormData] = useState(defaultFormState);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        firstName: initialData.firstName || '',
        lastName: initialData.lastName || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        department: initialData.department || 'Engineering',
        designation: initialData.designation || 'Software Engineer',
        officeLocation: initialData.officeLocation || initialData.location || 'Headquarters',
        shift: initialData.shift || 'Morning Shift',
        joiningDate: initialData.joiningDate
          ? new Date(initialData.joiningDate).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
        status: initialData.status || 'ACTIVE',
      });
    } else {
      setFormData(defaultFormState);
    }
    setErrors({});
  }, [initialData, isOpen]);

  const validate = () => {
    const errs = {};
    if (!formData.firstName.trim()) errs.firstName = 'First name is required';
    if (!formData.lastName.trim()) errs.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Valid email address is required';
    }
    if (!formData.phone.trim()) errs.phone = 'Phone number is required';
    if (!formData.joiningDate) errs.joiningDate = 'Joining date is required';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(formData);
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const isEdit = !!initialData;

  const footer = (
    <>
      <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
        Cancel
      </Button>
      <Button variant="primary" onClick={handleSubmit} isLoading={isSubmitting}>
        {isEdit ? 'Save Changes' : 'Create Employee'}
      </Button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Employee Details' : 'Add New Employee'}
      footer={footer}
      maxWidth="620px"
    >
      {error && (
        <Alert variant="error" style={{ marginBottom: '1.25rem' }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <Input
            label="First Name"
            placeholder="John"
            value={formData.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
            error={errors.firstName}
            required
            disabled={isSubmitting}
          />
          <Input
            label="Last Name"
            placeholder="Doe"
            value={formData.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
            error={errors.lastName}
            required
            disabled={isSubmitting}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <Input
            label="Email Address"
            type="email"
            placeholder="john.doe@hrms.com"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            error={errors.email}
            required
            disabled={isSubmitting}
          />
          <Input
            label="Phone Number"
            placeholder="+1 (555) 019-2834"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            error={errors.phone}
            required
            disabled={isSubmitting}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <Select
            label="Department"
            value={formData.department}
            onChange={(e) => handleChange('department', e.target.value)}
            options={departmentOptions}
            required
            disabled={isSubmitting}
          />
          <Select
            label="Designation / Role"
            value={formData.designation}
            onChange={(e) => handleChange('designation', e.target.value)}
            options={designationOptions}
            required
            disabled={isSubmitting}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <Select
            label="Office Location"
            value={formData.officeLocation}
            onChange={(e) => handleChange('officeLocation', e.target.value)}
            options={locationOptions}
            required
            disabled={isSubmitting}
          />
          <Select
            label="Work Shift"
            value={formData.shift}
            onChange={(e) => handleChange('shift', e.target.value)}
            options={shiftOptions}
            required
            disabled={isSubmitting}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '0.5rem' }}>
          <Input
            label="Date of Joining"
            type="date"
            value={formData.joiningDate}
            onChange={(e) => handleChange('joiningDate', e.target.value)}
            error={errors.joiningDate}
            required
            disabled={isSubmitting}
          />
          <Select
            label="Account Status"
            value={formData.status}
            onChange={(e) => handleChange('status', e.target.value)}
            options={statusOptions}
            required
            disabled={isSubmitting}
          />
        </div>
      </form>
    </Modal>
  );
};

export default EmployeeFormModal;
