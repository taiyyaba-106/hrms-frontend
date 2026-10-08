import React from 'react';
import { Modal, Badge, Button } from '../ui';

const EmployeeDetailsModal = ({ isOpen, onClose, employee, onEdit }) => {
  if (!employee) return null;

  const getStatusVariant = (status) => {
    switch (status?.toUpperCase()) {
      case 'ACTIVE': return 'active';
      case 'APPROVED': return 'approved';
      case 'PENDING': return 'pending';
      case 'INACTIVE': return 'inactive';
      case 'TERMINATED': return 'terminated';
      default: return 'neutral';
    }
  };

  const footer = (
    <>
      <Button variant="outline" onClick={onClose}>
        Close
      </Button>
      {onEdit && (
        <Button variant="primary" onClick={() => { onClose(); onEdit(employee); }}>
          Edit Employee
        </Button>
      )}
    </>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Employee Record Details" footer={footer} maxWidth="560px">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: 'var(--primary-olive)',
            color: 'var(--white)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '1.25rem',
          }}
        >
          {employee.firstName ? `${employee.firstName[0]}${employee.lastName ? employee.lastName[0] : ''}` : 'EMP'}
        </div>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            {employee.firstName} {employee.lastName}
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            {employee.designation || 'Staff Member'} • {employee.department || 'General'}
          </p>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <Badge variant={getStatusVariant(employee.status)}>{employee.status || 'ACTIVE'}</Badge>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.875rem' }}>
        <div style={{ backgroundColor: 'var(--background)', padding: '0.875rem', borderRadius: 'var(--radius-md)' }}>
          <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '0.75rem', fontWeight: 600 }}>
            EMAIL ADDRESS
          </span>
          <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{employee.email || 'N/A'}</span>
        </div>

        <div style={{ backgroundColor: 'var(--background)', padding: '0.875rem', borderRadius: 'var(--radius-md)' }}>
          <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '0.75rem', fontWeight: 600 }}>
            PHONE NUMBER
          </span>
          <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{employee.phone || 'N/A'}</span>
        </div>

        <div style={{ backgroundColor: 'var(--background)', padding: '0.875rem', borderRadius: 'var(--radius-md)' }}>
          <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '0.75rem', fontWeight: 600 }}>
            OFFICE LOCATION
          </span>
          <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>
            {employee.officeLocation || employee.location || 'Headquarters'}
          </span>
        </div>

        <div style={{ backgroundColor: 'var(--background)', padding: '0.875rem', borderRadius: 'var(--radius-md)' }}>
          <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '0.75rem', fontWeight: 600 }}>
            WORK SHIFT
          </span>
          <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{employee.shift || 'Morning Shift'}</span>
        </div>

        <div style={{ backgroundColor: 'var(--background)', padding: '0.875rem', borderRadius: 'var(--radius-md)' }}>
          <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '0.75rem', fontWeight: 600 }}>
            DATE OF JOINING
          </span>
          <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>
            {employee.joiningDate ? new Date(employee.joiningDate).toLocaleDateString() : 'N/A'}
          </span>
        </div>

        <div style={{ backgroundColor: 'var(--background)', padding: '0.875rem', borderRadius: 'var(--radius-md)' }}>
          <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '0.75rem', fontWeight: 600 }}>
            EMPLOYEE CODE
          </span>
          <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{employee.code || `EMP-${employee.id || '001'}`}</span>
        </div>
      </div>
    </Modal>
  );
};

export default EmployeeDetailsModal;
