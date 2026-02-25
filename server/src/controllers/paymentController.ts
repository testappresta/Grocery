import { Request, Response } from 'express';
import Stripe from 'stripe';
import Order from '../models/Order';
import { asyncHandler } from '../middleware/errorHandler';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16'
});

// 创建支付意图
export const createPaymentIntent = asyncHandler(async (req: Request, res: Response) => {
  const { orderId } = req.body;
  
  const order = await Order.findOne({
    _id: orderId,
    customer: req.userId,
    paymentStatus: 'pending'
  });
  
  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found or already paid'
    });
  }
  
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(order.total * 100), // 转换为分
    currency: 'eur', // 根据你的地区调整
    metadata: {
      orderId: order._id.toString()
    }
  });
  
  res.json({
    success: true,
    data: {
      clientSecret: paymentIntent.client_secret
    }
  });
});

// 确认支付
export const confirmPayment = asyncHandler(async (req: Request, res: Response) => {
  const { paymentIntentId } = req.body;
  
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
  
  if (paymentIntent.status === 'succeeded') {
    const orderId = paymentIntent.metadata.orderId;
    
    await Order.findByIdAndUpdate(orderId, {
      paymentStatus: 'paid',
      status: 'confirmed'
    });
    
    res.json({
      success: true,
      message: 'Payment confirmed'
    });
  } else {
    res.status(400).json({
      success: false,
      message: 'Payment not successful'
    });
  }
});

// 处理 Stripe Webhook
export const handleWebhook = asyncHandler(async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
  let event;
  
  try {
    event = stripe.webhooks.constructEvent(req.body, sig!, endpointSecret!);
  } catch (err: any) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  
  // 处理支付成功事件
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const orderId = paymentIntent.metadata.orderId;
    
    await Order.findByIdAndUpdate(orderId, {
      paymentStatus: 'paid',
      status: 'confirmed'
    });
    
    // TODO: 发送通知给商家
  }
  
  res.json({ received: true });
});