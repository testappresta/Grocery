import { Request, Response } from 'express';
import Order from '../models/Order';
import { asyncHandler } from '../middleware/errorHandler';
import { notifyOrderStatusChange } from '../services/notificationService';
import { logger } from '../utils/logger';

// Redis 模拟（生产环境使用 Redis）
const driverLocations = new Map<string, {
  lat: number;
  lng: number;
  timestamp: number;
  orderId?: string;
}>();

// 获取可接订单
export const getAvailableOrders = asyncHandler(async (req: Request, res: Response) => {
  const { lat, lng } = req.query;
  
  // 查找待配送的订单（已准备好，未分配配送员）
  const orders = await Order.find({
    status: 'ready',
    driver: { $exists: false }
  })
    .populate('store', 'name address lat lng phone')
    .populate('customer', 'name phone')
    .sort('-createdAt');
  
  // 计算距离并排序
  const ordersWithDistance = orders.map(order => {
    const storeLat = order.store?.lat;
    const storeLng = order.store?.lng;
    
    let distance = null;
    if (lat && lng && storeLat && storeLng) {
      distance = calculateDistance(
        Number(lat), 
        Number(lng), 
        storeLat, 
        storeLng
      );
    }
    
    return {
      ...order.toObject(),
      distance: distance ? Math.round(distance * 100) / 100 : null
    };
  }).sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity));
  
  res.json({
    success: true,
    data: { orders: ordersWithDistance }
  });
});

// 接单
export const acceptOrder = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const driverId = req.userId;
  
  const order = await Order.findOneAndUpdate(
    {
      _id: id,
      status: 'ready',
      driver: { $exists: false }
    },
    {
      driver: driverId,
      status: 'delivering'
    },
    { new: true }
  ).populate('customer', 'fcmToken');
  
  if (!order) {
    return res.status(400).json({
      success: false,
      message: 'Order not available'
    });
  }
  
  // 发送推送通知给客户
  if (order.customer?.fcmToken) {
    await notifyOrderStatusChange(
      order.customer.fcmToken,
      order.orderNumber,
      'delivering'
    );
  }
  
  // 通过 Socket.io 通知客户
  const io = req.app.get('io');
  io.to(order.customer.toString()).emit('order_status', {
    orderId: id,
    status: 'delivering',
    driverId
  });
  
  res.json({
    success: true,
    message: 'Order accepted',
    data: { order }
  });
});

// 更新位置
export const updateLocation = asyncHandler(async (req: Request, res: Response) => {
  const { lat, lng } = req.body;
  const driverId = req.userId!;
  const { orderId } = req.params;
  
  // 存储位置到内存（生产环境用 Redis）
  driverLocations.set(driverId, {
    lat,
    lng,
    timestamp: Date.now(),
    orderId
  });
  
  // 如果有订单，推送给客户
  if (orderId) {
    const order = await Order.findById(orderId);
    if (order) {
      const io = req.app.get('io');
      io.to(order.customer.toString()).emit('driver_location', {
        orderId,
        lat,
        lng,
        timestamp: Date.now()
      });
    }
  }
  
  res.json({
    success: true,
    message: 'Location updated'
  });
});

// 获取配送员位置（客户查看）
export const getDriverLocation = asyncHandler(async (req: Request, res: Response) => {
  const { orderId } = req.params;
  
  const order = await Order.findById(orderId);
  
  if (!order || !order.driver) {
    return res.status(404).json({
      success: false,
      message: 'Order or driver not found'
    });
  }
  
  const location = driverLocations.get(order.driver.toString());
  
  if (!location) {
    return res.status(404).json({
      success: false,
      message: 'Driver location not available'
    });
  }
  
  res.json({
    success: true,
    data: { location }
  });
});

// 更新配送状态
export const updateDeliveryStatus = asyncHandler(async (req: Request, res: Response) => {
  const { status } = req.body;
  const { id } = req.params;
  const driverId = req.userId;
  
  const order = await Order.findOneAndUpdate(
    { _id: id, driver: driverId },
    { status },
    { new: true }
  ).populate('customer', 'fcmToken');
  
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
    
    // 清除位置信息
    driverLocations.delete(driverId!);
  }
  
  // 发送推送通知
  if (order.customer?.fcmToken) {
    await notifyOrderStatusChange(
      order.customer.fcmToken,
      order.orderNumber,
      status
    );
  }
  
  // 通过 Socket.io 通知客户
  const io = req.app.get('io');
  io.to(order.customer.toString()).emit('order_status', {
    orderId: id,
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
  const driverId = req.userId;
  const { startDate, endDate } = req.query;
  
  const query: any = { driver: driverId, status: 'delivered' };
  
  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate as string);
    if (endDate) query.createdAt.$lte = new Date(endDate as string);
  }
  
  // 获取今日收入
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayOrders = await Order.find({
    driver: driverId,
    status: 'delivered',
    createdAt: { $gte: today }
  });
  const todayEarnings = todayOrders.length * 5; // 假设每单5欧
  
  // 获取本周收入
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  weekStart.setHours(0, 0, 0, 0);
  const weekOrders = await Order.find({
    driver: driverId,
    status: 'delivered',
    createdAt: { $gte: weekStart }
  });
  const weekEarnings = weekOrders.length * 5;
  
  // 获取本月收入
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);
  const monthOrders = await Order.find({
    driver: driverId,
    status: 'delivered',
    createdAt: { $gte: monthStart }
  });
  const monthEarnings = monthOrders.length * 5;
  
  // 获取总订单
  const totalOrders = await Order.countDocuments({
    driver: driverId,
    status: 'delivered'
  });
  
  res.json({
    success: true,
    data: {
      today: todayEarnings,
      week: weekEarnings,
      month: monthEarnings,
      total: totalOrders * 5,
      orderCount: {
        today: todayOrders.length,
        week: weekOrders.length,
        month: monthOrders.length,
        total: totalOrders
      }
    }
  });
});

// 计算两点距离（公里）
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // 地球半径（公里）
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}