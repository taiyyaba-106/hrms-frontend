import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Breadcrumbs from './Breadcrumbs';

const Header = ({ onToggleMobile }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const getInitials = (name, email) => {
    if (name) {
      const parts = name.split(' ');
      if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      return name.slice(0, 2).toUpperCase();
    }
    if (email) return email.slice(0, 2).toUpperCase();
    return 'HR';
  };

  const displayName = user?.firstName
    ? `${user.firstName} ${user.lastName || ''}`
    : user?.name || user?.email || 'Admin User';
  const roleDisplay = user?.role || 'Super Admin';

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsDropdownOpen(false);
    await logout();
    navigate('/login');
  };

  return (
    <header className="hrms-header">
      {/* Left side: Hamburger button + Breadcrumbs */}
      <div className="hrms-header-left">
        <button
          type="button"
          className="hrms-mobile-menu-btn"
          onClick={onToggleMobile}
          aria-label="Open Navigation Menu"
        >
          ☰
        </button>
        <Breadcrumbs />
      </div>

      {/* Right side: Notifications & User profile menu */}
      <div className="hrms-header-right">
        {/* Notification Icon */}
        <button
          type="button"
          className="hrms-icon-btn"
          title="Notifications"
          onClick={() => alert('Notifications: No unread alerts')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <span className="hrms-notification-dot" />
        </button>

        {/* User Profile Dropdown Menu */}
        <div className="hrms-user-menu" ref={dropdownRef}>
          <button
            type="button"
            className="hrms-user-trigger"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            aria-expanded={isDropdownOpen}
          >
            <div className="hrms-avatar">{getInitials(displayName, user?.email)}</div>
            <div className="hrms-user-info">
              <span className="hrms-user-name">{displayName}</span>
              <span className="hrms-user-role">{roleDisplay}</span>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>▼</span>
          </button>

          {isDropdownOpen && (
            <div className="hrms-dropdown-menu">
              <div style={{ padding: '0.5rem 1rem', borderBottom: '1px solid var(--border)' }}>
                <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {displayName}
                </p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{user?.email}</p>
              </div>

              <Link
                to="/profile"
                className="hrms-dropdown-item"
                onClick={() => setIsDropdownOpen(false)}
              >
                <span>👤</span>
                <span>My Profile</span>
              </Link>

              <Link
                to="/demo"
                className="hrms-dropdown-item"
                onClick={() => setIsDropdownOpen(false)}
              >
                <span>🎨</span>
                <span>Design System Demo</span>
              </Link>

              <div className="hrms-dropdown-divider" />

              <button type="button" className="hrms-dropdown-item" onClick={handleLogout}>
                <span style={{ color: '#8C2B23' }}>🚪</span>
                <span style={{ color: '#8C2B23', fontWeight: 500 }}>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
