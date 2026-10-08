import React from 'react';

const LoadingSpinner = ({ size = 'md', color, className = '' }) => {
  const style = color ? { borderTopColor: color } : {};
  return (
    <span
      className={`hrms-spinner hrms-spinner--${size} ${className}`}
      style={style}
      role="status"
      aria-label="Loading"
    />
  );
};

export default LoadingSpinner;
