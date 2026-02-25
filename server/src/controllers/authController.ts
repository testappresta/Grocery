import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { asyncHandler } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

// 生成 Token
const generateTokens = (userId: string) => {
  const accessToken = jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '7d' }
  );
  
  const refreshToken = jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET || 'your-refresh-secret',
    { expiresIn: '30d' }
  );
  
  return { accessToken, refreshToken };
};

// 发送验证码
export const sendVerificationCode = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  
  const { phone } = req.body;
  
  // TODO: 集成短信服务（如 Twilio、阿里云短信等）
  // 这里模拟发送验证码
  const code = Math.floor(1000 + Math.random() * 9000).toString();
  
  logger.info(`Verification code for ${phone}: ${code}`);
  
  // 实际项目中，将验证码存入 Redis，设置 5 分钟过期
  
  res.json({
    success: true,
    message: 'Verification code sent',
    // 开发环境返回验证码，生产环境不要返回
    ...(process.env.NODE_ENV === 'development' && { code })
  });
});

// 手机号登录
export const loginWithPhone = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  
  const { phone, code } = req.body;
  
  // TODO: 验证验证码
  // 实际项目中，从 Redis 获取验证码并验证
  
  let user = await User.findOne({ phone });
  
  // 如果用户不存在，自动注册
  if (!user) {
    user = await User.create({
      phone,
      name: `User_${phone.slice(-4)}`,
      isVerified: true
    });
    logger.info(`New user registered: ${phone}`);
  }
  
  const tokens = generateTokens(user._id.toString());
  
  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        avatar: user.avatar,
        role: user.role
      },
      ...tokens
    }
  });
});

// 邮箱密码登录
export const loginWithEmail = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  
  const { email, password } = req.body;
  
  const user = await User.findOne({ email });
  
  if (!user || !user.password) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password'
    });
  }
  
  const isMatch = await user.comparePassword(password);
  
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password'
    });
  }
  
  const tokens = generateTokens(user._id.toString());
  
  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        avatar: user.avatar,
        role: user.role
      },
      ...tokens
    }
  });
});

// 注册
export const register = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  
  const { name, email, password, phone } = req.body;
  
  // 检查邮箱是否已存在
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'Email already registered'
    });
  }
  
  const user = await User.create({
    name,
    email,
    password,
    phone,
    isVerified: true
  });
  
  const tokens = generateTokens(user._id.toString());
  
  res.status(201).json({
    success: true,
    message: 'Registration successful',
    data: {
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        avatar: user.avatar,
        role: user.role
      },
      ...tokens
    }
  });
});

// 刷新 Token
export const refreshToken = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  
  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      message: 'Refresh token is required'
    });
  }
  
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'your-refresh-secret') as { userId: string };
    const tokens = generateTokens(decoded.userId);
    
    res.json({
      success: true,
      data: tokens
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid refresh token'
    });
  }
});

// 获取当前用户
export const getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
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
  const { name, avatar } = req.body;
  
  const user = await User.findByIdAndUpdate(
    req.userId,
    { name, avatar },
    { new: true }
  ).select('-password');
  
  res.json({
    success: true,
    message: 'Profile updated',
    data: { user }
  });
});

// 修改密码
export const changePassword = asyncHandler(async (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  
  const user = await User.findById(req.userId);
  
  if (!user || !user.password) {
    return res.status(400).json({
      success: false,
      message: 'Password not set'
    });
  }
  
  const isMatch = await user.comparePassword(currentPassword);
  
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: 'Current password is incorrect'
    });
  }
  
  user.password = newPassword;
  await user.save();
  
  res.json({
    success: true,
    message: 'Password changed successfully'
  });
});