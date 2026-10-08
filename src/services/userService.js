import apiClient from './apiClient';

/**
 * User Management, Roles & Permissions API Endpoints
 */
const userService = {
  /**
   * Fetch all user accounts with pagination and filtering
   * @param {Object} params { search, role, page, size }
   */
  async getUsers(params = {}) {
    return apiClient.get('/api/users', { params });
  },

  /**
   * Fetch single user details
   * @param {string|number} id
   */
  async getUserById(id) {
    return apiClient.get(`/api/users/${id}`);
  },

  /**
   * Create new system user account
   * @param {Object} userData
   */
  async createUser(userData) {
    return apiClient.post('/api/users', userData);
  },

  /**
   * Update existing user details
   * @param {string|number} id
   * @param {Object} userData
   */
  async updateUser(id, userData) {
    return apiClient.put(`/api/users/${id}`, userData);
  },

  /**
   * Fetch available system roles
   */
  async getRoles() {
    return apiClient.get('/api/users/roles');
  },

  /**
   * Fetch granular system permissions matrix
   */
  async getPermissions() {
    return apiClient.get('/api/users/permissions');
  },

  /**
   * Update user role assignment
   * @param {string|number} userId
   * @param {string|number} roleId
   */
  async updateUserRole(userId, roleId) {
    return apiClient.put(`/api/users/${userId}/role`, { roleId });
  },
};

export default userService;
