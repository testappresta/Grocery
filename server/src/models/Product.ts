import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  store: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  images: string[];
  category: mongoose.Types.ObjectId;
  price: number;
  originalPrice?: number;
  unit: string;
  stock: number;
  soldCount: number;
  isAvailable: boolean;
  isFeatured: boolean;
  tags: string[];
  attributes: IAttribute[];
  rating: number;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAttribute {
  name: string;
  value: string;
}

const AttributeSchema: Schema = new Schema({
  name: { type: String, required: true },
  value: { type: String, required: true }
});

const ProductSchema: Schema = new Schema({
  store: { 
    type: Schema.Types.ObjectId, 
    ref: 'Store',
    required: true,
    index: true
  },
  name: { type: String, required: true, index: true },
  description: { type: String },
  images: [{ type: String }],
  category: { 
    type: Schema.Types.ObjectId, 
    ref: 'Category',
    required: true,
    index: true
  },
  price: { 
    type: Number, 
    required: true,
    min: 0 
  },
  originalPrice: { 
    type: Number,
    min: 0 
  },
  unit: { type: String, required: true }, // 如：斤、个、盒
  stock: { 
    type: Number, 
    default: 0,
    min: 0 
  },
  soldCount: { type: Number, default: 0 },
  isAvailable: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  tags: [{ type: String }],
  attributes: [AttributeSchema],
  rating: { type: Number, default: 5.0, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0 }
}, {
  timestamps: true
});

// 复合索引
ProductSchema.index({ store: 1, category: 1 });
ProductSchema.index({ isAvailable: 1, isFeatured: 1 });
ProductSchema.index({ name: 'text', description: 'text' });

export default mongoose.model<IProduct>('Product', ProductSchema);