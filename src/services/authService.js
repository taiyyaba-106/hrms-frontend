import apiClient, { setAuthToken, removeAuthToken } from './apiClient';

export const USER_KEY = 'hrms_user_info';

export const getStoredUser = () => {
  try {
    const userStr = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  } catch (e) {
    return null;
  }
};

export const setStoredUser = (user, rememberMe = true) => {
  if (!user) return;
  const str = JSON.stringify(user);
  if (rememberMe) {
    localStorage.setItem(USER_KEY, str);
  } else {
    sessionStorage.setItem(USER_KEY, str);
  }
};

export const removeStoredUser = () => {
  localStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(USER_KEY);
};

/**
 * Authentication Service API Endpoints
 */
const authService = {
  /**
   * User login with email and password
   * Endpoint: POST /api/v1/auth/login
   * @param {Object} credentials { email, password, rememberMe }
   */
  async login(credentials) {
    const response = await apiClient.post('/api/v1/auth/login', {
      email: credentials.email,
      password: credentials.password,
    });

    const token = response.accessToken || response.token || response.data?.accessToken || response.data?.token;
    const user = response.user || response.data?.user || response.userInfo || null;

    if (token) {
      setAuthToken(token, credentials.rememberMe !== false);
      if (user) {
        setStoredUser(user, credentials.rememberMe !== false);
      }
    }
    return response;
  },

  /**
   * User registration
   * @param {Object} userData
   */
  async register(userData) {
    return apiClient.post('/api/v1/auth/register', userData);
  },

  /**
   * Activate employee account
   * @param {Object} data { token, password }
   */
  async activateAccount(data) {
    return apiClient.post('/api/v1/auth/activate', data);
  },

  /**
   * Logout user and clear tokens
   */
  async logout() {
    try {
      await apiClient.post('/api/v1/auth/logout');
    } catch (err) {
      // Ignore logout API failures and clear client state anyway
    } finally {
      removeAuthToken();
      removeStoredUser();
    }
  },

  /**
   * Fetch current authenticated user info
   */
  async getCurrentUser() {
    return apiClient.get('/api/v1/auth/me');
  },

  /**
   * Refresh JWT token
   * @param {string} refreshToken
   */
  async refreshToken(refreshToken) {
    return apiClient.post('/api/v1/auth/refresh', { refreshToken });
  },
};

export default authService;
