import { Request, Response } from 'express';
import Store from '../models/Store';
import Product from '../models/Product';
import { asyncHandler } from '../middleware/errorHandler';

// 获取店铺列表
export const getStores = asyncHandler(async (req: Request, res: Response) => {
  const { page = 1, limit = 20, category, search } = req.query;
  
  const query: any = { status: 'active', isVerified: true };
  
  if (category) query.categories = category;
  if (search) query.name = { $regex: search, $options: 'i' };
  
  const stores = await Store.find(query)
    .sort('-rating')
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit));
  
  const total = await Store.countDocuments(query);
  
  res.json({
    success: true,
    data: {
      stores,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    }
  });
});

// 获取附近店铺
export const getNearbyStores = asyncHandler(async (req: Request, res: Response) => {
  const { lat, lng, radius = 5000, page = 1, limit = 20 } = req.query;
  
  if (!lat || !lng) {
    return res.status(400).json({
      success: false,
      message: 'Latitude and longitude are required'
    });
  }
  
  // 简化的距离计算（实际项目使用 MongoDB 地理空间查询）
  const stores = await Store.find({
    status: 'active',
    isVerified: true
  })
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit));
  
  // 计算距离并排序
  const storesWithDistance = stores.map(store => {
    const distance = calculateDistance(
      Number(lat),
      Number(lng),
      store.lat,
      store.lng
    );
    return { ...store.toObject(), distance };
  }).filter(s => s.distance <= Number(radius))
    .sort((a, b) => a.distance - b.distance);
  
  res.json({
    success: true,
    data: { stores: storesWithDistance }
  });
});

// 计算两点距离（米）
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000; // 地球半径（米）
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// 获取店铺详情
export const getStoreById = asyncHandler(async (req: Request, res: Response) => {
  const store = await Store.findById(req.params.id);
  
  if (!store) {
    return res.status(404).json({
      success: false,
      message: 'Store not found'
    });
  }
  
  res.json({
    success: true,
    data: { store }
  });
});

// 创建店铺
export const createStore = asyncHandler(async (req: Request, res: Response) => {
  const store = await Store.create({
    ...req.body,
    owner: req.userId
  });
  
  res.status(201).json({
    success: true,
    message: 'Store created',
    data: { store }
  });
});

// 更新店铺
export const updateStore = asyncHandler(async (req: Request, res: Response) => {
  const store = await Store.findOneAndUpdate(
    { _id: req.params.id, owner: req.userId },
    req.body,
    { new: true }
  );
  
  if (!store) {
    return res.status(404).json({
      success: false,
      message: 'Store not found'
    });
  }
  
  res.json({
    success: true,
    message: 'Store updated',
    data: { store }
  });
});

// 获取店铺商品
export const getStoreProducts = asyncHandler(async (req: Request, res: Response) => {
  const { page = 1, limit = 20, category } = req.query;
  
  const query: any = { store: req.params.id, isAvailable: true };
  if (category) query.category = category;
  
  const products = await Product.find(query)
    .populate('category', 'name')
    .sort('-isFeatured -createdAt')
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit));
  
  const total = await Product.countDocuments(query);
  
  res.json({
    success: true,
    data: {
      products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    }
  });
});