import React from 'react';

const Card = ({
  children,
  title,
  description,
  actions,
  footer,
  padded = true,
  className = '',
  ...props
}) => {
  return (
    <div className={`hrms-card ${padded && !title ? 'hrms-card--padded' : ''} ${className}`} {...props}>
      {(title || description || actions) && (
        <div className="hrms-card-header">
          <div>
            {title && <h3 className="hrms-card-title">{title}</h3>}
            {description && <p className="hrms-card-description">{description}</p>}
          </div>
          {actions && <div>{actions}</div>}
        </div>
      )}
      <div className={title ? 'hrms-card-body' : ''}>{children}</div>
      {footer && <div className="hrms-card-footer">{footer}</div>}
    </div>
  );
};

export default Card;
