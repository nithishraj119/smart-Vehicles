import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach JWT token from localStorage to every outgoing request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('smart_commute_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for consistent error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message || error.message || 'An unexpected error occurred.';
    return Promise.reject(new Error(message));
  }
);

// Authentication Services
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
  logout: () => {
    localStorage.removeItem('smart_commute_token');
    localStorage.removeItem('smart_commute_user');
  },
  getCurrentUser: () => {
    try {
      const u = localStorage.getItem('smart_commute_user');
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  }
};

// Route Analysis Services
export const routeService = {
  analyzeRoute: (coordinates) => api.post('/routes/analyze', coordinates),
  getHistory: () => api.get('/routes/history'),
  getRouteById: (id) => api.get(`/routes/${id}`)
};

// Traffic Monitoring Services
export const trafficService = {
  getAll: () => api.get('/traffic'),
  getNearby: (lat, lng, radius = 10) =>
    api.get(`/traffic/nearby?lat=${lat}&lng=${lng}&radius=${radius}`),
  createRecord: (data) => api.post('/traffic', data)
};

// Hazard Management Services
export const hazardService = {
  getAll: () => api.get('/hazards'),
  getNearby: (lat, lng, radius = 10) =>
    api.get(`/hazards/nearby?lat=${lat}&lng=${lng}&radius=${radius}`),
  create: (data) => api.post('/hazards', data),
  update: (id, data) => api.put(`/hazards/${id}`, data),
  delete: (id) => api.delete(`/hazards/${id}`)
};

// Weather Services
export const weatherService = {
  getWeather: (location) =>
    api.get(location ? `/weather?location=${encodeURIComponent(location)}` : '/weather'),
  updateWeather: (data) => api.post('/weather', data)
};

// Emergency Services
export const emergencyService = {
  reportEmergency: (data) => api.post('/emergency', data),
  getAll: () => api.get('/emergency'),
  updateStatus: (id, status) => api.put(`/emergency/${id}`, { status })
};

// Admin Services
export const adminService = {
  getUsers: () => api.get('/admin/users'),
  getStatistics: () => api.get('/admin/statistics'),
  getReports: () => api.get('/admin/reports')
};

// IoT Intelligent Device Services
export const iotService = {
  sendSensorData: (data) => api.post('/iot/sensor-data', data),
  getSensorData: () => api.get('/iot/sensor-data')
};

export default api;
