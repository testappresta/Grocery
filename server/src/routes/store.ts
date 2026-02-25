import { Router } from 'express';
import * as storeController from '../controllers/storeController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.get('/', storeController.getStores);
router.get('/nearby', storeController.getNearbyStores);
router.get('/:id', storeController.getStoreById);
router.post('/', authenticate, authorize('merchant', 'admin'), storeController.createStore);
router.put('/:id', authenticate, authorize('merchant', 'admin'), storeController.updateStore);
router.get('/:id/products', storeController.getStoreProducts);

export default router;