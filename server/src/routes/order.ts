import { Router } from 'express';
import * as orderController from '../controllers/orderController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, orderController.getOrders);
router.get('/:id', authenticate, orderController.getOrderById);
router.post('/', authenticate, orderController.createOrder);
router.put('/:id/status', authenticate, orderController.updateOrderStatus);
router.put('/:id/cancel', authenticate, orderController.cancelOrder);

export default router;