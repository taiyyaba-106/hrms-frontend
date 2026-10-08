import React, { useState, useEffect } from 'react';
import { Modal, Input, Select, Button, Alert } from '../ui';

const projectOptions = [
  { label: 'Core HRMS Frontend Refactoring', value: 'Core HRMS Frontend' },
  { label: 'Backend API Security & Audit', value: 'Backend API Security' },
  { label: 'Payroll Engine Integration', value: 'Payroll Engine' },
  { label: 'Internal Operations Support', value: 'Internal Operations' },
];

const TimesheetFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  isSubmitting = false,
  apiError = '',
}) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    project: 'Core HRMS Frontend',
    taskDescription: '',
    regularHours: 8,
    overtimeHours: 0,
    status: 'SUBMITTED',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        date: initialData.date || new Date().toISOString().split('T')[0],
        project: initialData.project || 'Core HRMS Frontend',
        taskDescription: initialData.taskDescription || initialData.description || '',
        regularHours: initialData.regularHours ?? 8,
        overtimeHours: initialData.overtimeHours ?? 0,
        status: initialData.status || 'SUBMITTED',
      });
    } else {
      setFormData({
        date: new Date().toISOString().split('T')[0],
        project: 'Core HRMS Frontend',
        taskDescription: '',
        regularHours: 8,
        overtimeHours: 0,
        status: 'SUBMITTED',
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const validate = () => {
    const errs = {};
    if (!formData.date) {
      errs.date = 'Date is required.';
    }

    if (!formData.project) {
      errs.project = 'Project selection is required.';
    }

    const regHrs = Number(formData.regularHours);
    if (isNaN(regHrs) || regHrs < 0 || regHrs > 24) {
      errs.regularHours = 'Regular hours must be a number between 0 and 24.';
    }

    const otHrs = Number(formData.overtimeHours);
    if (isNaN(otHrs) || otHrs < 0 || otHrs > 12) {
      errs.overtimeHours = 'Overtime hours must be a number between 0 and 12.';
    }

    if (regHrs + otHrs > 24) {
      errs.regularHours = 'Combined daily work hours cannot exceed 24 hours.';
    }

    if (!formData.taskDescription?.trim()) {
      errs.taskDescription = 'Task description is required.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(formData);
  };

  const footer = (
    <>
      <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
        Cancel
      </Button>
      <Button variant="primary" onClick={handleSubmit} isLoading={isSubmitting}>
        {initialData ? 'Save Changes' : 'Submit Timesheet'}
      </Button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Timesheet Entry' : 'Log Daily Work Hours'}
      footer={footer}
      maxWidth="540px"
    >
      {apiError && (
        <Alert variant="error" style={{ marginBottom: '1.25rem' }}>
          {apiError}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <Input
            label="Log Date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            error={errors.date}
            required
            disabled={isSubmitting}
          />
          <Select
            label="Project Name"
            value={formData.project}
            onChange={(e) => setFormData({ ...formData, project: e.target.value })}
            options={projectOptions}
            error={errors.project}
            required
            disabled={isSubmitting}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <Input
            label="Regular Work Hours (0-24)"
            type="number"
            step="0.5"
            min="0"
            max="24"
            value={formData.regularHours}
            onChange={(e) => setFormData({ ...formData, regularHours: e.target.value })}
            error={errors.regularHours}
            required
            disabled={isSubmitting}
          />
          <Input
            label="Overtime Hours (0-12)"
            type="number"
            step="0.5"
            min="0"
            max="12"
            value={formData.overtimeHours}
            onChange={(e) => setFormData({ ...formData, overtimeHours: e.target.value })}
            error={errors.overtimeHours}
            disabled={isSubmitting}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <Input
            label="Tasks Completed / Work Notes"
            placeholder="Describe activities completed today..."
            value={formData.taskDescription}
            onChange={(e) => setFormData({ ...formData, taskDescription: e.target.value })}
            error={errors.taskDescription}
            required
            disabled={isSubmitting}
          />
        </div>
      </form>
    </Modal>
  );
};

export default TimesheetFormModal;
