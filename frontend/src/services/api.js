import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Add a request interceptor to include the JWT token in headers
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = (credentials) => API.post('/auth/login', credentials);
export const register = (credentials) => API.post('/auth/register', credentials);
export const addAgent = (agentData) => API.post('/agents', agentData);
export const updateAgent = (id, agentData) => API.put(`/agents/${id}`, agentData);
export const getAgents = () => API.get('/agents');
export const deleteAgent = (id) => API.delete(`/agents/${id}`);

export const uploadFile = (formData) => API.post('/tasks/upload', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const getDistributedTasks = () => API.get('/tasks/distributed');
export const deleteAllTasks = () => API.delete('/tasks/delete-all');

export const uploadCallFile = (formData) => API.post('/calls/upload', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const getDistributedCalls = () => API.get('/calls/distributed');
export const updateCallStatus = (id, status) => API.put(`/calls/${id}/status`, { status });
export const deleteAllCalls = () => API.delete('/calls/delete-all');

export default API;
