import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (email: string, password: string) => api.post('/api/auth/login', { email, password }),
  register: (data: { full_name: string; email: string; password: string }) => api.post('/api/auth/register', data),
  getMe: () => api.get('/api/auth/me'),
  updateProfile: (data: any) => api.put('/api/auth/profile', data),
  changePassword: (data: any) => api.post('/api/auth/change-password', data),
};

export const analysisAPI = {
  upload: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/api/analyze/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  run: (analysisId: string) => api.post(`/api/analyze/${analysisId}/run`),
  get: (analysisId: string) => api.get(`/api/analyze/${analysisId}`),
  list: (params?: any) => api.get('/api/analyze/', { params }),
  getStats: () => api.get('/api/analyze/stats/overview'),
};

export const evidenceAPI = {
  list: () => api.get('/api/evidence/'),
  get: (id: string) => api.get(`/api/evidence/${id}`),
};

export const reportsAPI = {
  get: (analysisId: string) => api.get(`/api/reports/${analysisId}`),
  list: () => api.get('/api/reports/'),
};

export const threatAPI = {
  getIntelligence: () => api.get('/api/threat-intelligence/'),
};

export const adminAPI = {
  getDashboard: () => api.get('/api/admin/dashboard'),
  getUsers: () => api.get('/api/admin/users'),
};

export const settingsAPI = {
  getProfile: () => api.get('/api/settings/profile'),
  getApiKeys: () => api.get('/api/settings/api-keys'),
  generateApiKey: () => api.post('/api/settings/api-keys/generate'),
};

export default api;
