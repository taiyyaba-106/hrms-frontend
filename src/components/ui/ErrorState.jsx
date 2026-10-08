import React from 'react';
import Button from './Button';

const ErrorState = ({
  title = 'Something went wrong',
  description = 'An error occurred while loading this section. Please try again.',
  icon = '⚠️',
  onRetry = null,
  retryText = 'Retry',
  className = '',
}) => {
  return (
    <div className={`hrms-error-state ${className}`}>
      <div className="hrms-state-icon">{icon}</div>
      <h3 className="hrms-state-title">{title}</h3>
      <p className="hrms-state-description">{description}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          {retryText}
        </Button>
      )}
    </div>
  );
};

export default ErrorState;
