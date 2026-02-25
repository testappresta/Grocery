import mongoose, { Schema, Document } from 'mongoose';

export interface IStore extends Document {
  owner: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  logo?: string;
  coverImage?: string;
  phone: string;
  email?: string;
  address: string;
  lat: number;
  lng: number;
  businessHours: IBusinessHours;
  categories: string[];
  rating: number;
  reviewCount: number;
  deliveryFee: number;
  minOrderAmount: number;
  deliveryTime: string;
  status: 'active' | 'inactive' | 'closed';
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IBusinessHours {
  monday: IHours;
  tuesday: IHours;
  wednesday: IHours;
  thursday: IHours;
  friday: IHours;
  saturday: IHours;
  sunday: IHours;
}

export interface IHours {
  open: string;
  close: string;
  isOpen: boolean;
}

const HoursSchema: Schema = new Schema({
  open: { type: String, default: '09:00' },
  close: { type: String, default: '22:00' },
  isOpen: { type: Boolean, default: true }
});

const BusinessHoursSchema: Schema = new Schema({
  monday: { type: HoursSchema, default: () => ({}) },
  tuesday: { type: HoursSchema, default: () => ({}) },
  wednesday: { type: HoursSchema, default: () => ({}) },
  thursday: { type: HoursSchema, default: () => ({}) },
  friday: { type: HoursSchema, default: () => ({}) },
  saturday: { type: HoursSchema, default: () => ({}) },
  sunday: { type: HoursSchema, default: () => ({}) }
});

const StoreSchema: Schema = new Schema({
  owner: { 
    type: Schema.Types.ObjectId, 
    ref: 'User',
    required: true,
    index: true
  },
  name: { type: String, required: true },
  description: { type: String },
  logo: { type: String },
  coverImage: { type: String },
  phone: { type: String, required: true },
  email: { type: String },
  address: { type: String, required: true },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  businessHours: { type: BusinessHoursSchema, default: () => ({}) },
  categories: [{ type: String }],
  rating: { type: Number, default: 5.0, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0 },
  deliveryFee: { type: Number, default: 0 },
  minOrderAmount: { type: Number, default: 0 },
  deliveryTime: { type: String, default: '30-45 min' },
  status: { 
    type: String, 
    enum: ['active', 'inactive', 'closed'],
    default: 'active'
  },
  isVerified: { type: Boolean, default: false }
}, {
  timestamps: true
});

// 地理位置索引
StoreSchema.index({ lat: 1, lng: 1 });
StoreSchema.index({ status: 1, isVerified: 1 });

export default mongoose.model<IStore>('Store', StoreSchema);