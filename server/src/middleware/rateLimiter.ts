import { Request, Response, NextFunction } from 'express';
import { RateLimiterRedis, RateLimiterMemory } from 'rate-limiter-flexible';
import Redis from 'ioredis';

// 如果没有 Redis，使用内存限制器
const createRateLimiter = () => {
  const opts = {
    keyPrefix: 'grocery_api',
    points: 100, // 每 15 分钟 100 个请求
    duration: 15 * 60,
  };
  
  if (process.env.REDIS_URL) {
    const redisClient = new Redis(process.env.REDIS_URL);
    return new RateLimiterRedis({
      ...opts,
      storeClient: redisClient
    });
  }
  
  return new RateLimiterMemory(opts);
};

const rateLimiter = createRateLimiter();

export const rateLimiterMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const key = req.ip || 'unknown';
    await rateLimiter.consume(key);
    next();
  } catch (rejRes) {
    res.status(429).json({
      success: false,
      message: 'Too many requests, please try again later'
    });
  }
};