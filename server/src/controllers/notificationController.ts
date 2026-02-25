import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';

// 获取通知列表
export const getNotifications = asyncHandler(async (req: Request, res: Response) => {
  // TODO: 实现通知系统（使用 MongoDB 或 Redis）
  
  res.json({
    success: true,
    data: {
      notifications: [],
      unreadCount: 0
    }
  });
});

// 标记为已读
export const markAsRead = asyncHandler(async (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Notification marked as read'
  });
});

// 标记全部已读
export const markAllAsRead = asyncHandler(async (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'All notifications marked as read'
  });
});

// 删除通知
export const deleteNotification = asyncHandler(async (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Notification deleted'
  });
});