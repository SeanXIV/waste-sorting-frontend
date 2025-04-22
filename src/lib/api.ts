import axios from 'axios';

const API_URL = 'https://waste-sorting-api.onrender.com/api';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication API calls
export const authAPI = {
  login: async (username: string, password: string) => {
    const response = await api.post('/auth/signin', { username, password });
    return response.data;
  },

  register: async (username: string, email: string, password: string) => {
    const response = await api.post('/auth/signup', {
      username,
      email,
      password,
      role: ['user']
    });
    return response.data;
  },
};

// Waste Categories API calls
export const wasteCategoriesAPI = {
  getAll: async () => {
    const response = await api.get('/waste-categories');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/waste-categories/${id}`);
    return response.data;
  },
};

// Disposal Guidelines API calls
export const disposalGuidelinesAPI = {
  getAll: async () => {
    const response = await api.get('/disposal-guidelines');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/disposal-guidelines/${id}`);
    return response.data;
  },
};

// Recycling Centers API calls
export const recyclingCentersAPI = {
  getAll: async () => {
    const response = await api.get('/recycling-centers');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/recycling-centers/${id}`);
    return response.data;
  },

  searchByWasteCategory: async (wasteCategoryId: string) => {
    const response = await api.get(`/recycling-centers/search/waste-category/${wasteCategoryId}`);
    return response.data;
  },
};

// Reports API calls
export const reportsAPI = {
  getComprehensive: async () => {
    const response = await api.get('/reports/comprehensive');
    return response.data;
  },

  getByCategory: async () => {
    const response = await api.get('/reports/by-category');
    return response.data;
  },

  getByLocation: async () => {
    const response = await api.get('/reports/by-location');
    return response.data;
  },

  getByStatus: async () => {
    const response = await api.get('/reports/by-status');
    return response.data;
  },

  getRecyclableVsNonRecyclable: async () => {
    const response = await api.get('/reports/recyclable-vs-non-recyclable');
    return response.data;
  },
};

export default api;
