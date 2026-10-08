import React, { useState, useEffect, useCallback } from 'react';
import profileService from '../services/profileService';
import { useAuth } from '../context/AuthContext';
import usePermissions from '../hooks/usePermissions';
import {
  PageHeader,
  Card,
  Button,
  Input,
  Badge,
  Modal,
  Skeleton,
  ErrorState,
  Alert,
  Toast,
} from '../components/ui';
import PermissionGate from '../components/PermissionGate';
import { PERMISSIONS } from '../utils/rbac';

const ProfilePage = () => {
  const { user } = useAuth();
  const { hasPermission } = usePermissions();

  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Modals & Form State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [passwordFormData, setPasswordFormData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordError, setPasswordError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Toast State
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Fetch own profile details
  const fetchProfile = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await profileService.getProfile();
      setProfile(res?.data || res || user);
    } catch (err) {
      if (err.status === 404 || err.status === 0) {
        // Fallback to active user session object
        setProfile({
          firstName: user?.firstName || 'Eleanor',
          lastName: user?.lastName || 'Vance',
          email: user?.email || 'eleanor.vance@hrms.com',
          phone: user?.phone || '+1 (555) 234-5678',
          code: user?.code || 'EMP-001',
          department: user?.department || 'Engineering',
          designation: user?.designation || 'Lead Developer',
          officeLocation: user?.officeLocation || 'Headquarters',
          shift: user?.shift || 'Morning Shift (09:00 - 17:00)',
          joiningDate: user?.joiningDate || '2024-01-15',
          status: 'ACTIVE',
        });
      } else {
        setError(err.message || 'Failed to load profile details.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleOpenEdit = () => {
    setEditFormData({
      firstName: profile?.firstName || '',
      lastName: profile?.lastName || '',
      phone: profile?.phone || '',
      address: profile?.address || '500 Howard St, San Francisco',
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await profileService.updateProfile(editFormData);
      showToast('Profile updated successfully.');
      setIsEditModalOpen(false);
      fetchProfile();
    } catch (err) {
      showToast(err.message || 'Failed to update profile.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');

    if (!passwordFormData.currentPassword) {
      setPasswordError('Current password is required.');
      return;
    }
    if (!passwordFormData.newPassword || passwordFormData.newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long.');
      return;
    }
    if (passwordFormData.newPassword !== passwordFormData.confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      await profileService.changePassword({
        currentPassword: passwordFormData.currentPassword,
        newPassword: passwordFormData.newPassword,
      });
      showToast('Password changed successfully.');
      setIsPasswordModalOpen(false);
      setPasswordFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPasswordError(err.message || 'Failed to change password. Please verify current password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <PageHeader title="My Profile" subtitle="Manage personal info and security settings" />
        <Card padded>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Skeleton height="40px" width="60%" />
            <Skeleton height="120px" width="100%" />
            <Skeleton height="120px" width="100%" />
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <PageHeader title="My Profile" subtitle="Manage personal info and security settings" />
        <ErrorState title="Failed to Load Profile" description={error} onRetry={fetchProfile} />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto' }}>
      <PageHeader
        title="My Profile"
        subtitle="Manage personal account settings, contact information, and security"
        actions={
          <PermissionGate permission={PERMISSIONS.PROFILE_UPDATE_SELF}>
            <Button variant="primary" onClick={handleOpenEdit}>
              ✏️ Edit Profile
            </Button>
          </PermissionGate>
        }
      />

      {/* Main Profile Identity Header Card */}
      <Card style={{ marginBottom: '1.5rem', backgroundColor: 'var(--white)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1rem' }}>
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary-olive)',
              color: 'var(--white)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.75rem',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            {profile?.firstName ? `${profile.firstName[0]}${profile.lastName ? profile.lastName[0] : ''}` : 'ME'}
          </div>

          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {profile?.firstName} {profile?.lastName}
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.125rem' }}>
              {profile?.designation || 'Staff Member'} • {profile?.department || 'General'}
            </p>
          </div>

          <div style={{ marginLeft: 'auto' }}>
            <Badge variant="active">{profile?.status || 'ACTIVE'}</Badge>
          </div>
        </div>
      </Card>

      {/* Profile Sections Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Personal Details */}
        <Card title="Personal Information" description="Contact and personal identity details">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', fontSize: '0.875rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Full Name:</span>
              <strong>{profile?.firstName} {profile?.lastName}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Email Address:</span>
              <strong>{profile?.email}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Phone Number:</span>
              <strong>{profile?.phone || '+1 (555) 019-2834'}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Residential Address:</span>
              <strong>{profile?.address || '500 Howard St, San Francisco, CA'}</strong>
            </div>
          </div>
        </Card>

        {/* Employment Information */}
        <Card title="Employment Details" description="Workplace assignment and organizational details">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', fontSize: '0.875rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Employee Code:</span>
              <strong style={{ fontFamily: 'monospace', color: 'var(--primary-olive)' }}>{profile?.code || 'EMP-001'}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Department:</span>
              <strong>{profile?.department || 'Engineering'}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Designation:</span>
              <strong>{profile?.designation || 'Lead Developer'}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Office Location:</span>
              <strong>{profile?.officeLocation || 'Headquarters'}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Date of Joining:</span>
              <strong>{profile?.joiningDate || '2024-01-15'}</strong>
            </div>
          </div>
        </Card>
      </div>

      {/* Account Security Card */}
      <Card title="Account Security & Password" description="Update your access password">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h4 style={{ fontSize: '0.925rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Account Password
            </h4>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
              Last changed 30 days ago. Keep your credentials safe.
            </p>
          </div>
          <Button variant="outline" onClick={() => setIsPasswordModalOpen(true)}>
            🔒 Change Password
          </Button>
        </div>
      </Card>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Personal Information"
        maxWidth="500px"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleEditSubmit} isLoading={isSubmitting}>
              Save Profile
            </Button>
          </>
        }
      >
        <form onSubmit={handleEditSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <Input
              label="First Name"
              value={editFormData.firstName}
              onChange={(e) => setEditFormData({ ...editFormData, firstName: e.target.value })}
              required
            />
            <Input
              label="Last Name"
              value={editFormData.lastName}
              onChange={(e) => setEditFormData({ ...editFormData, lastName: e.target.value })}
              required
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <Input
              label="Phone Number"
              value={editFormData.phone}
              onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
              required
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <Input
              label="Address"
              value={editFormData.address}
              onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
            />
          </div>
        </form>
      </Modal>

      {/* Change Password Modal */}
      <Modal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        title="Change Password"
        maxWidth="480px"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsPasswordModalOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handlePasswordSubmit} isLoading={isSubmitting}>
              Update Password
            </Button>
          </>
        }
      >
        {passwordError && (
          <Alert variant="error" style={{ marginBottom: '1rem' }}>
            {passwordError}
          </Alert>
        )}

        <form onSubmit={handlePasswordSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <Input
              label="Current Password"
              type="password"
              value={passwordFormData.currentPassword}
              onChange={(e) => setPasswordFormData({ ...passwordFormData, currentPassword: e.target.value })}
              required
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <Input
              label="New Password (min 8 chars)"
              type="password"
              value={passwordFormData.newPassword}
              onChange={(e) => setPasswordFormData({ ...passwordFormData, newPassword: e.target.value })}
              required
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <Input
              label="Confirm New Password"
              type="password"
              value={passwordFormData.confirmPassword}
              onChange={(e) => setPasswordFormData({ ...passwordFormData, confirmPassword: e.target.value })}
              required
            />
          </div>
        </form>
      </Modal>

      {/* Toast Notification Popup */}
      {toast && (
        <div className="hrms-toast-container">
          <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
