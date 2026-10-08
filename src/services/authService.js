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

export const parseJwtPayload = (token) => {
  try {
    if (!token) return null;
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window.atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const parsed = JSON.parse(jsonPayload);
    const rawRole = parsed.roles?.[0] || parsed.role || 'ROLE_USER';
    const formattedRole = rawRole.replace('ROLE_', '').replace(/_/g, ' ');
    return {
      id: parsed.userId || parsed.id,
      email: parsed.sub || parsed.email,
      role: formattedRole,
      rawRole: rawRole,
      roles: parsed.roles || [rawRole],
      permissions: parsed.permissions || [],
    };
  } catch (e) {
    return null;
  }
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
    let user = response.user || response.data?.user || response.userInfo || null;

    if (token) {
      setAuthToken(token, credentials.rememberMe !== false);
      if (!user) {
        user = parseJwtPayload(token);
      }
      if (user) {
        setStoredUser(user, credentials.rememberMe !== false);
      }
    }
    return { ...response, user };
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
