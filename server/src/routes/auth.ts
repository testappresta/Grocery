import { Router } from 'express';
import { body } from 'express-validator';
import * as authController from '../controllers/authController';
import { authenticate } from '../middleware/auth';

const router = Router();

// 发送验证码
router.post(
  '/send-code',
  [
    body('phone').isMobilePhone('any').withMessage('Invalid phone number')
  ],
  authController.sendVerificationCode
);

// 手机号登录/注册
router.post(
  '/login-phone',
  [
    body('phone').isMobilePhone('any').withMessage('Invalid phone number'),
    body('code').isLength({ min: 4, max: 6 }).withMessage('Invalid verification code')
  ],
  authController.loginWithPhone
);

// 邮箱密码登录
router.post(
  '/login-email',
  [
    body('email').isEmail().withMessage('Invalid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
  ],
  authController.loginWithEmail
);

// 注册
router.post(
  '/register',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Invalid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('phone').optional().isMobilePhone('any')
  ],
  authController.register
);

// 刷新 Token
router.post('/refresh-token', authController.refreshToken);

// 获取当前用户
router.get('/me', authenticate, authController.getCurrentUser);

// 更新用户信息
router.put('/me', authenticate, authController.updateProfile);

// 修改密码
router.put(
  '/change-password',
  authenticate,
  [
    body('currentPassword').notEmpty(),
    body('newPassword').isLength({ min: 6 })
  ],
  authController.changePassword
);

export default router;