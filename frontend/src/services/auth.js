import api from './api';

export const authService = {
  async login(email, password) {
    const { data } = await api.post('/auth/login', { email, password });
    return data;
  },

  async register(email, password, name) {
    const { data } = await api.post('/auth/register', { email, password, name });
    return data;
  },

  async logout() {
    await api.post('/auth/logout');
  },

  async getCurrentUser() {
    const { data } = await api.get('/auth/me');
    return data;
  }
};