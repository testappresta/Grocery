import twilio from 'twilio';
import { logger } from '../utils/logger';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromPhone = process.env.TWILIO_PHONE_NUMBER;

let client: twilio.Twilio | null = null;

if (accountSid && authToken) {
  client = twilio(accountSid, authToken);
}

// 存储验证码（生产环境应使用 Redis）
const verificationCodes = new Map<string, { code: string; expiresAt: number }>();

export const sendSMS = async (to: string, message: string): Promise<boolean> => {
  if (!client) {
    logger.warn('Twilio not configured, SMS not sent');
    return false;
  }

  try {
    await client.messages.create({
      body: message,
      from: fromPhone,
      to: to,
    });
    logger.info(`SMS sent to ${to}`);
    return true;
  } catch (error) {
    logger.error('SMS send failed:', error);
    return false;
  }
};

export const sendVerificationCode = async (phone: string): Promise<string | null> => {
  // 生成6位验证码
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  
  // 存储验证码，5分钟过期
  verificationCodes.set(phone, {
    code,
    expiresAt: Date.now() + 5 * 60 * 1000,
  });

  const message = `您的验证码是: ${code}，5分钟内有效。`;
  
  // 开发环境直接返回验证码
  if (process.env.NODE_ENV === 'development') {
    logger.info(`[DEV] Verification code for ${phone}: ${code}`);
    return code;
  }

  const sent = await sendSMS(phone, message);
  return sent ? code : null;
};

export const verifyCode = (phone: string, code: string): boolean => {
  const record = verificationCodes.get(phone);
  
  if (!record) {
    return false;
  }

  // 检查是否过期
  if (Date.now() > record.expiresAt) {
    verificationCodes.delete(phone);
    return false;
  }

  // 验证并删除
  if (record.code === code) {
    verificationCodes.delete(phone);
    return true;
  }

  return false;
};