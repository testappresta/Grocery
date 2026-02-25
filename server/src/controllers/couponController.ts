import { Request, Response } from 'express';
import { Coupon, UserCoupon } from '../models/Coupon';
import Order from '../models/Order';
import { asyncHandler } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

// 获取可用优惠券列表
export const getAvailableCoupons = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId;
  const { storeId, orderAmount } = req.query;
  
  const now = new Date();
  
  // 获取所有有效的优惠券
  const coupons = await Coupon.find({
    isActive: true,
    startDate: { $lte: now },
    endDate: { $gte: now },
    $expr: { $lt: ['$usageCount', '$usageLimit'] }
  });
  
  // 获取用户已使用的优惠券
  const usedCoupons = await UserCoupon.find({
    user: userId,
    isUsed: true
  }).distinct('coupon');
  
  // 过滤出可用的优惠券
  const availableCoupons = coupons.filter(coupon => {
    // 检查是否已使用
    if (usedCoupons.some((id: any) => id.toString() === coupon._id.toString())) {
      return false;
    }
    
    // 检查最低订单金额
    if (orderAmount && Number(orderAmount) < coupon.minOrderAmount) {
      return false;
    }
    
    // 检查是否适用于该店铺
    if (storeId && coupon.applicableStores?.length > 0) {
      if (!coupon.applicableStores.some((id: any) => id.toString() === storeId as string)) {
        return false;
      }
    }
    
    return true;
  });
  
  res.json({
    success: true,
    data: { coupons: availableCoupons }
  });
});

// 领取优惠券
export const claimCoupon = asyncHandler(async (req: Request, res: Response) => {
  const { couponId } = req.body;
  const userId = req.userId;
  
  const coupon = await Coupon.findById(couponId);
  
  if (!coupon || !coupon.isActive) {
    return res.status(404).json({
      success: false,
      message: 'Coupon not found'
    });
  }
  
  // 检查是否已过期
  const now = new Date();
  if (now < coupon.startDate || now > coupon.endDate) {
    return res.status(400).json({
      success: false,
      message: 'Coupon expired'
    });
  }
  
  // 检查是否已领完
  if (coupon.usageCount >= coupon.usageLimit) {
    return res.status(400).json({
      success: false,
      message: 'Coupon fully claimed'
    });
  }
  
  // 检查用户是否已领取
  const existingClaim = await UserCoupon.findOne({
    user: userId,
    coupon: couponId
  });
  
  if (existingClaim) {
    return res.status(400).json({
      success: false,
      message: 'You have already claimed this coupon'
    });
  }
  
  // 创建领取记录
  await UserCoupon.create({
    user: userId,
    coupon: couponId
  });
  
  // 增加使用计数
  await Coupon.findByIdAndUpdate(couponId, {
    $inc: { usageCount: 1 }
  });
  
  res.json({
    success: true,
    message: 'Coupon claimed successfully'
  });
});

// 验证优惠券
export const validateCoupon = asyncHandler(async (req: Request, res: Response) => {
  const { code, orderAmount, storeId } = req.body;
  const userId = req.userId;
  
  const coupon = await Coupon.findOne({ code: code.toUpperCase() });
  
  if (!coupon) {
    return res.status(404).json({
      success: false,
      message: 'Invalid coupon code'
    });
  }
  
  // 验证各种条件
  const validation = validateCouponConditions(coupon, userId!, Number(orderAmount), storeId);
  
  if (!validation.valid) {
    return res.status(400).json({
      success: false,
      message: validation.message
    });
  }
  
  // 计算优惠金额
  let discount = 0;
  if (coupon.type === 'percentage') {
    discount = Number(orderAmount) * (coupon.value / 100);
    if (coupon.maxDiscount) {
      discount = Math.min(discount, coupon.maxDiscount);
    }
  } else {
    discount = coupon.value;
  }
  
  res.json({
    success: true,
    data: {
      coupon,
      discount: Math.round(discount * 100) / 100,
      finalAmount: Number(orderAmount) - discount
    }
  });
});

// 使用优惠券
export const useCoupon = asyncHandler(async (req: Request, res: Response) => {
  const { couponId, orderId } = req.body;
  const userId = req.userId;
  
  const userCoupon = await UserCoupon.findOne({
    user: userId,
    coupon: couponId,
    isUsed: false
  });
  
  if (!userCoupon) {
    return res.status(400).json({
      success: false,
      message: 'Coupon not available'
    });
  }
  
  // 标记为已使用
  userCoupon.isUsed = true;
  userCoupon.usedAt = new Date();
  userCoupon.order = orderId;
  await userCoupon.save();
  
  res.json({
    success: true,
    message: 'Coupon applied'
  });
});

// 获取我的优惠券
export const getMyCoupons = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId;
  const { status = 'available' } = req.query;
  
  const query: any = { user: userId };
  
  if (status === 'available') {
    query.isUsed = false;
  } else if (status === 'used') {
    query.isUsed = true;
  }
  
  const userCoupons = await UserCoupon.find(query)
    .populate('coupon')
    .sort('-createdAt');
  
  // 过滤掉已过期的
  const now = new Date();
  const validCoupons = userCoupons.filter((uc: any) => {
    if (uc.isUsed) return true;
    return uc.coupon?.endDate >= now;
  });
  
  res.json({
    success: true,
    data: { coupons: validCoupons }
  });
});

// 验证优惠券条件
function validateCouponConditions(
  coupon: any,
  userId: string,
  orderAmount: number,
  storeId?: string
): { valid: boolean; message?: string } {
  const now = new Date();
  
  if (!coupon.isActive) {
    return { valid: false, message: 'Coupon is not active' };
  }
  
  if (now < coupon.startDate) {
    return { valid: false, message: 'Coupon not yet available' };
  }
  
  if (now > coupon.endDate) {
    return { valid: false, message: 'Coupon expired' };
  }
  
  if (coupon.usageCount >= coupon.usageLimit) {
    return { valid: false, message: 'Coupon fully claimed' };
  }
  
  if (orderAmount < coupon.minOrderAmount) {
    return { valid: false, message: `Minimum order amount is €${coupon.minOrderAmount}` };
  }
  
  if (storeId && coupon.applicableStores?.length > 0) {
    if (!coupon.applicableStores.some((id: any) => id.toString() === storeId)) {
      return { valid: false, message: 'Coupon not applicable to this store' };
    }
  }
  
  return { valid: true };
}