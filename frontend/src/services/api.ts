import axios from 'axios';

const API_BASE = '/api/v1';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

export interface Company {
  id: string;
  name: string;
  slug: string;
  industry: string | null;
  state: string;
  city: string | null;
  address: string | null;
  email: string | null;
  website: string | null;
  phone: string | null;
  description: string | null;
  departments: string[];
  internshipAvailable: boolean;
  internshipType: string | null;
  verificationStatus: string;
  status: string;
  collectedAt: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface SearchParams {
  search?: string;
  state?: string;
  industry?: string;
  department?: string;
  city?: string;
  internshipType?: string;
  page?: number;
  limit?: number;
}

export async function searchCompanies(params: SearchParams): Promise<PaginatedResponse<Company>> {
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([_, v]) => v !== undefined && v !== '')
  );
  const { data } = await api.get('/companies', { params: cleanParams });
  return data;
}

export async function getCompany(slug: string): Promise<Company> {
  const { data } = await api.get(`/companies/${slug}`);
  return data.data;
}

export async function getStates(): Promise<{ name: string; code: string }[]> {
  const { data } = await api.get('/companies');
  return data.data;
}

export default api;
