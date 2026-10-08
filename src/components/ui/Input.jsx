import React from 'react';

const Input = ({
  label,
  id,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  error = '',
  helperText = '',
  disabled = false,
  required = false,
  iconStart = null,
  iconEnd = null,
  className = '',
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`hrms-field-group ${className}`}>
      {label && (
        <label htmlFor={inputId} className="hrms-label">
          {label} {required && <span style={{ color: '#8C2B23' }}>*</span>}
        </label>
      )}
      <div className="hrms-input-wrapper">
        {iconStart && <span className="hrms-input-icon-start">{iconStart}</span>}
        <input
          id={inputId}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`hrms-input ${iconStart ? 'hrms-input--with-icon-start' : ''} ${
            iconEnd ? 'hrms-input--with-icon-end' : ''
          } ${error ? 'hrms-input--error' : ''}`}
          {...props}
        />
        {iconEnd && <span className="hrms-input-icon-end">{iconEnd}</span>}
      </div>
      {error && <p className="hrms-error-text">{error}</p>}
      {!error && helperText && <p className="hrms-helper-text">{helperText}</p>}
    </div>
  );
};

export default Input;
