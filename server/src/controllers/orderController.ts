import { Request, Response } from 'express';
import Order from '../models/Order';
import Cart from '../models/Cart';
import Product from '../models/Product';
import { asyncHandler } from '../middleware/errorHandler';
import { generateOrderNumber } from '../utils/helpers';

// 获取订单列表
export const getOrders = asyncHandler(async (req: Request, res: Response) => {
  const { status, page = 1, limit = 10 } = req.query;
  
  const query: any = { customer: req.userId };
  if (status) query.status = status;
  
  const orders = await Order.find(query)
    .populate('store', 'name logo')
    .populate('items.product', 'name images')
    .sort('-createdAt')
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit));
  
  const total = await Order.countDocuments(query);
  
  res.json({
    success: true,
    data: {
      orders,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    }
  });
});

// 获取订单详情
export const getOrderById = asyncHandler(async (req: Request, res: Response) => {
  const order = await Order.findOne({
    _id: req.params.id,
    customer: req.userId
  })
    .populate('store', 'name logo phone address')
    .populate('items.product', 'name images')
    .populate('driver', 'name phone avatar');
  
  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found'
    });
  }
  
  res.json({
    success: true,
    data: { order }
  });
});

// 创建订单
export const createOrder = asyncHandler(async (req: Request, res: Response) => {
  const { addressId, note, paymentMethod } = req.body;
  
  // 获取购物车
  const cart = await Cart.findOne({ user: req.userId })
    .populate('items.product');
  
  if (!cart || cart.items.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Cart is empty'
    });
  }
  
  // 获取用户地址
  const User = require('../models/User').default;
  const user = await User.findById(req.userId);
  const address = user.addresses.id(addressId);
  
  if (!address) {
    return res.status(400).json({
      success: false,
      message: 'Address not found'
    });
  }
  
  // 检查库存
  for (const item of cart.items) {
    const product = await Product.findById(item.product);
    if (!product || product.stock < item.quantity) {
      return res.status(400).json({
        success: false,
        message: `Insufficient stock for ${item.name}`
      });
    }
  }
  
  // 创建订单
  const orderItems = cart.items.map(item => ({
    product: item.product._id,
    name: item.name,
    image: item.image,
    price: item.price,
    quantity: item.quantity,
    unit: item.unit,
    total: item.total
  }));
  
  const order = await Order.create({
    orderNumber: generateOrderNumber(),
    customer: req.userId,
    store: cart.store,
    items: orderItems,
    status: 'pending',
    paymentStatus: 'pending',
    paymentMethod,
    subtotal: cart.total,
    deliveryFee: 0, // 可配置
    discount: 0,
    total: cart.total,
    deliveryAddress: {
      name: address.name,
      phone: address.phone,
      address: address.address,
      detail: address.detail,
      lat: address.lat,
      lng: address.lng
    },
    note
  });
  
  // 减少库存
  for (const item of cart.items) {
    await Product.findByIdAndUpdate(item.product._id, {
      $inc: { stock: -item.quantity, soldCount: item.quantity }
    });
  }
  
  // 清空购物车
  await Cart.findByIdAndDelete(cart._id);
  
  res.status(201).json({
    success: true,
    message: 'Order created',
    data: { order }
  });
});

// 更新订单状态
export const updateOrderStatus = asyncHandler(async (req: Request, res: Response) => {
  const { status } = req.body;
  
  const order = await Order.findOneAndUpdate(
    { _id: req.params.id, customer: req.userId },
    { status },
    { new: true }
  );
  
  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found'
    });
  }
  
  res.json({
    success: true,
    message: 'Order status updated',
    data: { order }
  });
});

// 取消订单
export const cancelOrder = asyncHandler(async (req: Request, res: Response) => {
  const order = await Order.findOne({
    _id: req.params.id,
    customer: req.userId
  });
  
  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found'
    });
  }
  
  // 只能取消待处理或已确认的订单
  if (!['pending', 'confirmed'].includes(order.status)) {
    return res.status(400).json({
      success: false,
      message: 'Cannot cancel this order'
    });
  }
  
  // 恢复库存
  for (const item of order.items) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: item.quantity, soldCount: -item.quantity }
    });
  }
  
  order.status = 'cancelled';
  await order.save();
  
  res.json({
    success: true,
    message: 'Order cancelled',
    data: { order }
  });
});