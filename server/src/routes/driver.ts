import { Router } from 'express';
import * as driverController from '../controllers/driverController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.get('/orders', authenticate, authorize('driver'), driverController.getAvailableOrders);
router.post('/orders/:id/accept', authenticate, authorize('driver'), driverController.acceptOrder);
router.put('/orders/:id/location', authenticate, authorize('driver'), driverController.updateLocation);
router.put('/orders/:id/status', authenticate, authorize('driver'), driverController.updateDeliveryStatus);
router.get('/earnings', authenticate, authorize('driver'), driverController.getEarnings);

export default router;