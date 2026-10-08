import apiClient from './apiClient';

/**
 * Payroll & Salary API Endpoints
 */
const payrollService = {
  /**
   * Fetch payslips with filter options (month, year, employeeId)
   * @param {Object} params { month, year, employeeId, page, size }
   */
  async getPaySlips(params = {}) {
    try {
      return await apiClient.get('/api/v1/payroll/slips', { params });
    } catch (err) {
      if (err.status === 404) {
        return await apiClient.get('/api/payroll/slips', { params });
      }
      throw err;
    }
  },

  /**
   * Fetch single payslip details
   * @param {string|number} id
   */
  async getPaySlipById(id) {
    try {
      return await apiClient.get(`/api/v1/payroll/slips/${id}`);
    } catch (err) {
      if (err.status === 404) {
        return await apiClient.get(`/api/payroll/slips/${id}`);
      }
      throw err;
    }
  },

  /**
   * Trigger monthly payroll generation
   * @param {Object} data { month, year, departmentId }
   */
  async generatePayroll(data) {
    try {
      return await apiClient.post('/api/v1/payroll/generate', data);
    } catch (err) {
      if (err.status === 404) {
        return await apiClient.post('/api/payroll/generate', data);
      }
      throw err;
    }
  },

  /**
   * Fetch employee salary structure breakdown
   * @param {string|number} employeeId
   */
  async getSalaryStructure(employeeId) {
    try {
      return await apiClient.get(`/api/v1/payroll/structure/${employeeId}`);
    } catch (err) {
      if (err.status === 404) {
        return await apiClient.get(`/api/payroll/structure/${employeeId}`);
      }
      throw err;
    }
  },

  /**
   * Download payslip PDF blob
   * @param {string|number} id
   */
  async downloadPaySlipPdf(id) {
    try {
      return await apiClient.get(`/api/v1/payroll/slips/${id}/pdf`, { responseType: 'blob' });
    } catch (err) {
      if (err.status === 404) {
        return await apiClient.get(`/api/payroll/slips/${id}/pdf`, { responseType: 'blob' });
      }
      throw err;
    }
  },
};

export default payrollService;
