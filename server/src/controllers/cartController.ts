import { Request, Response } from 'express';
import Cart from '../models/Cart';
import Product from '../models/Product';
import { asyncHandler } from '../middleware/errorHandler';

// 获取购物车
export const getCart = asyncHandler(async (req: Request, res: Response) => {
  const cart = await Cart.findOne({ user: req.userId })
    .populate('items.product', 'name images price stock');
  
  if (!cart) {
    return res.json({
      success: true,
      data: { cart: { items: [], total: 0 } }
    });
  }
  
  res.json({
    success: true,
    data: { cart }
  });
});

// 添加到购物车
export const addToCart = asyncHandler(async (req: Request, res: Response) => {
  const { productId, quantity = 1 } = req.body;
  
  const product = await Product.findById(productId);
  
  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }
  
  if (product.stock < quantity) {
    return res.status(400).json({
      success: false,
      message: 'Insufficient stock'
    });
  }
  
  let cart = await Cart.findOne({ user: req.userId });
  
  if (!cart) {
    cart = new Cart({
      user: req.userId,
      store: product.store,
      items: [],
      total: 0
    });
  }
  
  // 检查是否只能添加同一店铺的商品
  if (cart.store && cart.store.toString() !== product.store.toString() && cart.items.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Can only add products from the same store'
    });
  }
  
  // 查找是否已存在
  const itemIndex = cart.items.findIndex(
    item => item.product.toString() === productId
  );
  
  if (itemIndex > -1) {
    // 更新数量
    cart.items[itemIndex].quantity += quantity;
    cart.items[itemIndex].total = cart.items[itemIndex].quantity * product.price;
  } else {
    // 添加新商品
    cart.items.push({
      product: product._id,
      name: product.name,
      image: product.images[0],
      price: product.price,
      quantity,
      unit: product.unit,
      total: quantity * product.price
    });
  }
  
  // 更新店铺和总价
  cart.store = product.store;
  cart.total = cart.items.reduce((sum, item) => sum + item.total, 0);
  
  await cart.save();
  
  res.json({
    success: true,
    message: 'Added to cart',
    data: { cart }
  });
});

// 更新购物车商品
export const updateCartItem = asyncHandler(async (req: Request, res: Response) => {
  const { quantity } = req.body;
  const { productId } = req.params;
  
  const cart = await Cart.findOne({ user: req.userId });
  
  if (!cart) {
    return res.status(404).json({
      success: false,
      message: 'Cart not found'
    });
  }
  
  const itemIndex = cart.items.findIndex(
    item => item.product.toString() === productId
  );
  
  if (itemIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Item not found in cart'
    });
  }
  
  if (quantity <= 0) {
    // 移除商品
    cart.items.splice(itemIndex, 1);
  } else {
    // 更新数量
    cart.items[itemIndex].quantity = quantity;
    cart.items[itemIndex].total = quantity * cart.items[itemIndex].price;
  }
  
  // 更新总价
  cart.total = cart.items.reduce((sum, item) => sum + item.total, 0);
  
  // 如果购物车为空，清空店铺
  if (cart.items.length === 0) {
    cart.store = undefined;
  }
  
  await cart.save();
  
  res.json({
    success: true,
    message: 'Cart updated',
    data: { cart }
  });
});

// 从购物车移除
export const removeFromCart = asyncHandler(async (req: Request, res: Response) => {
  const { productId } = req.params;
  
  const cart = await Cart.findOne({ user: req.userId });
  
  if (!cart) {
    return res.status(404).json({
      success: false,
      message: 'Cart not found'
    });
  }
  
  cart.items = cart.items.filter(
    item => item.product.toString() !== productId
  );
  
  cart.total = cart.items.reduce((sum, item) => sum + item.total, 0);
  
  if (cart.items.length === 0) {
    cart.store = undefined;
  }
  
  await cart.save();
  
  res.json({
    success: true,
    message: 'Item removed',
    data: { cart }
  });
});

// 清空购物车
export const clearCart = asyncHandler(async (req: Request, res: Response) => {
  await Cart.findOneAndDelete({ user: req.userId });
  
  res.json({
    success: true,
    message: 'Cart cleared'
  });
});