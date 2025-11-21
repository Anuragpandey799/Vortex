import axios from 'axios';

const BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

const api = axios.create({ baseURL: BASE });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
