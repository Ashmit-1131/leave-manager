// src/api/apiClient.js
import axios from 'axios';


// base_url from env or default
const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8082/api';

const instance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,

});

// attach token from localStorage to every request (if present)
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// response interceptor: if 401, clear stored auth (frontend should react)
instance.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response && err.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // optionally reload to force login or notify app (keep simple)
      // window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default instance;
