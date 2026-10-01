import axios from 'axios';
import toast from 'react-hot-toast';

const isBrowser = typeof window !== 'undefined';
const isLocalhost = isBrowser && (
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1' ||
  window.location.hostname === '0.0.0.0'
);

const cleanEnvUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/+$/, '') : '';
// On any remote host (e.g. sadgurucarsurat.com or vercel.app), always use relative '/api/'.
const fallbackURL = (isBrowser && !isLocalhost) || import.meta.env.PROD ? '/api/' : 'http://localhost:5000/api/';
const finalBaseURL = cleanEnvUrl 
  ? (cleanEnvUrl.endsWith('/api') ? `${cleanEnvUrl}/` : `${cleanEnvUrl}/api/`)
  : fallbackURL;

const axiosInstance = axios.create({
  baseURL: finalBaseURL,
  withCredentials: true, // Absolutely required to automatically attach/send HttpOnly cookies to the backend
});

// 1. Dynamic Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Strip leading slash from url to prevent Axios/URL parser from wiping out the '/api' base path!
    if (config.url && config.url.startsWith('/')) {
      config.url = config.url.substring(1);
    }
    // Automatically attach Bearer token from localStorage (resilient against browser cookie blocking)
    try {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {}
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 2. Exponential Backoff Retry & Auto-Logout Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;

    // A. Robust Exponential Backoff Retry for network drops or Service Worker lifecycle interruptions
    if (config) {
      const isNetworkError = !error.response || error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED';
      const isServerTransient = error.response && [502, 503, 504].includes(error.response.status);

      if (isNetworkError || isServerTransient) {
        config.__retryCount = config.__retryCount || 0;
        const MAX_RETRIES = 2;

        if (config.__retryCount < MAX_RETRIES) {
          config.__retryCount += 1;
          const delayMs = Math.pow(2, config.__retryCount - 1) * 350;
          await new Promise((resolve) => setTimeout(resolve, delayMs));
          return axiosInstance(config);
        }
      }
    }

    // B. Auto-Logout on 401 Unauthorized
    if (error.response && error.response.status === 401) {
      const isLoginRequest = error.config?.url?.includes('auth/login');
      const isMeRequest = error.config?.url?.includes('auth/me');
      if (!isLoginRequest && !isMeRequest) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) {
          window.location.href = '/login';
        }
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
