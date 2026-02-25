import cron from 'node-cron';
import Order from '../models/Order';
import Product from '../models/Product';
import { logger } from '../utils/logger';

// 每5分钟检查一次超时订单
cron.schedule('*/5 * * * *', async () => {
  logger.info('Checking for expired orders...');
  
  try {
    const expiredOrders = await Order.find({
      status: 'pending',
      createdAt: { $lt: new Date(Date.now() - 30 * 60 * 1000) }, // 30分钟前
    });

    for (const order of expiredOrders) {
      // 恢复库存
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.quantity, soldCount: -item.quantity },
        });
      }

      // 取消订单
      order.status = 'cancelled';
      await order.save();
      
      logger.info(`Order ${order.orderNumber} auto-cancelled due to timeout`);
    }

    if (expiredOrders.length > 0) {
      logger.info(`${expiredOrders.length} orders auto-cancelled`);
    }
  } catch (error) {
    logger.error('Error in order timeout cron job:', error);
  }
});

// 每天凌晨清理已取消的过期订单
cron.schedule('0 0 * * *', async () => {
  logger.info('Cleaning up old cancelled orders...');
  
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    const result = await Order.deleteMany({
      status: 'cancelled',
      updatedAt: { $lt: thirtyDaysAgo },
    });

    logger.info(`${result.deletedCount} old cancelled orders cleaned up`);
  } catch (error) {
    logger.error('Error cleaning up old orders:', error);
  }
});

export default cron;