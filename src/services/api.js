import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const auth = {
  register: async (userData) => {
    const response = await api.post('/users/register', userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/users/login', credentials);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  updateProfile: async (userData) => {
    const response = await api.patch('/users/profile', userData);
    return response.data;
  },
};

export const groups = {
  create: async (groupData) => {
    const response = await api.post('/groups', groupData);
    return response.data;
  },

  getAll: async () => {
    const response = await api.get('/groups');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/groups/${id}`);
    return response.data;
  },

  addMember: async (groupId, memberData) => {
    const response = await api.post(`/groups/${groupId}/members`, memberData);
    return response.data;
  },
};

export const expenses = {
  create: async (groupId, expenseData) => {
    const response = await api.post(`/groups/${groupId}/expenses`, expenseData);
    return response.data;
  },

  getByGroup: async (groupId) => {
    const response = await api.get(`/groups/${groupId}/expenses`);
    return response.data;
  },
};

export const friends = {
  getAll: async () => {
    const response = await api.get('/friends');
    return response.data;
  },

  add: async (friendData) => {
    const response = await api.post('/friends', friendData);
    return response.data;
  },

  invite: async (email) => {
    const response = await api.post('/friends/invite', { email });
    return response.data;
  }
};

export const activities = {
  getAll: async () => {
    const response = await api.get('/activities');
    return response.data;
  }
};

export default api; 