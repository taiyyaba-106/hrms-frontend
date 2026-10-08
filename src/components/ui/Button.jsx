import React from 'react';
import LoadingSpinner from './LoadingSpinner';

const Button = ({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost'
  size = 'md', // 'sm' | 'md' | 'lg'
  isLoading = false,
  disabled = false,
  iconStart = null,
  iconEnd = null,
  onClick,
  type = 'button',
  className = '',
  ...props
}) => {
  return (
    <button
      type={type}
      className={`hrms-btn hrms-btn--${variant} hrms-btn--${size} ${className}`}
      disabled={disabled || isLoading}
      onClick={onClick}
      {...props}
    >
      {isLoading ? (
        <LoadingSpinner size="sm" color={variant === 'primary' || variant === 'danger' ? '#FFFFFF' : 'var(--primary-olive)'} />
      ) : (
        iconStart
      )}
      <span>{children}</span>
      {!isLoading && iconEnd}
    </button>
  );
};

export default Button;
