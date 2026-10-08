import apiClient from './apiClient';

/**
 * Employee Management API Endpoints
 */
const employeeService = {
  /**
   * Fetch employees with optional query parameters (search, department, status, page, size)
   * @param {Object} params { search, department, designation, status, page, size }
   */
  async getAllEmployees(params = {}) {
    try {
      return await apiClient.get('/api/v1/employees', { params });
    } catch (err) {
      if (err.status === 404) {
        return await apiClient.get('/api/employees', { params });
      }
      throw err;
    }
  },

  /**
   * Fetch single employee details by ID
   * @param {string|number} id
   */
  async getEmployeeById(id) {
    try {
      return await apiClient.get(`/api/v1/employees/${id}`);
    } catch (err) {
      if (err.status === 404) {
        return await apiClient.get(`/api/employees/${id}`);
      }
      throw err;
    }
  },

  /**
   * Create a new employee record
   * @param {Object} employeeData
   */
  async createEmployee(employeeData) {
    try {
      return await apiClient.post('/api/v1/employees', employeeData);
    } catch (err) {
      if (err.status === 404) {
        return await apiClient.post('/api/employees', employeeData);
      }
      throw err;
    }
  },

  /**
   * Update employee details
   * @param {string|number} id
   * @param {Object} employeeData
   */
  async updateEmployee(id, employeeData) {
    try {
      return await apiClient.put(`/api/v1/employees/${id}`, employeeData);
    } catch (err) {
      if (err.status === 404) {
        return await apiClient.put(`/api/employees/${id}`, employeeData);
      }
      throw err;
    }
  },

  /**
   * Update employee status (e.g. ACTIVE, INACTIVE, TERMINATED)
   * @param {string|number} id
   * @param {string} status
   */
  async updateEmployeeStatus(id, status) {
    try {
      return await apiClient.patch(`/api/v1/employees/${id}/status`, { status });
    } catch (err) {
      if (err.status === 404) {
        return await apiClient.patch(`/api/employees/${id}/status`, { status });
      }
      throw err;
    }
  },

  /**
   * Delete employee record
   * @param {string|number} id
   */
  async deleteEmployee(id) {
    try {
      return await apiClient.delete(`/api/v1/employees/${id}`);
    } catch (err) {
      if (err.status === 404) {
        return await apiClient.delete(`/api/employees/${id}`);
      }
      throw err;
    }
  },
};

export default employeeService;
