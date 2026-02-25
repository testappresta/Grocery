import { Router } from 'express';
import * as reviewController from '../controllers/reviewController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.get('/', reviewController.getReviews);
router.get('/store/:storeId/stats', reviewController.getStoreReviewStats);
router.post('/', authenticate, reviewController.createReview);
router.post('/:id/reply', authenticate, authorize('merchant', 'admin'), reviewController.replyToReview);

export default router;