import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const API_URL = 'https://waste-sorting-api.onrender.com/api';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Check if token is expired
const isTokenExpired = (token: string): boolean => {
  try {
    const decoded: any = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch {
    return true;
  }
};

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && !isTokenExpired(token)) {
      config.headers.Authorization = `Bearer ${token}`;
    } else if (token) {
      // Token exists but is expired
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login?expired=true';
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Only redirect if not already on login page
      if (!window.location.pathname.includes('/login')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login?expired=true';
      }
    }
    return Promise.reject(error);
  }
);

// Authentication API calls with better error handling
export const authAPI = {
  login: async (username: string, password: string) => {
    try {
      const response = await api.post('/auth/signin', { username, password });
      const { accessToken, ...userData } = response.data;
      
      // Verify token before storing
      if (accessToken && !isTokenExpired(accessToken)) {
        localStorage.setItem('token', accessToken);
        localStorage.setItem('user', JSON.stringify(userData));
        return response.data;
      } else {
        throw new Error('Invalid token received');
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error('Invalid credentials');
      }
      throw error;
    }
  },

  register: async (username: string, email: string, password: string) => {
    try {
      const response = await api.post('/auth/signup', {
        username,
        email,
        password,
        role: ['user']
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 409) {
        throw new Error('Username or email already exists');
      }
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

// Helper function to remove duplicates from any array of objects with id and name
const removeDuplicates = <T extends { id: string; name: string }>(items: T[]): T[] => {
  const seen = new Set();
  return items.filter(item => {
    // Create a unique identifier using both id and name
    const identifier = `${item.id}-${item.name.toLowerCase().trim()}`;
    
    if (seen.has(identifier)) {
      return false; // Skip duplicate
    }
    
    seen.add(identifier);
    return true; // Keep unique item
  });
};

// Rest of the API calls with caching and deduplication
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const getCachedData = async (key: string, fetchFn: () => Promise<any>) => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  const data = await fetchFn();
  cache.set(key, { data, timestamp: Date.now() });
  return data;
};

// Waste Categories API calls with caching and deduplication
export const wasteCategoriesAPI = {
  getAll: async () => {
    return getCachedData('waste-categories', async () => {
      const response = await api.get('/waste-categories');
      const data = response.data;
      
      // Remove duplicates before returning
      if (Array.isArray(data)) {
        const uniqueData = removeDuplicates(data);
        console.log(`API returned ${data.length} categories, filtered to ${uniqueData.length} unique categories`);
        return uniqueData;
      }
      
      return data;
    });
  },

  getById: async (id: string) => {
    return getCachedData(`waste-category-${id}`, async () => {
      const response = await api.get(`/waste-categories/${id}`);
      return response.data;
    });
  },
};

// Disposal Guidelines API calls
export const disposalGuidelinesAPI = {
  getAll: async () => {
    const response = await api.get('/disposal-guidelines');
    const data = response.data;
    
    // Remove duplicates if the data has id and title/name properties
    if (Array.isArray(data)) {
      const seen = new Set();
      return data.filter(item => {
        const identifier = `${item.id}-${(item.title || item.name || '').toLowerCase().trim()}`;
        if (seen.has(identifier)) {
          return false;
        }
        seen.add(identifier);
        return true;
      });
    }
    
    return data;
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
    const data = response.data;
    
    // Remove duplicates for recycling centers
    if (Array.isArray(data)) {
      return removeDuplicates(data);
    }
    
    return data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/recycling-centers/${id}`);
    return response.data;
  },

  searchByWasteCategory: async (wasteCategoryId: string) => {
    const response = await api.get(`/recycling-centers/search/waste-category/${wasteCategoryId}`);
    const data = response.data;
    
    // Remove duplicates for search results
    if (Array.isArray(data)) {
      return removeDuplicates(data);
    }
    
    return data;
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