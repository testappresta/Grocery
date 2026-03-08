import { Router } from 'express';
import * as userController from '../controllers/userController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, userController.getAddresses);
router.post('/', authenticate, userController.addAddress);
router.put('/:id', authenticate, userController.updateAddress);
router.delete('/:id', authenticate, userController.deleteAddress);
router.put('/:id/default', authenticate, userController.setDefaultAddress);

export default router;
