import React from 'react';

const StatCard = ({
  label,
  value,
  subtext,
  icon,
  className = '',
}) => {
  return (
    <div className={`hrms-stat-card ${className}`}>
      <div className="hrms-stat-header">
        <span className="hrms-stat-label">{label}</span>
        {icon && <div className="hrms-stat-icon">{icon}</div>}
      </div>
      <div className="hrms-stat-value">{value}</div>
      {subtext && <div className="hrms-stat-subtext">{subtext}</div>}
    </div>
  );
};

export default StatCard;
