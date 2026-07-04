import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const AUTH_FREE_PATHS = ['/auth/login', '/auth/register', '/auth/refresh'];

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true, // sends the httpOnly refresh-token cookie
});

axiosInstance.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

let refreshPromise = null;

async function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = axiosInstance
      .post('/auth/refresh')
      .then((response) => {
        const { accessToken, user } = response.data;
        useAuthStore.getState().setAuth(accessToken, user);
        return accessToken;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;
    const isAuthFreePath = config && AUTH_FREE_PATHS.some((path) => config.url?.includes(path));

    if (response?.status === 401 && !isAuthFreePath && !config._retried) {
      config._retried = true;
      try {
        await refreshAccessToken();
        return axiosInstance(config);
      } catch (refreshError) {
        useAuthStore.getState().clear();
        window.location.assign('/signin');
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
