import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
  order: mongoose.Types.ObjectId;
  customer: mongoose.Types.ObjectId;
  store: mongoose.Types.ObjectId;
  driver?: mongoose.Types.ObjectId;
  type: 'store' | 'driver' | 'product';
  target: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
  images?: string[];
  reply?: {
    content: string;
    createdAt: Date;
  };
  isVisible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema: Schema = new Schema({
  order: {
    type: Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
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
  type: {
    type: String,
    enum: ['store', 'driver', 'product'],
    required: true
  },
  target: {
    type: Schema.Types.ObjectId,
    required: true,
    index: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true,
    maxlength: 500
  },
  images: [{
    type: String
  }],
  reply: {
    content: {
      type: String,
      maxlength: 500
    },
    createdAt: {
      type: Date
    }
  },
  isVisible: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// 复合索引
ReviewSchema.index({ store: 1, type: 1, isVisible: 1 });
ReviewSchema.index({ target: 1, type: 1 });

export default mongoose.model<IReview>('Review', ReviewSchema);