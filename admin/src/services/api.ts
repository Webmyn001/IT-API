import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '/api/v1';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export async function login(email: string, password: string) {
  const { data } = await api.post('/auth/login', { email, password });
  return data.data;
}

export async function getDashboardStats() {
  const { data } = await api.get('/admin/dashboard');
  return data.data;
}

export async function getCompanies(params: Record<string, any> = {}) {
  const { data } = await api.get('/companies', { params });
  return data;
}

export async function getCompany(id: string) {
  const { data } = await api.get(`/companies/${id}`);
  return data.data;
}

export async function createCompany(company: Record<string, any>) {
  const { data } = await api.post('/companies', company);
  return data.data;
}

export async function updateCompany(id: string, company: Record<string, any>) {
  const { data } = await api.put(`/companies/${id}`, company);
  return data.data;
}

export async function deleteCompany(id: string) {
  const { data } = await api.delete(`/companies/${id}`);
  return data;
}

export async function approveCompany(id: string, status: string) {
  const { data } = await api.patch(`/companies/${id}/approve`, { status });
  return data.data;
}

export async function bulkUpload(companies: Record<string, any>[]) {
  const { data } = await api.post('/companies/bulk', { companies });
  return data.data;
}

export async function getCollectionLogs() {
  const { data } = await api.get('/admin/logs');
  return data;
}

export async function getStates() {
  const { data } = await api.get('/admin/states');
  return data.data;
}

export async function triggerCollection(states?: string[]) {
  const { data } = await api.post('/admin/collector/trigger', states ? { states } : {});
  return data.data;
}

export async function getCollectorStatus() {
  const { data } = await api.get('/admin/collector/status');
  return data.data;
}

export default api;
