import { Request } from 'express';

export interface AuthPayload {
  userId: string;
  role: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthPayload;
}

export interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
}

export interface CompanyQueryParams {
  state?: string;
  industry?: string;
  department?: string;
  city?: string;
  internshipType?: string;
  search?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  status?: string;
  verificationStatus?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
