import { Request, Response } from 'express';
import Order from '../models/Order';
import { asyncHandler } from '../middleware/errorHandler';

// 获取可接订单
export const getAvailableOrders = asyncHandler(async (req: Request, res: Response) => {
  const { lat, lng, page = 1, limit = 20 } = req.query;
  
  // 查找待配送的订单
  const orders = await Order.find({
    status: 'ready',
    driver: { $exists: false }
  })
    .populate('store', 'name address lat lng')
    .populate('customer', 'name phone')
    .sort('-createdAt')
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit));
  
  res.json({
    success: true,
    data: { orders }
  });
});

// 接单
export const acceptOrder = asyncHandler(async (req: Request, res: Response) => {
  const order = await Order.findOneAndUpdate(
    {
      _id: req.params.id,
      status: 'ready',
      driver: { $exists: false }
    },
    {
      driver: req.userId,
      status: 'delivering'
    },
    { new: true }
  );
  
  if (!order) {
    return res.status(400).json({
      success: false,
      message: 'Order not available'
    });
  }
  
  // TODO: 发送通知给客户
  
  res.json({
    success: true,
    message: 'Order accepted',
    data: { order }
  });
});

// 更新位置
export const updateLocation = asyncHandler(async (req: Request, res: Response) => {
  const { lat, lng } = req.body;
  
  // TODO: 将位置信息存入 Redis 或数据库
  // 并通过 Socket.io 推送给客户
  
  const io = req.app.get('io');
  const order = await Order.findById(req.params.id);
  
  if (order) {
    io.to(order.customer.toString()).emit('driver_location', {
      orderId: req.params.id,
      lat,
      lng,
      timestamp: new Date()
    });
  }
  
  res.json({
    success: true,
    message: 'Location updated'
  });
});

// 更新配送状态
export const updateDeliveryStatus = asyncHandler(async (req: Request, res: Response) => {
  const { status } = req.body;
  
  const order = await Order.findOneAndUpdate(
    { _id: req.params.id, driver: req.userId },
    { status },
    { new: true }
  );
  
  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found'
    });
  }
  
  // 如果已送达，记录时间
  if (status === 'delivered') {
    order.actualDeliveryTime = new Date();
    await order.save();
  }
  
  // 通过 Socket.io 通知客户
  const io = req.app.get('io');
  io.to(order.customer.toString()).emit('order_status', {
    orderId: req.params.id,
    status
  });
  
  res.json({
    success: true,
    message: 'Status updated',
    data: { order }
  });
});

// 获取收入统计
export const getEarnings = asyncHandler(async (req: Request, res: Response) => {
  const { startDate, endDate } = req.query;
  
  const query: any = { driver: req.userId, status: 'delivered' };
  
  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate as string);
    if (endDate) query.createdAt.$lte = new Date(endDate as string);
  }
  
  const orders = await Order.find(query);
  
  const totalEarnings = orders.length * 5; // 假设每单配送费 5 元
  const totalOrders = orders.length;
  
  res.json({
    success: true,
    data: {
      totalEarnings,
      totalOrders,
      orders
    }
  });
});