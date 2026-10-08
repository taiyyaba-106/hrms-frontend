import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import { Button, Input, Card, Alert } from '../components/ui';

const AccountActivationPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const tokenFromUrl = searchParams.get('token') || searchParams.get('code') || '';

  const [token, setToken] = useState(tokenFromUrl);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Validation and Status States
  const [passwordError, setPasswordError] = useState('');
  const [confirmError, setConfirmError] = useState('');
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    }
  }, [tokenFromUrl]);

  const validate = () => {
    let isValid = true;
    setPasswordError('');
    setConfirmError('');

    if (!token.trim()) {
      setApiError('Activation token is required. Please check your onboarding email link.');
      return false;
    }

    if (!password) {
      setPasswordError('New password is required.');
      isValid = false;
    } else if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters long.');
      isValid = false;
    }

    if (!confirmPassword) {
      setConfirmError('Please confirm your new password.');
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmError('Passwords do not match.');
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    setSuccessMessage('');

    if (!validate()) return;

    setIsLoading(true);

    try {
      await authService.activateAccount({
        token: token.trim(),
        password: password,
      });

      // Clear plain password state immediately after submission for security
      setPassword('');
      setConfirmPassword('');

      setSuccessMessage('Account activated successfully! Redirecting to login page...');
      
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 2500);
    } catch (err) {
      setPassword('');
      setConfirmPassword('');

      if (err.status === 400 || err.status === 404) {
        setApiError('Invalid, expired, or already redeemed activation token.');
      } else if (err.status === 409) {
        setApiError('This account has already been activated. Please sign in directly.');
      } else if (err.status === 0) {
        setApiError('Unable to connect to HRMS server on port 8081.');
      } else {
        setApiError(err.message || 'Failed to activate account. Please try again or contact HR.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.wrapper}>
        <Card padded={false} style={styles.card}>
          <div style={styles.header}>
            <div style={styles.logoBadge}>HR</div>
            <h1 style={styles.title}>Activate Account</h1>
            <p style={styles.subtitle}>HRMS - Human Resource Management System</p>
          </div>

          <div style={styles.body}>
            {successMessage && (
              <Alert variant="success" style={{ marginBottom: '1.25rem' }}>
                {successMessage}
              </Alert>
            )}

            {apiError && (
              <Alert variant="error" style={{ marginBottom: '1.25rem' }}>
                {apiError}
              </Alert>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div style={{ marginBottom: '1.25rem' }}>
                <Input
                  label="Activation Token / Code"
                  placeholder="Enter code from onboarding email"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  required
                  disabled={isLoading || !!successMessage}
                  helperText={tokenFromUrl ? 'Token automatically loaded from invitation URL' : ''}
                />
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <Input
                  label="Create New Password (min 8 characters)"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (passwordError) setPasswordError('');
                  }}
                  error={passwordError}
                  required
                  disabled={isLoading || !!successMessage}
                  iconEnd={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={styles.eyeBtn}
                    >
                      {showPassword ? '🙈' : '👁️'}
                    </button>
                  }
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <Input
                  label="Confirm New Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (confirmError) setConfirmError('');
                  }}
                  error={confirmError}
                  required
                  disabled={isLoading || !!successMessage}
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isLoading}
                disabled={isLoading || !!successMessage}
                style={{ width: '100%' }}
              >
                Activate Account & Set Password
              </Button>
            </form>
          </div>

          <div style={styles.footer}>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
              Already activated your account?{' '}
              <Link to="/login" style={{ color: 'var(--primary-olive)', fontWeight: 600 }}>
                Sign in here
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

const styles = {
  pageContainer: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'var(--background)',
    padding: '1.5rem',
  },
  wrapper: {
    width: '100%',
    maxWidth: '460px',
  },
  card: {
    boxShadow: 'var(--shadow-lg)',
  },
  header: {
    textAlign: 'center',
    padding: '2rem 1.5rem 1.25rem',
    borderBottom: '1px solid var(--border)',
    backgroundColor: 'rgba(232, 242, 199, 0.25)',
  },
  logoBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '44px',
    height: '44px',
    borderRadius: 'var(--radius-md)',
    backgroundColor: 'var(--primary-olive)',
    color: 'var(--white)',
    fontWeight: 800,
    fontSize: '1.125rem',
    marginBottom: '0.75rem',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: 'var(--primary-olive)',
  },
  subtitle: {
    fontSize: '0.8125rem',
    color: 'var(--text-secondary)',
    marginTop: '0.25rem',
  },
  body: {
    padding: '2rem',
  },
  eyeBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
  },
  footer: {
    padding: '1.25rem 2rem',
    backgroundColor: 'var(--background)',
    borderTop: '1px solid var(--border)',
    textAlign: 'center',
  },
};

export default AccountActivationPage;
