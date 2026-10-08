import apiClient from './apiClient';

/**
 * User Self-Service Profile API Endpoints
 */
const profileService = {
  /**
   * Fetch current user's personal profile
   */
  async getProfile() {
    try {
      return await apiClient.get('/api/v1/profile');
    } catch (err) {
      if (err.status === 404) {
        return await apiClient.get('/api/profile');
      }
      throw err;
    }
  },

  /**
   * Update profile information
   * @param {Object} profileData
   */
  async updateProfile(profileData) {
    try {
      return await apiClient.put('/api/v1/profile', profileData);
    } catch (err) {
      if (err.status === 404) {
        return await apiClient.put('/api/profile', profileData);
      }
      throw err;
    }
  },

  /**
   * Change current account password
   * @param {Object} data { currentPassword, newPassword }
   */
  async changePassword(data) {
    try {
      return await apiClient.post('/api/v1/profile/change-password', data);
    } catch (err) {
      if (err.status === 404) {
        return await apiClient.post('/api/profile/change-password', data);
      }
      throw err;
    }
  },

  /**
   * Upload profile avatar image
   * @param {File} imageFile
   */
  async uploadAvatar(imageFile) {
    const formData = new FormData();
    formData.append('avatar', imageFile);
    try {
      return await apiClient.post('/api/v1/profile/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    } catch (err) {
      if (err.status === 404) {
        return await apiClient.post('/api/profile/avatar', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      throw err;
    }
  },
};

export default profileService;
