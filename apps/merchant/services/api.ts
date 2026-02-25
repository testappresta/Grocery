import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'https://your-api-domain.com/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  loginWithEmail: (email, password) => api.post('/auth/login-email', { email, password }),
  getProfile: () => api.get('/auth/me'),
};

export const storeAPI = {
  getStore: () => api.get('/stores/my-store'),
  updateStore: (data) => api.put('/stores/my-store', data),
};

export const productAPI = {
  getProducts: () => api.get('/products/my-products'),
  createProduct: (data) => api.post('/products', data),
  updateProduct: (id, data) => api.put(`/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/products/${id}`),
};

export const orderAPI = {
  getOrders: (params) => api.get('/orders/store-orders', { params }),
  updateOrderStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
};

export const statsAPI = {
  getDashboard: () => api.get('/stores/dashboard'),
  getEarnings: (params) => api.get('/stores/earnings', { params }),
};