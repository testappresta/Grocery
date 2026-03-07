import { Router } from 'express';
import * as farmController from '../controllers/farmController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', farmController.getFarm);
router.post('/plant', farmController.plantCrop);
router.post('/harvest', farmController.harvestCrop);
router.post('/harvest-all', farmController.harvestAll);
router.post('/check-in', farmController.dailyCheckIn);
router.get('/rewards', farmController.getRewards);
router.post('/rewards/redeem', farmController.redeemReward);
router.get('/rewards/history', farmController.getRedemptionHistory);

export default router;
