import React from 'react';

const PageHeader = ({
  title,
  subtitle,
  actions,
  badge,
  className = '',
}) => {
  return (
    <header className={`hrms-page-header ${className}`}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <h1 className="hrms-page-title">{title}</h1>
          {badge}
        </div>
        {subtitle && <p className="hrms-page-subtitle">{subtitle}</p>}
      </div>
      {actions && <div className="hrms-page-actions">{actions}</div>}
    </header>
  );
};

export default PageHeader;
