import axios from 'axios';
import { User } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

interface LoginResponse {
  user: User;
  token: string;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  profile: {
    firstName: string;
    lastName: string;
    grade?: string;
    subjects?: string[];
    targetTests?: string[];
  };
}

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await api.post('/auth/login', { email, password });
    return {
      user: response.data.user,
      token: response.data.token
    };
  },

  async register(userData: RegisterData): Promise<LoginResponse> {
    const response = await api.post('/auth/register', userData);
    return {
      user: response.data.user,
      token: response.data.token
    };
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get('/auth/me');
    return response.data.user;
  },

  async refreshToken(): Promise<LoginResponse> {
    const token = localStorage.getItem('token');
    const response = await api.post('/auth/refresh', { token });
    return {
      user: response.data.user,
      token: response.data.token
    };
  },

  async forgotPassword(email: string): Promise<void> {
    await api.post('/auth/forgot-password', { email });
  },

  async verifyEmail(token: string): Promise<void> {
    await api.post('/auth/verify-email', { token });
  },
};

export default api;
