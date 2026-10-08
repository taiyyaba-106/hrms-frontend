import React, { useState, useEffect } from 'react';
import { Modal, Input, Select, Button, Alert } from '../ui';

const leaveTypeOptions = [
  { label: 'Annual Leave (14 Days Remaining)', value: 'ANNUAL', maxDays: 14 },
  { label: 'Sick Leave (8 Days Remaining)', value: 'SICK', maxDays: 8 },
  { label: 'Casual Leave (5 Days Remaining)', value: 'CASUAL', maxDays: 5 },
  { label: 'Maternity / Paternity Leave', value: 'PARENTAL', maxDays: 90 },
  { label: 'Unpaid Special Leave', value: 'UNPAID', maxDays: 30 },
];

const ApplyLeaveModal = ({
  isOpen,
  onClose,
  onSubmit,
  balances = {},
  existingRequests = [],
  isSubmitting = false,
  apiError = '',
}) => {
  const [formData, setFormData] = useState({
    leaveType: 'ANNUAL',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    reason: '',
  });
  const [errors, setErrors] = useState({});
  const [requestedDays, setRequestedDays] = useState(1);

  // Calculate requested days count dynamically
  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (end >= start) {
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        setRequestedDays(diffDays);
      } else {
        setRequestedDays(0);
      }
    }
  }, [formData.startDate, formData.endDate]);

  const validate = () => {
    const errs = {};
    if (!formData.leaveType) errs.leaveType = 'Please select a leave type.';
    if (!formData.startDate) errs.startDate = 'Start date is required.';
    if (!formData.endDate) errs.endDate = 'End date is required.';

    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);

      if (end < start) {
        errs.endDate = 'End date cannot be prior to start date.';
      }

      // Check balance limit
      const selectedType = leaveTypeOptions.find((t) => t.value === formData.leaveType);
      const maxAvailable = balances[formData.leaveType] ?? (selectedType ? selectedType.maxDays : 14);

      if (requestedDays > maxAvailable && formData.leaveType !== 'UNPAID') {
        errs.startDate = `Insufficient balance. Requested ${requestedDays} days, but only ${maxAvailable} days available.`;
      }

      // Check overlapping leave dates
      const hasOverlap = existingRequests.some((req) => {
        if (req.status === 'REJECTED' || req.status === 'CANCELLED') return false;
        const rStart = new Date(req.startDate);
        const rEnd = new Date(req.endDate);
        return start <= rEnd && end >= rStart;
      });

      if (hasOverlap) {
        errs.startDate = 'Overlapping leave request already exists for these dates.';
      }
    }

    if (!formData.reason.trim()) {
      errs.reason = 'Please provide a reason for your leave request.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({ ...formData, daysCount: requestedDays });
  };

  const footer = (
    <>
      <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
        Cancel
      </Button>
      <Button variant="primary" onClick={handleSubmit} isLoading={isSubmitting}>
        Submit Leave Application
      </Button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Apply for Leave"
      footer={footer}
      maxWidth="540px"
    >
      {apiError && (
        <Alert variant="error" style={{ marginBottom: '1.25rem' }}>
          {apiError}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <Select
            label="Leave Type"
            value={formData.leaveType}
            onChange={(e) => setFormData({ ...formData, leaveType: e.target.value })}
            options={leaveTypeOptions}
            error={errors.leaveType}
            required
            disabled={isSubmitting}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <Input
            label="Start Date"
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            error={errors.startDate}
            required
            disabled={isSubmitting}
          />
          <Input
            label="End Date"
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            error={errors.endDate}
            required
            disabled={isSubmitting}
          />
        </div>

        <div
          style={{
            backgroundColor: 'var(--background)',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.875rem',
          }}
        >
          <span style={{ color: 'var(--text-secondary)' }}>Total Duration Requested:</span>
          <strong style={{ color: 'var(--primary-olive)', fontSize: '1rem' }}>
            {requestedDays} {requestedDays === 1 ? 'Day' : 'Days'}
          </strong>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <Input
            label="Reason for Leave"
            placeholder="Explain reason for leave request..."
            value={formData.reason}
            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            error={errors.reason}
            required
            disabled={isSubmitting}
          />
        </div>
      </form>
    </Modal>
  );
};

export default ApplyLeaveModal;
