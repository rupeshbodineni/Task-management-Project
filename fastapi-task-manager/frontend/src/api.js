import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.assign('/login');
    }
    return Promise.reject(error);
  }
);

const authApi = {
  register: async (name, email, password) => {
    const res = await api.post('/auth/register', { name, email, password });
    return res.data;
  },
  login: async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    return res.data;
  },
  getCurrentUser: async () => {
    const res = await api.get('/auth/me');
    return res.data;
  }
};

const tasksApi = {
  create: async (title, description, status = 'PENDING') => {
    const res = await api.post('/tasks/', { title, description, status });
    return res.data;
  },
  getAll: async (status = null) => {
    const params = status ? { status } : {};
    const res = await api.get('/tasks/', { params });
    return res.data;
  },
  getById: async id => {
    const res = await api.get(`/tasks/${id}`);
    return res.data;
  },
  update: async (id, data) => {
    const res = await api.put(`/tasks/${id}`, data);
    return res.data;
  },
  delete: async id => {
    const res = await api.delete(`/tasks/${id}`);
    return res.data;
  }
};

export { api, authApi, tasksApi };
