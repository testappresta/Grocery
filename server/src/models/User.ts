import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  phone: string;
  email?: string;
  password?: string;
  name: string;
  avatar?: string;
  role: 'customer' | 'merchant' | 'driver' | 'admin';
  status: 'active' | 'inactive' | 'suspended';
  isVerified: boolean;
  addresses: IAddress[];
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IAddress {
  id: string;
  name: string;
  phone: string;
  address: string;
  detail?: string;
  lat?: number;
  lng?: number;
  isDefault: boolean;
  tag?: 'home' | 'work' | 'other';
}

const AddressSchema: Schema = new Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  detail: { type: String },
  lat: { type: Number },
  lng: { type: Number },
  isDefault: { type: Boolean, default: false },
  tag: { type: String, enum: ['home', 'work', 'other'] }
});

const UserSchema: Schema = new Schema({
  phone: { 
    type: String, 
    required: true, 
    unique: true,
    index: true 
  },
  email: { 
    type: String, 
    sparse: true,
    lowercase: true 
  },
  password: { type: String },
  name: { type: String, required: true },
  avatar: { type: String },
  role: { 
    type: String, 
    enum: ['customer', 'merchant', 'driver', 'admin'],
    default: 'customer'
  },
  status: { 
    type: String, 
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  isVerified: { type: Boolean, default: false },
  addresses: [AddressSchema]
}, {
  timestamps: true
});

// 密码加密
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// 密码比较方法
UserSchema.methods.comparePassword = async function(
  candidatePassword: string
): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>('User', UserSchema);