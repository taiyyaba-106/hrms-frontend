import React from 'react';
import { Modal, Badge, Button } from '../ui';

const LeaveDetailsModal = ({ isOpen, onClose, request, onApprove, onReject }) => {
  if (!request) return null;

  const getBadgeVariant = (status) => {
    switch (status?.toUpperCase()) {
      case 'APPROVED': return 'approved';
      case 'PENDING': return 'pending';
      case 'REJECTED': return 'rejected';
      case 'CANCELLED': return 'inactive';
      default: return 'neutral';
    }
  };

  const footer = (
    <>
      <Button variant="outline" onClick={onClose}>
        Close
      </Button>
      {request.status === 'PENDING' && onApprove && (
        <Button variant="primary" onClick={() => { onClose(); onApprove(request.id); }}>
          Approve Request
        </Button>
      )}
      {request.status === 'PENDING' && onReject && (
        <Button variant="danger" onClick={() => { onClose(); onReject(request.id); }}>
          Reject Request
        </Button>
      )}
    </>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Leave Request Inspection" footer={footer} maxWidth="520px">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            {request.leaveType} Leave
          </h3>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
            Requested by: {request.employeeName || 'Staff Member'}
          </p>
        </div>
        <Badge variant={getBadgeVariant(request.status)}>{request.status || 'PENDING'}</Badge>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
        <div style={{ backgroundColor: 'var(--background)', padding: '0.875rem', borderRadius: 'var(--radius-md)' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', fontWeight: 600 }}>
            START DATE
          </span>
          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{request.startDate}</span>
        </div>
        <div style={{ backgroundColor: 'var(--background)', padding: '0.875rem', borderRadius: 'var(--radius-md)' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', fontWeight: 600 }}>
            END DATE
          </span>
          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{request.endDate}</span>
        </div>
      </div>

      <div style={{ backgroundColor: 'var(--background)', padding: '0.875rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem' }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', fontWeight: 600, marginBottom: '0.25rem' }}>
          REASON FOR LEAVE
        </span>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
          {request.reason || 'No detailed reason provided.'}
        </p>
      </div>
    </Modal>
  );
};

export default LeaveDetailsModal;
