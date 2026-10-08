import React, { useEffect } from 'react';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  maxWidth = '520px',
  className = '',
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && onClose) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="hrms-modal-backdrop" onClick={onClose}>
      <div
        className={`hrms-modal ${className}`}
        style={{ maxWidth }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="hrms-modal-header">
          <h3 className="hrms-modal-title">{title}</h3>
          {onClose && (
            <button className="hrms-modal-close" onClick={onClose} aria-label="Close modal">
              ✕
            </button>
          )}
        </div>
        <div className="hrms-modal-body">{children}</div>
        {footer && <div className="hrms-modal-footer">{footer}</div>}
      </div>
    </div>
  );
};

export default Modal;
