import admin from 'firebase-admin';
import { logger } from '../utils/logger';

// 初始化 Firebase Admin
if (!admin.apps.length) {
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT 
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
    : null;

  if (serviceAccount) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    logger.info('Firebase Admin initialized');
  } else {
    logger.warn('Firebase service account not configured');
  }
}

export const sendPushNotification = async (
  fcmToken: string,
  title: string,
  body: string,
  data?: Record<string, string>
): Promise<boolean> => {
  if (!admin.apps.length) {
    logger.warn('Firebase not initialized');
    return false;
  }

  try {
    await admin.messaging().send({
      token: fcmToken,
      notification: {
        title,
        body,
      },
      data: data || {},
      android: {
        priority: 'high',
        notification: {
          channelId: 'default',
          sound: 'default',
        },
      },
      apns: {
        payload: {
          aps: {
            sound: 'default',
          },
        },
      },
    });

    logger.info(`Push notification sent to ${fcmToken}`);
    return true;
  } catch (error) {
    logger.error('Push notification failed:', error);
    return false;
  }
};

export const sendMulticastNotification = async (
  fcmTokens: string[],
  title: string,
  body: string,
  data?: Record<string, string>
): Promise<boolean> => {
  if (!admin.apps.length || fcmTokens.length === 0) {
    logger.warn('Firebase not initialized or no tokens');
    return false;
  }

  try {
    const response = await admin.messaging().sendMulticast({
      tokens: fcmTokens,
      notification: {
        title,
        body,
      },
      data: data || {},
    });

    logger.info(`Multicast sent: ${response.successCount} success, ${response.failureCount} failed`);
    return response.failureCount === 0;
  } catch (error) {
    logger.error('Multicast notification failed:', error);
    return false;
  }
};

// 订单状态变更通知
export const notifyOrderStatusChange = async (
  fcmToken: string,
  orderNumber: string,
  status: string
): Promise<void> => {
  const statusMessages: Record<string, { title: string; body: string }> = {
    confirmed: {
      title: '订单已确认',
      body: `您的订单 ${orderNumber} 已确认，正在准备中`,
    },
    preparing: {
      title: '订单准备中',
      body: `您的订单 ${orderNumber} 正在准备中`,
    },
    ready: {
      title: '订单待配送',
      body: `您的订单 ${orderNumber} 已准备好，等待配送员取货`,
    },
    delivering: {
      title: '订单配送中',
      body: `您的订单 ${orderNumber} 正在配送中`,
    },
    delivered: {
      title: '订单已送达',
      body: `您的订单 ${orderNumber} 已送达，请确认收货`,
    },
  };

  const message = statusMessages[status];
  if (message) {
    await sendPushNotification(fcmToken, message.title, message.body, {
      orderNumber,
      status,
      type: 'order_status',
    });
  }
};