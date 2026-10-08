import apiClient from './apiClient';

/**
 * Leave Management API Endpoints
 */
const leaveService = {
  /**
   * Fetch leave requests with filter parameters
   * @param {Object} params { status, leaveTypeId, employeeId, startDate, endDate, page, size }
   */
  async getLeaveRequests(params = {}) {
    try {
      return await apiClient.get('/api/v1/leaves', { params });
    } catch (err) {
      if (err.status === 404) {
        return await apiClient.get('/api/leaves', { params });
      }
      throw err;
    }
  },

  /**
   * Fetch available leave types (e.g. Annual, Sick, Casual, Parental)
   */
  async getLeaveTypes() {
    try {
      return await apiClient.get('/api/v1/leaves/types');
    } catch (err) {
      if (err.status === 404) {
        return await apiClient.get('/api/leaves/types');
      }
      throw err;
    }
  },

  /**
   * Fetch leave balance summary for an employee
   * @param {string|number} employeeId
   */
  async getLeaveBalances(employeeId) {
    try {
      return await apiClient.get('/api/v1/leaves/balances', { params: { employeeId } });
    } catch (err) {
      if (err.status === 404) {
        return await apiClient.get('/api/leaves/balances', { params: { employeeId } });
      }
      throw err;
    }
  },

  /**
   * Submit new leave application
   * @param {Object} leaveData { leaveTypeId, startDate, endDate, reason, attachments }
   */
  async applyLeave(leaveData) {
    try {
      return await apiClient.post('/api/v1/leaves', leaveData);
    } catch (err) {
      if (err.status === 404) {
        return await apiClient.post('/api/leaves', leaveData);
      }
      throw err;
    }
  },

  /**
   * Approve leave application
   * @param {string|number} id
   */
  async approveLeave(id) {
    try {
      return await apiClient.post(`/api/v1/leaves/${id}/approve`);
    } catch (err) {
      if (err.status === 404) {
        return await apiClient.post(`/api/leaves/${id}/approve`);
      }
      throw err;
    }
  },

  /**
   * Reject leave application
   * @param {string|number} id
   * @param {string} reason
   */
  async rejectLeave(id, reason = '') {
    try {
      return await apiClient.post(`/api/v1/leaves/${id}/reject`, { reason });
    } catch (err) {
      if (err.status === 404) {
        return await apiClient.post(`/api/leaves/${id}/reject`, { reason });
      }
      throw err;
    }
  },

  /**
   * Cancel pending/approved leave application
   * @param {string|number} id
   */
  async cancelLeave(id) {
    try {
      return await apiClient.post(`/api/v1/leaves/${id}/cancel`);
    } catch (err) {
      if (err.status === 404) {
        return await apiClient.post(`/api/leaves/${id}/cancel`);
      }
      throw err;
    }
  },
};

export default leaveService;
