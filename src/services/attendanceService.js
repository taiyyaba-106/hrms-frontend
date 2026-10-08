import apiClient from './apiClient';

/**
 * Attendance Management API Endpoints
 */
const attendanceService = {
  /**
   * Clock in employee attendance
   * @param {Object} data { employeeId, timestamp, location, notes }
   */
  async clockIn(data = {}) {
    try {
      return await apiClient.post('/api/v1/attendance/clock-in', data);
    } catch (err) {
      if (err.status === 404) {
        return await apiClient.post('/api/attendance/clock-in', data);
      }
      throw err;
    }
  },

  /**
   * Clock out employee attendance
   * @param {Object} data { employeeId, timestamp, location, notes }
   */
  async clockOut(data = {}) {
    try {
      return await apiClient.post('/api/v1/attendance/clock-out', data);
    } catch (err) {
      if (err.status === 404) {
        return await apiClient.post('/api/attendance/clock-out', data);
      }
      throw err;
    }
  },

  /**
   * Fetch attendance logs with date range and department filters
   * @param {Object} params { startDate, endDate, departmentId, employeeId, page, size }
   */
  async getAttendanceLogs(params = {}) {
    try {
      return await apiClient.get('/api/v1/attendance/logs', { params });
    } catch (err) {
      if (err.status === 404) {
        return await apiClient.get('/api/attendance/logs', { params });
      }
      throw err;
    }
  },

  /**
   * Fetch daily attendance summary report
   * @param {string} date YYYY-MM-DD
   */
  async getDailySummary(date) {
    try {
      return await apiClient.get('/api/v1/attendance/daily-summary', { params: { date } });
    } catch (err) {
      if (err.status === 404) {
        return await apiClient.get('/api/attendance/daily-summary', { params: { date } });
      }
      throw err;
    }
  },

  /**
   * Fetch attendance history for a specific employee
   * @param {string|number} employeeId
   * @param {Object} params { month, year }
   */
  async getEmployeeAttendance(employeeId, params = {}) {
    try {
      return await apiClient.get(`/api/v1/attendance/employee/${employeeId}`, { params });
    } catch (err) {
      if (err.status === 404) {
        return await apiClient.get(`/api/attendance/employee/${employeeId}`, { params });
      }
      throw err;
    }
  },
};

export default attendanceService;
