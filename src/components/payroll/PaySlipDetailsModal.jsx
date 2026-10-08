import React from 'react';
import { Modal, Badge, Button } from '../ui';

const PaySlipDetailsModal = ({ isOpen, onClose, payslip, onDownloadPdf }) => {
  if (!payslip) return null;

  const basicSalary = Number(payslip.basicSalary || 5000);
  const allowances = Number(payslip.allowances || 800);
  const grossPay = basicSalary + allowances;
  const taxDeduction = Number(payslip.taxDeduction || 650);
  const insuranceDeduction = Number(payslip.insuranceDeduction || 150);
  const totalDeductions = taxDeduction + insuranceDeduction;
  const netSalary = Number(payslip.netSalary || grossPay - totalDeductions);

  const footer = (
    <>
      <Button variant="outline" onClick={onClose}>
        Close
      </Button>
      <Button variant="primary" onClick={() => onDownloadPdf && onDownloadPdf(payslip.id)}>
        📄 Download PDF Payslip
      </Button>
    </>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Payslip & Salary Breakdown" footer={footer} maxWidth="560px">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            {payslip.employeeName || 'Employee Record'}
          </h3>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
            Code: {payslip.employeeCode || `EMP-${payslip.id || '001'}`} • {payslip.month || 'September'} {payslip.year || '2026'}
          </p>
        </div>
        <Badge variant={payslip.status === 'PROCESSED' || payslip.status === 'APPROVED' ? 'approved' : 'pending'}>
          {payslip.status || 'PROCESSED'}
        </Badge>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
        {/* Earnings Side */}
        <div style={{ backgroundColor: 'var(--background)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
          <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--primary-olive)', marginBottom: '0.75rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.375rem' }}>
            EARNINGS
          </h4>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '0.375rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Basic Salary:</span>
            <strong>${basicSalary.toLocaleString()}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '0.375rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Allowances:</span>
            <strong>${allowances.toLocaleString()}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', fontWeight: 700, marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px dashed var(--border)' }}>
            <span>Gross Pay:</span>
            <span style={{ color: 'var(--primary-olive)' }}>${grossPay.toLocaleString()}</span>
          </div>
        </div>

        {/* Deductions Side */}
        <div style={{ backgroundColor: 'var(--background)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
          <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#8C2B23', marginBottom: '0.75rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.375rem' }}>
            DEDUCTIONS
          </h4>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '0.375rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Tax Withholding:</span>
            <strong>${taxDeduction.toLocaleString()}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '0.375rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Health Insurance:</span>
            <strong>${insuranceDeduction.toLocaleString()}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', fontWeight: 700, marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px dashed var(--border)' }}>
            <span>Total Deductions:</span>
            <span style={{ color: '#8C2B23' }}>${totalDeductions.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Net Pay Highlight Banner */}
      <div
        style={{
          backgroundColor: 'var(--pastel-green)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          padding: '1rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justify: 'space-between',
        }}
      >
        <span style={{ fontSize: '0.925rem', fontWeight: 700, color: '#1E4620' }}>NET PAYABLE SALARY:</span>
        <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1E4620' }}>${netSalary.toLocaleString()}</span>
      </div>
    </Modal>
  );
};

export default PaySlipDetailsModal;
