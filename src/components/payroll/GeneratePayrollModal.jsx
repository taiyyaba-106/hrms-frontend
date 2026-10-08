import React, { useState } from 'react';
import { Modal, Select, Button, Alert } from '../ui';

const monthOptions = [
  { label: 'January', value: '1' },
  { label: 'February', value: '2' },
  { label: 'March', value: '3' },
  { label: 'April', value: '4' },
  { label: 'May', value: '5' },
  { label: 'June', value: '6' },
  { label: 'July', value: '7' },
  { label: 'August', value: '8' },
  { label: 'September', value: '9' },
  { label: 'October', value: '10' },
  { label: 'November', value: '11' },
  { label: 'December', value: '12' },
];

const yearOptions = [
  { label: '2026', value: '2026' },
  { label: '2025', value: '2025' },
  { label: '2024', value: '2024' },
];

const departmentOptions = [
  { label: 'All Departments', value: 'ALL' },
  { label: 'Engineering', value: 'Engineering' },
  { label: 'Human Resources', value: 'Human Resources' },
  { label: 'Finance', value: 'Finance' },
  { label: 'Marketing', value: 'Marketing' },
  { label: 'Operations', value: 'Operations' },
];

const GeneratePayrollModal = ({ isOpen, onClose, onSubmit, isSubmitting = false, apiError = '' }) => {
  const currentMonth = (new Date().getMonth() + 1).toString();
  const [formData, setFormData] = useState({
    month: currentMonth,
    year: '2026',
    department: 'ALL',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const footer = (
    <>
      <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
        Cancel
      </Button>
      <Button variant="primary" onClick={handleSubmit} isLoading={isSubmitting}>
        Run Payroll Generation
      </Button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Generate Monthly Payroll"
      footer={footer}
      maxWidth="480px"
    >
      {apiError && (
        <Alert variant="error" style={{ marginBottom: '1.25rem' }}>
          {apiError}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
          <Select
            label="Payroll Month"
            value={formData.month}
            onChange={(e) => setFormData({ ...formData, month: e.target.value })}
            options={monthOptions}
            required
            disabled={isSubmitting}
          />
          <Select
            label="Payroll Year"
            value={formData.year}
            onChange={(e) => setFormData({ ...formData, year: e.target.value })}
            options={yearOptions}
            required
            disabled={isSubmitting}
          />
        </div>

        <div style={{ marginBottom: '1.25rem' }}>
          <Select
            label="Target Department"
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            options={departmentOptions}
            required
            disabled={isSubmitting}
          />
        </div>

        <Alert variant="info">
          Generating payroll will calculate base salary, bonuses, tax withholdings, and net pay for all active staff in the selected period.
        </Alert>
      </form>
    </Modal>
  );
};

export default GeneratePayrollModal;
