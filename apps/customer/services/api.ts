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
      // Token 过期，尝试刷新
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
            refreshToken,
          });
          const { accessToken, refreshToken: newRefreshToken } = response.data.data;
          
          await AsyncStorage.setItem('accessToken', accessToken);
          await AsyncStorage.setItem('refreshToken', newRefreshToken);
          
          // 重试原请求
          error.config.headers.Authorization = `Bearer ${accessToken}`;
          return axios(error.config);
        } catch (refreshError) {
          // 刷新失败，清除 token 并跳转到登录
          await AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
          // 这里可以触发导航到登录页面
        }
      }
    }
    return Promise.reject(error);
  }
);

// API 方法
export const authAPI = {
  sendCode: (phone: string) => api.post('/auth/send-code', { phone }),
  loginWithPhone: (phone: string, code: string) =>
    api.post('/auth/login-phone', { phone, code }),
  loginWithEmail: (email: string, password: string) =>
    api.post('/auth/login-email', { email, password }),
  register: (data: any) => api.post('/auth/register', data),
  getProfile: () => api.get('/auth/me'),
};

export const productAPI = {
  getProducts: (params?: any) => api.get('/products', { params }),
  getProduct: (id: string) => api.get(`/products/${id}`),
  searchProducts: (q: string) => api.get('/products/search', { params: { q } }),
  getFeatured: () => api.get('/products/featured'),
};

export const storeAPI = {
  getStores: (params?: any) => api.get('/stores', { params }),
  getStore: (id: string) => api.get(`/stores/${id}`),
  getStoreProducts: (id: string, params?: any) =>
    api.get(`/stores/${id}/products`, { params }),
  getNearby: (lat: number, lng: number) =>
    api.get('/stores/nearby', { params: { lat, lng } }),
};

export const cartAPI = {
  getCart: () => api.get('/cart'),
  addToCart: (productId: string, quantity: number) =>
    api.post('/cart/items', { productId, quantity }),
  updateItem: (productId: string, quantity: number) =>
    api.put(`/cart/items/${productId}`, { quantity }),
  removeItem: (productId: string) => api.delete(`/cart/items/${productId}`),
  clearCart: () => api.delete('/cart'),
};

export const orderAPI = {
  getOrders: (params?: any) => api.get('/orders', { params }),
  getOrder: (id: string) => api.get(`/orders/${id}`),
  createOrder: (data: any) => api.post('/orders', data),
  cancelOrder: (id: string) => api.put(`/orders/${id}/cancel`),
};