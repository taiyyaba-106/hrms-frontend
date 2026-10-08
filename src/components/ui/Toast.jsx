import React from 'react';

const Toast = ({
  message,
  type = 'info', // 'info' | 'success' | 'warning' | 'error'
  onClose,
  className = '',
}) => {
  const getIcon = () => {
    switch (type) {
      case 'success': return <span style={{ color: 'var(--badge-active-text)' }}>✓</span>;
      case 'error': return <span style={{ color: '#8C2B23' }}>✕</span>;
      case 'warning': return <span style={{ color: '#5A4E0B' }}>⚠️</span>;
      default: return <span style={{ color: 'var(--primary-olive)' }}>ℹ</span>;
    }
  };

  return (
    <div className={`hrms-toast ${className}`}>
      {getIcon()}
      <span style={{ flex: 1 }}>{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default Toast;
