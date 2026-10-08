import React from 'react';

const Badge = ({
  children,
  variant = 'neutral', // 'active' | 'pending' | 'approved' | 'rejected' | 'inactive' | 'terminated' | 'neutral'
  showDot = true,
  className = '',
  ...props
}) => {
  const variantClass = `hrms-badge--${variant.toLowerCase()}`;
  return (
    <span
      className={`hrms-badge ${showDot ? 'hrms-badge--dot' : ''} ${variantClass} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
