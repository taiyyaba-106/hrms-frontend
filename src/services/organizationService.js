import apiClient from './apiClient';

/**
 * Organization Structure API Endpoints (Departments, Designations, Locations, Shifts)
 */
const organizationService = {
  // --- DEPARTMENTS ---
  async getDepartments() {
    try {
      return await apiClient.get('/api/v1/organization/departments');
    } catch (err) {
      if (err.status === 404) {
        return await apiClient.get('/api/organization/departments');
      }
      throw err;
    }
  },

  async createDepartment(data) {
    try {
      return await apiClient.post('/api/v1/organization/departments', data);
    } catch (err) {
      if (err.status === 404) {
        return await apiClient.post('/api/organization/departments', data);
      }
      throw err;
    }
  },

  async updateDepartment(id, data) {
    try {
      return await apiClient.put(`/api/v1/organization/departments/${id}`, data);
    } catch (err) {
      if (err.status === 404) {
        return await apiClient.put(`/api/organization/departments/${id}`, data);
      }
      throw err;
    }
  },

  // --- DESIGNATIONS ---
  async getDesignations() {
    try {
      return await apiClient.get('/api/v1/organization/designations');
    } catch (err) {
      if (err.status === 404) {
        return await apiClient.get('/api/organization/designations');
      }
      throw err;
    }
  },

  async createDesignation(data) {
    try {
      return await apiClient.post('/api/v1/organization/designations', data);
    } catch (err) {
      if (err.status === 404) {
        return await apiClient.post('/api/organization/designations', data);
      }
      throw err;
    }
  },

  async updateDesignation(id, data) {
    try {
      return await apiClient.put(`/api/v1/organization/designations/${id}`, data);
    } catch (err) {
      if (err.status === 404) {
        return await apiClient.put(`/api/organization/designations/${id}`, data);
      }
      throw err;
    }
  },

  // --- OFFICE LOCATIONS ---
  async getLocations() {
    try {
      return await apiClient.get('/api/v1/organization/locations');
    } catch (err) {
      if (err.status === 404) {
        return await apiClient.get('/api/organization/branches');
      }
      throw err;
    }
  },

  async createLocation(data) {
    try {
      return await apiClient.post('/api/v1/organization/locations', data);
    } catch (err) {
      if (err.status === 404) {
        return await apiClient.post('/api/organization/branches', data);
      }
      throw err;
    }
  },

  async updateLocation(id, data) {
    try {
      return await apiClient.put(`/api/v1/organization/locations/${id}`, data);
    } catch (err) {
      if (err.status === 404) {
        return await apiClient.put(`/api/organization/branches/${id}`, data);
      }
      throw err;
    }
  },

  // --- SHIFTS ---
  async getShifts() {
    try {
      return await apiClient.get('/api/v1/organization/shifts');
    } catch (err) {
      if (err.status === 404) {
        return await apiClient.get('/api/organization/shifts');
      }
      throw err;
    }
  },

  async createShift(data) {
    try {
      return await apiClient.post('/api/v1/organization/shifts', data);
    } catch (err) {
      if (err.status === 404) {
        return await apiClient.post('/api/organization/shifts', data);
      }
      throw err;
    }
  },

  async updateShift(id, data) {
    try {
      return await apiClient.put(`/api/v1/organization/shifts/${id}`, data);
    } catch (err) {
      if (err.status === 404) {
        return await apiClient.put(`/api/organization/shifts/${id}`, data);
      }
      throw err;
    }
  },
};

export default organizationService;
