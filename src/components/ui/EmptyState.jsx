import React from 'react';

const EmptyState = ({
  title = 'No data found',
  description = 'There are no records to display at this time.',
  icon = '📁',
  action = null,
  className = '',
}) => {
  return (
    <div className={`hrms-empty-state ${className}`}>
      <div className="hrms-state-icon">{icon}</div>
      <h3 className="hrms-state-title">{title}</h3>
      <p className="hrms-state-description">{description}</p>
      {action}
    </div>
  );
};

export default EmptyState;
