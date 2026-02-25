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

// 请求拦截器 - 添加 token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器 - 处理错误
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
            refreshToken,
          });
          const { accessToken, refreshToken: newRefreshToken } = response.data.data;
          
          await AsyncStorage.setItem('accessToken', accessToken);
          await AsyncStorage.setItem('refreshToken', newRefreshToken);
          
          error.config.headers.Authorization = `Bearer ${accessToken}`;
          return axios(error.config);
        } catch (refreshError) {
          await AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
        }
      }
    }
    return Promise.reject(error);
  }
);

// API 方法
export const authAPI = {
  sendCode: (phone) => api.post('/auth/send-code', { phone }),
  loginWithPhone: (phone, code) => api.post('/auth/login-phone', { phone, code }),
  loginWithEmail: (email, password) => api.post('/auth/login-email', { email, password }),
  register: (data) => api.post('/auth/register', data),
  getProfile: () => api.get('/auth/me'),
};

export const productAPI = {
  getProducts: (params) => api.get('/products', { params }),
  getProduct: (id) => api.get(`/products/${id}`),
  searchProducts: (q) => api.get('/products/search', { params: { q } }),
  getFeatured: () => api.get('/products/featured'),
};

export const storeAPI = {
  getStores: (params) => api.get('/stores', { params }),
  getStore: (id) => api.get(`/stores/${id}`),
  getStoreProducts: (id, params) => api.get(`/stores/${id}/products`, { params }),
  getNearby: (lat, lng) => api.get('/stores/nearby', { params: { lat, lng } }),
};

export const cartAPI = {
  getCart: () => api.get('/cart'),
  addToCart: (productId, quantity) => api.post('/cart/items', { productId, quantity }),
  updateItem: (productId, quantity) => api.put(`/cart/items/${productId}`, { quantity }),
  removeItem: (productId) => api.delete(`/cart/items/${productId}`),
  clearCart: () => api.delete('/cart'),
};

export const orderAPI = {
  getOrders: (params) => api.get('/orders', { params }),
  getOrder: (id) => api.get(`/orders/${id}`),
  createOrder: (data) => api.post('/orders', data),
  cancelOrder: (id) => api.put(`/orders/${id}/cancel`),
};

export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  getAddresses: () => api.get('/users/addresses'),
  addAddress: (data) => api.post('/users/addresses', data),
  updateAddress: (id, data) => api.put(`/users/addresses/${id}`, data),
  deleteAddress: (id) => api.delete(`/users/addresses/${id}`),
};

export const driverAPI = {
  getAvailableOrders: () => api.get('/drivers/orders'),
  acceptOrder: (id) => api.post(`/drivers/orders/${id}/accept`),
  updateLocation: (id, lat, lng) => api.put(`/drivers/orders/${id}/location`, { lat, lng }),
  updateStatus: (id, status) => api.put(`/drivers/orders/${id}/status`, { status }),
  getEarnings: (params) => api.get('/drivers/earnings', { params }),
};