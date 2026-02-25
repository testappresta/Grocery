import { Router } from 'express';
import * as paymentController from '../controllers/paymentController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/create-intent', authenticate, paymentController.createPaymentIntent);
router.post('/confirm', authenticate, paymentController.confirmPayment);
router.post('/webhook', paymentController.handleWebhook);

export default router;