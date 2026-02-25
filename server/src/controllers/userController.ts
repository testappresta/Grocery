import { Request, Response } from 'express';
import User from '../models/User';
import { asyncHandler } from '../middleware/errorHandler';

// 获取用户信息
export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.userId).select('-password');
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }
  
  res.json({
    success: true,
    data: { user }
  });
});

// 更新用户信息
export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  const { name, avatar, email } = req.body;
  
  const user = await User.findByIdAndUpdate(
    req.userId,
    { name, avatar, email },
    { new: true }
  ).select('-password');
  
  res.json({
    success: true,
    message: 'Profile updated',
    data: { user }
  });
});

// 获取地址列表
export const getAddresses = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.userId).select('addresses');
  
  res.json({
    success: true,
    data: { addresses: user?.addresses || [] }
  });
});

// 添加地址
export const addAddress = asyncHandler(async (req: Request, res: Response) => {
  const { name, phone, address, detail, lat, lng, tag } = req.body;
  
  const user = await User.findById(req.userId);
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }
  
  // 如果是第一个地址，设为默认
  const isDefault = user.addresses.length === 0;
  
  user.addresses.push({
    name,
    phone,
    address,
    detail,
    lat,
    lng,
    isDefault,
    tag
  });
  
  await user.save();
  
  res.status(201).json({
    success: true,
    message: 'Address added',
    data: { addresses: user.addresses }
  });
});

// 更新地址
export const updateAddress = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;
  
  const user = await User.findById(req.userId);
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }
  
  const address = user.addresses.id(id);
  
  if (!address) {
    return res.status(404).json({
      success: false,
      message: 'Address not found'
    });
  }
  
  Object.assign(address, updates);
  await user.save();
  
  res.json({
    success: true,
    message: 'Address updated',
    data: { addresses: user.addresses }
  });
});

// 删除地址
export const deleteAddress = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  const user = await User.findById(req.userId);
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }
  
  user.addresses = user.addresses.filter(addr => addr._id?.toString() !== id);
  await user.save();
  
  res.json({
    success: true,
    message: 'Address deleted',
    data: { addresses: user.addresses }
  });
});

// 设置默认地址
export const setDefaultAddress = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  const user = await User.findById(req.userId);
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }
  
  // 重置所有地址为非默认
  user.addresses.forEach(addr => {
    addr.isDefault = addr._id?.toString() === id;
  });
  
  await user.save();
  
  res.json({
    success: true,
    message: 'Default address set',
    data: { addresses: user.addresses }
  });
});