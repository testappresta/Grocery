import { Router } from 'express';
import * as userController from '../controllers/userController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/profile', authenticate, userController.getProfile);
router.put('/profile', authenticate, userController.updateProfile);
router.get('/addresses', authenticate, userController.getAddresses);
router.post('/addresses', authenticate, userController.addAddress);
router.put('/addresses/:id', authenticate, userController.updateAddress);
router.delete('/addresses/:id', authenticate, userController.deleteAddress);
router.put('/addresses/:id/default', authenticate, userController.setDefaultAddress);

export default router;