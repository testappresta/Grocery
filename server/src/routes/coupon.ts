import { Router } from 'express';
import * as couponController from '../controllers/couponController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, couponController.getAvailableCoupons);
router.get('/my', authenticate, couponController.getMyCoupons);
router.post('/claim', authenticate, couponController.claimCoupon);
router.post('/validate', authenticate, couponController.validateCoupon);
router.post('/use', authenticate, couponController.useCoupon);

export default router;