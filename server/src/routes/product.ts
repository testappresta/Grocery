import { Router } from 'express';
import { body, param, query } from 'express-validator';
import * as productController from '../controllers/productController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// 公开路由
router.get('/', productController.getProducts);
router.get('/search', productController.searchProducts);
router.get('/featured', productController.getFeaturedProducts);
router.get('/:id', param('id').isMongoId(), productController.getProductById);

// 需要登录的路由
router.post(
  '/',
  authenticate,
  authorize('merchant', 'admin'),
  [
    body('name').notEmpty(),
    body('price').isFloat({ min: 0 }),
    body('stock').isInt({ min: 0 }),
    body('category').isMongoId(),
    body('unit').notEmpty()
  ],
  productController.createProduct
);

router.put(
  '/:id',
  authenticate,
  authorize('merchant', 'admin'),
  productController.updateProduct
);

router.delete(
  '/:id',
  authenticate,
  authorize('merchant', 'admin'),
  productController.deleteProduct
);

export default router;