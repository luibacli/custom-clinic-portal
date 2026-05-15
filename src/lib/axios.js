import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3001/api/v1",
});

api.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("tenantToken") ||
    localStorage.getItem("token") ||
    localStorage.getItem("devTenantToken") ||
    localStorage.getItem("devCareboardToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

const SUBSCRIPTION_CODES = new Set([
  'TRIAL_EXPIRED',
  'SUBSCRIPTION_PAST_DUE',
  'SUBSCRIPTION_SUSPENDED',
  'SUBSCRIPTION_CANCELLED',
]);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const code   = error.response?.data?.code;

    if (status === 402 && SUBSCRIPTION_CODES.has(code)) {
      // Avoid redirect loops if already on /billing
      if (!window.location.pathname.includes('/billing')) {
        window.location.href = `/billing?reason=${code}`;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
