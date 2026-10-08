import apiClient from './apiClient';

/**
 * Timesheet Management API Endpoints
 */
const timesheetService = {
  /**
   * Fetch timesheets list with optional filters
   * @param {Object} params { employeeId, status, startDate, endDate, page, size }
   */
  async getTimesheets(params = {}) {
    try {
      return await apiClient.get('/api/v1/timesheets', { params });
    } catch (err) {
      if (err.status === 404) {
        return await apiClient.get('/api/timesheets', { params });
      }
      throw err;
    }
  },

  /**
   * Fetch single timesheet by ID
   * @param {string|number} id
   */
  async getTimesheetById(id) {
    try {
      return await apiClient.get(`/api/v1/timesheets/${id}`);
    } catch (err) {
      if (err.status === 404) {
        return await apiClient.get(`/api/timesheets/${id}`);
      }
      throw err;
    }
  },

  /**
   * Create new timesheet entry
   * @param {Object} timesheetData
   */
  async createTimesheet(timesheetData) {
    try {
      return await apiClient.post('/api/v1/timesheets', timesheetData);
    } catch (err) {
      if (err.status === 404) {
        return await apiClient.post('/api/timesheets', timesheetData);
      }
      throw err;
    }
  },

  /**
   * Update existing timesheet
   * @param {string|number} id
   * @param {Object} timesheetData
   */
  async updateTimesheet(id, timesheetData) {
    try {
      return await apiClient.put(`/api/v1/timesheets/${id}`, timesheetData);
    } catch (err) {
      if (err.status === 404) {
        return await apiClient.put(`/api/timesheets/${id}`, timesheetData);
      }
      throw err;
    }
  },

  /**
   * Submit timesheet for approval
   * @param {string|number} id
   */
  async submitTimesheet(id) {
    try {
      return await apiClient.post(`/api/v1/timesheets/${id}/submit`);
    } catch (err) {
      if (err.status === 404) {
        return await apiClient.post(`/api/timesheets/${id}/submit`);
      }
      throw err;
    }
  },

  /**
   * Approve submitted timesheet
   * @param {string|number} id
   */
  async approveTimesheet(id) {
    try {
      return await apiClient.post(`/api/v1/timesheets/${id}/approve`);
    } catch (err) {
      if (err.status === 404) {
        return await apiClient.post(`/api/timesheets/${id}/approve`);
      }
      throw err;
    }
  },

  /**
   * Reject submitted timesheet
   * @param {string|number} id
   * @param {string} reason
   */
  async rejectTimesheet(id, reason = '') {
    try {
      return await apiClient.post(`/api/v1/timesheets/${id}/reject`, { reason });
    } catch (err) {
      if (err.status === 404) {
        return await apiClient.post(`/api/timesheets/${id}/reject`, { reason });
      }
      throw err;
    }
  },
};

export default timesheetService;
