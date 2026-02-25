import mongoose, { Schema, Document } from 'mongoose';

export interface ICoupon extends Document {
  code: string;
  name: string;
  description?: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrderAmount: number;
  maxDiscount?: number;
  startDate: Date;
  endDate: Date;
  usageLimit: number;
  usageCount: number;
  isActive: boolean;
  applicableStores?: mongoose.Types.ObjectId[];
  applicableCategories?: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const CouponSchema: Schema = new Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    index: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  type: {
    type: String,
    enum: ['percentage', 'fixed'],
    required: true
  },
  value: {
    type: Number,
    required: true,
    min: 0
  },
  minOrderAmount: {
    type: Number,
    default: 0
  },
  maxDiscount: {
    type: Number
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  usageLimit: {
    type: Number,
    default: 1
  },
  usageCount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  applicableStores: [{
    type: Schema.Types.ObjectId,
    ref: 'Store'
  }],
  applicableCategories: [{
    type: Schema.Types.ObjectId,
    ref: 'Category'
  }]
}, {
  timestamps: true
});

// 用户优惠券使用记录
export interface IUserCoupon extends Document {
  user: mongoose.Types.ObjectId;
  coupon: mongoose.Types.ObjectId;
  usedAt?: Date;
  order?: mongoose.Types.ObjectId;
  isUsed: boolean;
  createdAt: Date;
}

const UserCouponSchema: Schema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  coupon: {
    type: Schema.Types.ObjectId,
    ref: 'Coupon',
    required: true
  },
  usedAt: {
    type: Date
  },
  order: {
    type: Schema.Types.ObjectId,
    ref: 'Order'
  },
  isUsed: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

UserCouponSchema.index({ user: 1, coupon: 1 }, { unique: true });

export const Coupon = mongoose.model<ICoupon>('Coupon', CouponSchema);
export const UserCoupon = mongoose.model<IUserCoupon>('UserCoupon', UserCouponSchema);