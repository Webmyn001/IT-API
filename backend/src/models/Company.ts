import mongoose, { Schema, Document } from 'mongoose';

export interface ICompany extends Document {
  name: string;
  slug: string;
  industry?: string;
  state: string;
  city?: string;
  address?: string;
  email?: string;
  website?: string;
  phone?: string;
  description?: string;
  departments: string[];
  internshipAvailable: boolean;
  internshipType?: string;
  latitude?: number;
  longitude?: number;
  socialMedia?: Record<string, string>;
  verificationStatus: 'UNVERIFIED' | 'VERIFIED' | 'PENDING_REVIEW' | 'FLAGGED';
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'ARCHIVED';
  source: 'AI_CRAWL' | 'MANUAL' | 'BULK_UPLOAD' | 'USER_SUBMISSION' | 'API_IMPORT';
  sourceUrl?: string;
  collectedBy?: string;
  collectedAt: Date;
  updatedAt: Date;
  approvedById?: string;
  approvedAt?: Date;
}

const companySchema = new Schema<ICompany>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    industry: { type: String, trim: true },
    state: { type: String, required: true, trim: true },
    city: { type: String, trim: true },
    address: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    website: { type: String, trim: true },
    phone: { type: String, trim: true },
    description: { type: String },
    departments: [{ type: String }],
    internshipAvailable: { type: Boolean, default: false },
    internshipType: { type: String },
    latitude: { type: Number },
    longitude: { type: Number },
    socialMedia: { type: Schema.Types.Mixed },
    verificationStatus: {
      type: String,
      enum: ['UNVERIFIED', 'VERIFIED', 'PENDING_REVIEW', 'FLAGGED'],
      default: 'UNVERIFIED',
    },
    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED', 'ARCHIVED'],
      default: 'PENDING',
    },
    source: {
      type: String,
      enum: ['AI_CRAWL', 'MANUAL', 'BULK_UPLOAD', 'USER_SUBMISSION', 'API_IMPORT'],
      default: 'MANUAL',
    },
    sourceUrl: { type: String },
    collectedBy: { type: String },
    collectedAt: { type: Date, default: Date.now },
    approvedById: { type: String },
    approvedAt: { type: Date },
  },
  { timestamps: true }
);

companySchema.index({ state: 1 });
companySchema.index({ industry: 1 });
companySchema.index({ status: 1 });
companySchema.index({ verificationStatus: 1 });
companySchema.index({ slug: 1 });
companySchema.index({ name: 'text', description: 'text', industry: 'text', city: 'text' });

export const Company = mongoose.model<ICompany>('Company', companySchema);
