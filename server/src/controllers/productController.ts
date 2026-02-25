import { Request, Response } from 'express';
import Product from '../models/Product';
import { asyncHandler } from '../middleware/errorHandler';

// 获取商品列表
export const getProducts = asyncHandler(async (req: Request, res: Response) => {
  const {
    page = 1,
    limit = 20,
    category,
    store,
    minPrice,
    maxPrice,
    search,
    sort = '-createdAt'
  } = req.query;
  
  const query: any = { isAvailable: true };
  
  if (category) query.category = category;
  if (store) query.store = store;
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }
  if (search) {
    query.$text = { $search: search as string };
  }
  
  const skip = (Number(page) - 1) * Number(limit);
  
  const products = await Product.find(query)
    .populate('store', 'name logo')
    .populate('category', 'name')
    .sort(sort as string)
    .skip(skip)
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

// 搜索商品
export const searchProducts = asyncHandler(async (req: Request, res: Response) => {
  const { q, page = 1, limit = 20 } = req.query;
  
  if (!q) {
    return res.status(400).json({
      success: false,
      message: 'Search query is required'
    });
  }
  
  const products = await Product.find(
    { $text: { $search: q as string }, isAvailable: true },
    { score: { $meta: 'textScore' } }
  )
    .populate('store', 'name logo')
    .populate('category', 'name')
    .sort({ score: { $meta: 'textScore' } })
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit));
  
  res.json({
    success: true,
    data: { products }
  });
});

// 获取推荐商品
export const getFeaturedProducts = asyncHandler(async (req: Request, res: Response) => {
  const products = await Product.find({ isFeatured: true, isAvailable: true })
    .populate('store', 'name logo')
    .populate('category', 'name')
    .limit(10);
  
  res.json({
    success: true,
    data: { products }
  });
});

// 获取商品详情
export const getProductById = asyncHandler(async (req: Request, res: Response) => {
  const product = await Product.findById(req.params.id)
    .populate('store')
    .populate('category');
  
  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }
  
  res.json({
    success: true,
    data: { product }
  });
});

// 创建商品
export const createProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await Product.create(req.body);
  
  res.status(201).json({
    success: true,
    message: 'Product created',
    data: { product }
  });
});

// 更新商品
export const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  
  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }
  
  res.json({
    success: true,
    message: 'Product updated',
    data: { product }
  });
});

// 删除商品
export const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  
  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }
  
  res.json({
    success: true,
    message: 'Product deleted'
  });
});