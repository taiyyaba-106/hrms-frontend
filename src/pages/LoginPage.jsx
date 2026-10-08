import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button, Input, Alert, Card } from '../components/ui';

const LoginPage = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation States
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [apiError, setApiError] = useState('');

  // Redirect if user is already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const validateEmail = (val) => {
    if (!val) {
      return 'Email address is required.';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(val)) {
      return 'Please enter a valid email address.';
    }
    return '';
  };

  const validatePassword = (val) => {
    if (!val) {
      return 'Password is required.';
    }
    return '';
  };

  const handleBlurEmail = () => {
    setEmailError(validateEmail(email));
  };

  const handleBlurPassword = () => {
    setPasswordError(validatePassword(password));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    const eErr = validateEmail(email);
    const pErr = validatePassword(password);

    setEmailError(eErr);
    setPasswordError(pErr);

    if (eErr || pErr) {
      return;
    }

    setIsSubmitting(true);

    try {
      await login({ email, password });
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } catch (err) {
      if (err.status === 401) {
        setApiError('Invalid credentials. Please verify your email and password.');
      } else if (err.status === 403) {
        setApiError('Your account is inactive or not activated yet. Please check your activation email.');
      } else if (err.status === 404) {
        setApiError('No account found registered with this email address.');
      } else if (err.status === 0) {
        setApiError('Unable to connect to HRMS backend. Please ensure server is running on port 8081.');
      } else {
        setApiError(err.message || 'Authentication failed. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={styles.pageContainer}>
      {/* Decorative ambient background elements */}
      <div style={styles.bgBlobTopLeft} />
      <div style={styles.bgBlobBottomRight} />

      <div style={styles.loginWrapper}>
        <Card padded={false} style={styles.cardOverride}>
          <div style={styles.cardHeader}>
            <div style={styles.logoBadge}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <h1 style={styles.brandTitle}>HRMS</h1>
            <p style={styles.brandSubtitle}>Human Resource Management System</p>
          </div>

          <div style={styles.cardContent}>
            <div style={styles.titleGroup}>
              <h2 style={styles.heading}>Sign in</h2>
              <p style={styles.subheading}>Enter your credentials to access your account</p>
            </div>

            {apiError && (
              <Alert variant="error" style={{ marginBottom: '1.25rem' }}>
                {apiError}
              </Alert>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div style={{ marginBottom: '1.25rem' }}>
                <Input
                  label="Email Address"
                  type="email"
                  id="login-email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError('');
                  }}
                  onBlur={handleBlurEmail}
                  error={emailError}
                  required
                  disabled={isSubmitting}
                  iconStart={
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                  }
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  id="login-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (passwordError) setPasswordError('');
                  }}
                  onBlur={handleBlurPassword}
                  error={passwordError}
                  required
                  disabled={isSubmitting}
                  iconStart={
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  }
                  iconEnd={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      title={showPassword ? 'Hide password' : 'Show password'}
                      style={styles.eyeBtn}
                      disabled={isSubmitting}
                    >
                      {showPassword ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </svg>
                      ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  }
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isSubmitting}
                disabled={isSubmitting}
                style={{ width: '100%' }}
              >
                Sign in
              </Button>
            </form>
          </div>

          <div style={styles.cardFooter}>
            <p style={styles.activationText}>
              Activating a new account? Open the link from your onboarding email, or go to{' '}
              <Link to="/activate" style={styles.activationLink}>
                account activation
              </Link>
              .
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

const styles = {
  pageContainer: {
    position: 'relative',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'var(--background)',
    padding: '1.5rem',
    overflow: 'hidden',
  },
  bgBlobTopLeft: {
    position: 'absolute',
    top: '-10%',
    left: '-10%',
    width: '350px',
    height: '350px',
    borderRadius: '50%',
    backgroundColor: 'var(--light-yellow-green)',
    opacity: 0.6,
    filter: 'blur(60px)',
    pointerEvents: 'none',
  },
  bgBlobBottomRight: {
    position: 'absolute',
    bottom: '-10%',
    right: '-10%',
    width: '400px',
    height: '400px',
    borderRadius: '50%',
    backgroundColor: 'var(--pastel-green)',
    opacity: 0.5,
    filter: 'blur(70px)',
    pointerEvents: 'none',
  },
  loginWrapper: {
    position: 'relative',
    zIndex: 1,
    width: '100%',
    maxWidth: '440px',
  },
  cardOverride: {
    boxShadow: 'var(--shadow-lg)',
    borderColor: 'var(--border)',
    borderRadius: 'var(--radius-lg)',
    backgroundColor: 'var(--white)',
  },
  cardHeader: {
    textAlign: 'center',
    padding: '2.25rem 2rem 1.5rem',
    borderBottom: '1px solid var(--border)',
    backgroundColor: 'rgba(232, 242, 199, 0.25)',
  },
  logoBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '48px',
    height: '48px',
    borderRadius: 'var(--radius-md)',
    backgroundColor: 'var(--primary-olive)',
    color: 'var(--white)',
    marginBottom: '0.75rem',
    boxShadow: '0 4px 10px rgba(45, 71, 51, 0.2)',
  },
  brandTitle: {
    fontSize: '1.75rem',
    fontWeight: 800,
    color: 'var(--primary-olive)',
    letterSpacing: '-0.025em',
    lineHeight: 1.2,
  },
  brandSubtitle: {
    fontSize: '0.8125rem',
    fontWeight: 600,
    color: 'var(--text-secondary)',
    letterSpacing: '0.02em',
    marginTop: '0.25rem',
  },
  cardContent: {
    padding: '2rem',
  },
  titleGroup: {
    marginBottom: '1.5rem',
    textAlign: 'center',
  },
  heading: {
    fontSize: '1.375rem',
    fontWeight: 700,
    color: 'var(--text-primary)',
    marginBottom: '0.25rem',
  },
  subheading: {
    fontSize: '0.875rem',
    color: 'var(--text-secondary)',
  },
  eyeBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: 'var(--text-secondary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
  },
  cardFooter: {
    padding: '1.25rem 2rem',
    backgroundColor: 'var(--background)',
    borderTop: '1px solid var(--border)',
    textAlign: 'center',
  },
  activationText: {
    fontSize: '0.8125rem',
    color: 'var(--text-secondary)',
    lineHeight: 1.5,
  },
  activationLink: {
    color: 'var(--primary-olive)',
    fontWeight: 600,
    textDecoration: 'underline',
  },
};

export default LoginPage;
