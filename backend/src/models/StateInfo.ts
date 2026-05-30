import mongoose, { Schema, Document } from 'mongoose';

export interface IStateInfo extends Document {
  name: string;
  code: string;
  capital?: string;
  region?: string;
}

const stateInfoSchema = new Schema<IStateInfo>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    code: { type: String, required: true, unique: true, trim: true },
    capital: { type: String, trim: true },
    region: { type: String, trim: true },
  },
  { timestamps: false }
);

stateInfoSchema.index({ code: 1 });
stateInfoSchema.index({ name: 1 });

export const StateInfo = mongoose.model<IStateInfo>('StateInfo', stateInfoSchema);
