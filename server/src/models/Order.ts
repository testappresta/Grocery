import mongoose, { Schema, Document } from 'mongoose';

export interface IOrder extends Document {
  orderNumber: string;
  customer: mongoose.Types.ObjectId;
  store: mongoose.Types.ObjectId;
  driver?: mongoose.Types.ObjectId;
  items: IOrderItem[];
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod?: string;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  deliveryAddress: IDeliveryAddress;
  note?: string;
  estimatedDeliveryTime?: Date;
  actualDeliveryTime?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrderItem {
  product: mongoose.Types.ObjectId;
  name: string;
  image: string;
  price: number;
  quantity: number;
  unit: string;
  total: number;
}

export interface IDeliveryAddress {
  name: string;
  phone: string;
  address: string;
  detail?: string;
  lat?: number;
  lng?: number;
}

export type OrderStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'preparing' 
  | 'ready' 
  | 'delivering' 
  | 'delivered' 
  | 'cancelled' 
  | 'refunded';

export type PaymentStatus = 
  | 'pending' 
  | 'paid' 
  | 'failed' 
  | 'refunded';

const OrderItemSchema: Schema = new Schema({
  product: { 
    type: Schema.Types.ObjectId, 
    ref: 'Product',
    required: true 
  },
  name: { type: String, required: true },
  image: { type: String },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  unit: { type: String, required: true },
  total: { type: Number, required: true }
});

const DeliveryAddressSchema: Schema = new Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  detail: { type: String },
  lat: { type: Number },
  lng: { type: Number }
});

const OrderSchema: Schema = new Schema({
  orderNumber: { 
    type: String, 
    required: true, 
    unique: true,
    index: true 
  },
  customer: { 
    type: Schema.Types.ObjectId, 
    ref: 'User',
    required: true,
    index: true 
  },
  store: { 
    type: Schema.Types.ObjectId, 
    ref: 'Store',
    required: true,
    index: true 
  },
  driver: { 
    type: Schema.Types.ObjectId, 
    ref: 'User',
    index: true 
  },
  items: [OrderItemSchema],
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'preparing', 'ready', 'delivering', 'delivered', 'cancelled', 'refunded'],
    default: 'pending',
    index: true 
  },
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending' 
  },
  paymentMethod: { type: String },
  subtotal: { type: Number, required: true },
  deliveryFee: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  total: { type: Number, required: true },
  deliveryAddress: { type: DeliveryAddressSchema, required: true },
  note: { type: String },
  estimatedDeliveryTime: { type: Date },
  actualDeliveryTime: { type: Date }
}, {
  timestamps: true
});

// 索引
OrderSchema.index({ customer: 1, status: 1 });
OrderSchema.index({ store: 1, status: 1 });
OrderSchema.index({ driver: 1, status: 1 });
OrderSchema.index({ createdAt: -1 });

export default mongoose.model<IOrder>('Order', OrderSchema);