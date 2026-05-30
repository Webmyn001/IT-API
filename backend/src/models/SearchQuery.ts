import mongoose, { Schema, Document } from 'mongoose';

export interface ISearchQuery extends Document {
  query: string;
  state?: string;
  industry?: string;
  department?: string;
  results: number;
  createdAt: Date;
}

const searchQuerySchema = new Schema<ISearchQuery>(
  {
    query: { type: String, required: true },
    state: { type: String },
    industry: { type: String },
    department: { type: String },
    results: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

export const SearchQuery = mongoose.model<ISearchQuery>('SearchQuery', searchQuerySchema);
