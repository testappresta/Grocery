import { Router } from 'express';
import * as cartController from '../controllers/cartController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, cartController.getCart);
router.post('/items', authenticate, cartController.addToCart);
router.put('/items/:productId', authenticate, cartController.updateCartItem);
router.delete('/items/:productId', authenticate, cartController.removeFromCart);
router.delete('/', authenticate, cartController.clearCart);

export default router;