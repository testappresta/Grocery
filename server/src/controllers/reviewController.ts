import { Request, Response } from 'express';
import Review from '../models/Review';
import Order from '../models/Order';
import Store from '../models/Store';
import Product from '../models/Product';
import { asyncHandler } from '../middleware/errorHandler';

// 创建评价
export const createReview = asyncHandler(async (req: Request, res: Response) => {
  const { orderId, type, targetId, rating, comment, images } = req.body;
  const customerId = req.userId;
  
  // 验证订单是否存在且已完成
  const order = await Order.findOne({
    _id: orderId,
    customer: customerId,
    status: 'delivered'
  });
  
  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found or not delivered'
    });
  }
  
  // 检查是否已评价
  const existingReview = await Review.findOne({
    order: orderId,
    customer: customerId,
    type
  });
  
  if (existingReview) {
    return res.status(400).json({
      success: false,
      message: 'You have already reviewed this'
    });
  }
  
  // 创建评价
  const review = await Review.create({
    order: orderId,
    customer: customerId,
    store: order.store,
    driver: order.driver,
    type,
    target: targetId,
    rating,
    comment,
    images
  });
  
  // 更新店铺/商品/配送员的评分
  await updateTargetRating(type, targetId);
  
  res.status(201).json({
    success: true,
    message: 'Review created',
    data: { review }
  });
});

// 获取评价列表
export const getReviews = asyncHandler(async (req: Request, res: Response) => {
  const { targetId, type, page = 1, limit = 10 } = req.query;
  
  const query: any = { isVisible: true };
  if (targetId) query.target = targetId;
  if (type) query.type = type;
  
  const reviews = await Review.find(query)
    .populate('customer', 'name avatar')
    .sort('-createdAt')
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit));
  
  const total = await Review.countDocuments(query);
  
  // 计算平均分
  const avgRating = await Review.aggregate([
    { $match: query },
    { $group: { _id: null, avg: { $avg: '$rating' } } }
  ]);
  
  res.json({
    success: true,
    data: {
      reviews,
      averageRating: avgRating[0]?.avg || 0,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    }
  });
});

// 获取店铺评价统计
export const getStoreReviewStats = asyncHandler(async (req: Request, res: Response) => {
  const { storeId } = req.params;
  
  const stats = await Review.aggregate([
    { $match: { store: new mongoose.Types.ObjectId(storeId), isVisible: true } },
    {
      $group: {
        _id: '$rating',
        count: { $sum: 1 }
      }
    }
  ]);
  
  const total = await Review.countDocuments({ store: storeId, isVisible: true });
  const avgRating = await Review.aggregate([
    { $match: { store: new mongoose.Types.ObjectId(storeId), isVisible: true } },
    { $group: { _id: null, avg: { $avg: '$rating' } } }
  ]);
  
  const ratingDistribution = {
    5: 0, 4: 0, 3: 0, 2: 0, 1: 0
  };
  
  stats.forEach((stat: any) => {
    ratingDistribution[stat._id as keyof typeof ratingDistribution] = stat.count;
  });
  
  res.json({
    success: true,
    data: {
      averageRating: avgRating[0]?.avg || 0,
      total,
      ratingDistribution
    }
  });
});

// 商家回复评价
export const replyToReview = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { content } = req.body;
  const userId = req.userId;
  
  const review = await Review.findById(id).populate('store', 'owner');
  
  if (!review) {
    return res.status(404).json({
      success: false,
      message: 'Review not found'
    });
  }
  
  // 验证是否是店铺 owner
  // @ts-ignore
  if (review.store?.owner?.toString() !== userId) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized'
    });
  }
  
  review.reply = {
    content,
    createdAt: new Date()
  };
  
  await review.save();
  
  res.json({
    success: true,
    message: 'Reply added',
    data: { review }
  });
});

// 更新目标评分
async function updateTargetRating(type: string, targetId: string) {
  const avgRating = await Review.aggregate([
    { $match: { target: new mongoose.Types.ObjectId(targetId), type } },
    { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } }
  ]);
  
  const rating = avgRating[0]?.avg || 0;
  const count = avgRating[0]?.count || 0;
  
  if (type === 'store') {
    await Store.findByIdAndUpdate(targetId, {
      rating: Math.round(rating * 10) / 10,
      reviewCount: count
    });
  } else if (type === 'product') {
    await Product.findByIdAndUpdate(targetId, {
      rating: Math.round(rating * 10) / 10,
      reviewCount: count
    });
  }
  // 配送员评分可以在 User 模型中添加字段
}

import mongoose from 'mongoose';