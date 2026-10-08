import React from 'react';

const Alert = ({
  variant = 'info', // 'info' | 'success' | 'warning' | 'error'
  title,
  children,
  icon,
  className = '',
}) => {
  const getIcon = () => {
    if (icon) return icon;
    switch (variant) {
      case 'success': return '✓';
      case 'warning': return '⚠️';
      case 'error': return '✕';
      default: return 'ℹ';
    }
  };

  return (
    <div className={`hrms-alert hrms-alert--${variant} ${className}`} role="alert">
      <span style={{ fontSize: '1.1rem', lineHeight: 1 }}>{getIcon()}</span>
      <div className="hrms-alert-content">
        {title && <div className="hrms-alert-title">{title}</div>}
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Alert;
