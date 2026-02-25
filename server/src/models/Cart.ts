import mongoose, { Schema, Document } from 'mongoose';

export interface ICart extends Document {
  user: mongoose.Types.ObjectId;
  store?: mongoose.Types.ObjectId;
  items: ICartItem[];
  total: number;
  updatedAt: Date;
}

export interface ICartItem {
  product: mongoose.Types.ObjectId;
  name: string;
  image: string;
  price: number;
  quantity: number;
  unit: string;
  total: number;
}

const CartItemSchema: Schema = new Schema({
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

const CartSchema: Schema = new Schema({
  user: { 
    type: Schema.Types.ObjectId, 
    ref: 'User',
    required: true,
    unique: true,
    index: true 
  },
  store: { 
    type: Schema.Types.ObjectId, 
    ref: 'Store' 
  },
  items: [CartItemSchema],
  total: { type: Number, default: 0 }
}, {
  timestamps: true
});

export default mongoose.model<ICart>('Cart', CartSchema);