import axios from 'axios';

// Obtain API Base URL from Vite Environment or fallback to relative path (leveraging Vite proxy in dev)
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

/**
 * Token Management Helpers
 */
export const TOKEN_KEY = 'hrms_auth_token';

export const getAuthToken = () => {
  return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
};

export const setAuthToken = (token, rememberMe = true) => {
  if (rememberMe) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    sessionStorage.setItem(TOKEN_KEY, token);
  }
};

export const removeAuthToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
};

/**
 * Centralized Axios Instance
 */
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 15000,
});

/**
 * Request Interceptor: Attach Bearer token dynamically if available
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Standardized Error Handling Helper
 */
export const handleApiError = (error) => {
  if (error.response) {
    const status = error.response.status;
    const data = error.response.data;

    let message = 'An unexpected error occurred. Please try again.';

    // Extract message if backend provides standard error response body
    if (data && typeof data === 'object') {
      message = data.message || data.error || data.detail || message;
    }

    switch (status) {
      case 400:
        return {
          status: 400,
          message: message || 'Bad Request: Please check your input parameters.',
          errors: data?.errors || null,
        };
      case 401:
        // Unauthorized: token might be expired or invalid
        removeAuthToken();
        return {
          status: 401,
          message: message || 'Session expired. Please sign in again.',
        };
      case 403:
        return {
          status: 403,
          message: message || 'Forbidden: You do not have permission to perform this action.',
        };
      case 404:
        return {
          status: 404,
          message: message || 'Resource not found.',
        };
      case 409:
        return {
          status: 409,
          message: message || 'Conflict: Record already exists or state conflicts with request.',
        };
      case 500:
      default:
        return {
          status: status || 500,
          message: (data && typeof data === 'object' && (data.message || data.error)) 
            ? (data.message || data.error) 
            : (status === 500 ? 'Server error occurred. Please contact support.' : message),
        };
    }
  } else if (error.request) {
    // Request sent but no response received (network failure or server down)
    return {
      status: 0,
      message: 'Unable to connect to the HRMS backend server. Please verify network connection.',
    };
  }

  return {
    status: -1,
    message: error.message || 'An unexpected client error occurred.',
  };
};

/**
 * Response Interceptor: Format errors consistently
 */
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const formattedError = handleApiError(error);
    return Promise.reject(formattedError);
  }
);

export default apiClient;
