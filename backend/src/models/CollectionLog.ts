import mongoose, { Schema, Document } from 'mongoose';

export interface ICollectionLog extends Document {
  source: 'AI_CRAWL' | 'MANUAL' | 'BULK_UPLOAD' | 'USER_SUBMISSION' | 'API_IMPORT';
  status: string;
  message?: string;
  companiesAdded: number;
  companiesUpdated: number;
  duplicatesFound: number;
  errors: number;
  startedAt: Date;
  completedAt?: Date;
  duration?: number;
  metadata?: Record<string, any>;
}

const collectionLogSchema = new Schema<ICollectionLog>(
  {
    source: {
      type: String,
      enum: ['AI_CRAWL', 'MANUAL', 'BULK_UPLOAD', 'USER_SUBMISSION', 'API_IMPORT'],
      required: true,
    },
    status: { type: String, required: true },
    message: { type: String },
    companiesAdded: { type: Number, default: 0 },
    companiesUpdated: { type: Number, default: 0 },
    duplicatesFound: { type: Number, default: 0 },
    errors: { type: Number, default: 0 },
    startedAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
    duration: { type: Number },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: false }
);

export const CollectionLog = mongoose.model<ICollectionLog>('CollectionLog', collectionLogSchema);
