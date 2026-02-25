import winston from 'winston';

const { combine, timestamp, json, printf, colorize } = winston.format;

// 开发环境使用彩色输出
const devFormat = printf(({ level, message, timestamp, ...metadata }) => {
  let msg = `${timestamp} [${level}]: ${message}`;
  if (Object.keys(metadata).length > 0) {
    msg += ` ${JSON.stringify(metadata)}`;
  }
  return msg;
});

// 生产环境使用 JSON 格式
const prodFormat = combine(
  timestamp(),
  json()
);

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  defaultMeta: { service: 'grocery-delivery-api' },
  transports: [
    new winston.transports.Console({
      format: combine(
        colorize(),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        process.env.NODE_ENV === 'production' ? prodFormat : devFormat
      )
    }),
    // 生产环境添加文件日志
    ...(process.env.NODE_ENV === 'production' ? [
      new winston.transports.File({ 
        filename: 'logs/error.log', 
        level: 'error',
        format: prodFormat
      }),
      new winston.transports.File({ 
        filename: 'logs/combined.log',
        format: prodFormat
      })
    ] : [])
  ]
});