import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

export const getRootNodes = () => api.get('/nodes');
export const getChildren = (parentId) => api.get(`/nodes/${parentId}/children`);
export const createNode = (data) => api.post('/nodes', data);
export const deleteNode = (id) => api.delete(`/nodes/${id}`);
