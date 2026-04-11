import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = '/api/v1';
export const ACCESS_TOKEN_KEY = 'accessToken';
export const REFRESH_TOKEN_KEY = 'refreshToken';

// Define the shape of your custom config to include the _retry flag
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// -----------------------------------------------------------------
// REQUEST INTERCEPTOR (Attach Access Token)
// -----------------------------------------------------------------
apiClient.interceptors.request.use(
  (config) => {
    // Get the access token from local storage
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);

    // If it exists, attach it to the Authorization header
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// -----------------------------------------------------------------
// RESPONSE INTERCEPTOR (Handle 401 & Refresh Token)
// -----------------------------------------------------------------
apiClient.interceptors.response.use(
  (response) => {
    // Any status code within the range of 2xx causes this function to trigger
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    // If the error is 401 (Unauthorized) and we haven't already retried this exact request
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true; // Mark it so we don't get stuck in an infinite loop

      try {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // Make a request to backend to get a new access token.
        // NOTE: We use a raw 'axios.post' here, NOT 'apiClient', to avoid triggering interceptors again!
        const response = await axios.post(`${API_BASE_URL}/token/refresh/`, {
          refresh: refreshToken,
        });

        const newAccessToken = response.data.access;

        // Save the new access token
        localStorage.setItem(ACCESS_TOKEN_KEY, newAccessToken);

        // If the backend also returns a new refresh token, save that too
        if (response.data.refresh) {
          localStorage.setItem(REFRESH_TOKEN_KEY, response.data.refresh);
        }

        // Update the failed request's header with the new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // Retry the original request with the new token
        return apiClient(originalRequest);
      } catch (refreshError) {
        // If the refresh token is also expired or invalid, the user is truly logged out.
        // Clear everything out and redirect to login.
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);

        // Force a page reload to the login screen (clears all React state)
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // If it's not a 401, or the retry failed, pass the error along
    return Promise.reject(error);
  },
);
