import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  nameEn?: string;
  icon?: string;
  image?: string;
  description?: string;
  parent?: mongoose.Types.ObjectId;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  nameEn: { type: String },
  icon: { type: String },
  image: { type: String },
  description: { type: String },
  parent: { 
    type: Schema.Types.ObjectId, 
    ref: 'Category',
    default: null
  },
  sortOrder: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

CategorySchema.index({ parent: 1, isActive: 1 });
CategorySchema.index({ sortOrder: 1 });

export default mongoose.model<ICategory>('Category', CategorySchema);