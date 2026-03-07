import mongoose, { Schema, Document } from 'mongoose';

// 作物类型
export const CROP_TYPES = ['tomato', 'apple', 'carrot', 'lettuce', 'strawberry', 'watermelon'] as const;
export type CropType = typeof CROP_TYPES[number];

// 作物生长时间（秒）
export const GROWTH_TIMES: Record<CropType, number> = {
  tomato: 60,
  apple: 120,
  carrot: 45,
  lettuce: 30,
  strawberry: 90,
  watermelon: 180
};

// 作物收获积分
export const HARVEST_POINTS: Record<CropType, number> = {
  tomato: 10,
  apple: 20,
  carrot: 8,
  lettuce: 5,
  strawberry: 15,
  watermelon: 30
};

// 地块接口
export interface IPlot {
  index: number;
  crop: CropType | null;
  plantedAt: Date | null;
  growthTime: number;
  isReady: boolean;
  isEmpty: boolean;
}

// 种子库存接口
export interface ISeeds {
  tomato: number;
  apple: number;
  carrot: number;
  lettuce: number;
  strawberry: number;
  watermelon: number;
}

// 农场接口
export interface IFarm extends Document {
  user: mongoose.Types.ObjectId;
  points: number;
  totalPointsEarned: number;
  seeds: ISeeds;
  plots: IPlot[];
  dailyCheckIn: Date | null;
  checkInStreak: number;
  createdAt: Date;
  updatedAt: Date;
}

const PlotSchema: Schema = new Schema({
  index: { type: Number, required: true },
  crop: {
    type: String,
    enum: [...CROP_TYPES, null],
    default: null
  },
  plantedAt: { type: Date, default: null },
  growthTime: { type: Number, default: 0 },
  isReady: { type: Boolean, default: false },
  isEmpty: { type: Boolean, default: true }
}, { _id: false });

const FarmSchema: Schema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true
  },
  points: { type: Number, default: 0 },
  totalPointsEarned: { type: Number, default: 0 },
  seeds: {
    tomato: { type: Number, default: 3 },
    apple: { type: Number, default: 3 },
    carrot: { type: Number, default: 3 },
    lettuce: { type: Number, default: 3 },
    strawberry: { type: Number, default: 3 },
    watermelon: { type: Number, default: 3 }
  },
  plots: {
    type: [PlotSchema],
    default: () => Array.from({ length: 6 }, (_, i) => ({
      index: i,
      crop: null,
      plantedAt: null,
      growthTime: 0,
      isReady: false,
      isEmpty: true
    }))
  },
  dailyCheckIn: { type: Date, default: null },
  checkInStreak: { type: Number, default: 0 }
}, {
  timestamps: true
});

export const Farm = mongoose.model<IFarm>('Farm', FarmSchema);

// 奖励接口
export interface IReward extends Document {
  name: string;
  description: string;
  type: 'coupon' | 'freeDelivery' | 'discount';
  value: number;
  pointsCost: number;
  icon: string;
  stock: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const RewardSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  type: {
    type: String,
    enum: ['coupon', 'freeDelivery', 'discount'],
    required: true
  },
  value: { type: Number, required: true },
  pointsCost: { type: Number, required: true },
  icon: { type: String, default: '🎁' },
  stock: { type: Number, default: 999 },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

export const Reward = mongoose.model<IReward>('Reward', RewardSchema);

// 兑换记录接口
export interface IRedemption extends Document {
  user: mongoose.Types.ObjectId;
  reward: {
    name: string;
    description: string;
    type: string;
    value: number;
    pointsCost: number;
    icon: string;
  };
  pointsSpent: number;
  redeemedAt: Date;
}

const RedemptionSchema: Schema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  reward: {
    name: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, required: true },
    value: { type: Number, required: true },
    pointsCost: { type: Number, required: true },
    icon: { type: String, default: '🎁' }
  },
  pointsSpent: { type: Number, required: true },
  redeemedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

export const Redemption = mongoose.model<IRedemption>('Redemption', RedemptionSchema);

// 默认奖励数据
export const DEFAULT_REWARDS = [
  {
    name: '满10减5优惠券',
    description: '订单满10元减5元',
    type: 'coupon' as const,
    value: 5,
    pointsCost: 50,
    icon: '🏷️',
    stock: 999,
    isActive: true
  },
  {
    name: '免配送费',
    description: '免除一次配送费用',
    type: 'freeDelivery' as const,
    value: 0,
    pointsCost: 30,
    icon: '🚚',
    stock: 999,
    isActive: true
  },
  {
    name: '8折优惠券',
    description: '订单享受8折优惠',
    type: 'discount' as const,
    value: 20,
    pointsCost: 80,
    icon: '🎫',
    stock: 999,
    isActive: true
  },
  {
    name: '满20减10优惠券',
    description: '订单满20元减10元',
    type: 'coupon' as const,
    value: 10,
    pointsCost: 100,
    icon: '💰',
    stock: 999,
    isActive: true
  },
  {
    name: '5折优惠券',
    description: '订单享受5折优惠',
    type: 'discount' as const,
    value: 50,
    pointsCost: 200,
    icon: '🌟',
    stock: 999,
    isActive: true
  }
];
