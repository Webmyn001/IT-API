import { z } from 'zod';

export const createCompanySchema = z.object({
  body: z.object({
    name: z.string().min(2).max(255),
    industry: z.string().optional(),
    state: z.string().min(2).max(100),
    city: z.string().optional(),
    address: z.string().optional(),
    email: z.string().email().optional().or(z.literal('')),
    website: z.string().url().optional().or(z.literal('')),
    phone: z.string().optional(),
    description: z.string().optional(),
    departments: z.array(z.string()).optional(),
    internshipAvailable: z.boolean().optional(),
    internshipType: z.string().optional(),
    latitude: z.number().min(-90).max(90).optional(),
    longitude: z.number().min(-180).max(180).optional(),
    socialMedia: z.record(z.string()).optional(),
  }),
});

export const updateCompanySchema = z.object({
  body: z.object({
    name: z.string().min(2).max(255).optional(),
    industry: z.string().optional(),
    state: z.string().min(2).max(100).optional(),
    city: z.string().optional(),
    address: z.string().optional(),
    email: z.string().email().optional().or(z.literal('')),
    website: z.string().url().optional().or(z.literal('')),
    phone: z.string().optional(),
    description: z.string().optional(),
    departments: z.array(z.string()).optional(),
    internshipAvailable: z.boolean().optional(),
    internshipType: z.string().optional(),
    latitude: z.number().min(-90).max(90).optional(),
    longitude: z.number().min(-180).max(180).optional(),
    socialMedia: z.record(z.string()).optional(),
    status: z.enum(['PENDING', 'APPROVED', 'REJECTED', 'ARCHIVED']).optional(),
    verificationStatus: z.enum(['UNVERIFIED', 'VERIFIED', 'PENDING_REVIEW', 'FLAGGED']).optional(),
  }),
});

export const companyQuerySchema = z.object({
  query: z.object({
    state: z.string().optional(),
    industry: z.string().optional(),
    department: z.string().optional(),
    city: z.string().optional(),
    internshipType: z.string().optional(),
    search: z.string().optional(),
    page: z.string().optional(),
    limit: z.string().optional(),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
    status: z.string().optional(),
    verificationStatus: z.string().optional(),
  }),
});
