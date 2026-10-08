import React from 'react';

const Select = ({
  label,
  id,
  options = [],
  value,
  onChange,
  placeholder = 'Select an option',
  error = '',
  helperText = '',
  disabled = false,
  required = false,
  className = '',
  ...props
}) => {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`hrms-field-group ${className}`}>
      {label && (
        <label htmlFor={selectId} className="hrms-label">
          {label} {required && <span style={{ color: '#8C2B23' }}>*</span>}
        </label>
      )}
      <div className="hrms-input-wrapper">
        <select
          id={selectId}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`hrms-select ${error ? 'hrms-select--error' : ''}`}
          {...props}
        >
          {placeholder && <option value="" disabled>{placeholder}</option>}
          {options.map((opt) => {
            const val = typeof opt === 'object' ? opt.value : opt;
            const lbl = typeof opt === 'object' ? opt.label : opt;
            return (
              <option key={val} value={val}>
                {lbl}
              </option>
            );
          })}
        </select>
        <span className="hrms-select-arrow">▼</span>
      </div>
      {error && <p className="hrms-error-text">{error}</p>}
      {!error && helperText && <p className="hrms-helper-text">{helperText}</p>}
    </div>
  );
};

export default Select;
