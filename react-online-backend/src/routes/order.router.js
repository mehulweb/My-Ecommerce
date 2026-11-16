import express from "express";

import {
  cancelOrder,
  createOrder,
  getCheckoutDetails,
  getMyOrders,
  getOrderById,
  initCheckout,
  updateOrderStatus,
} from "../controllers/order.controller.js";

import { tokenVerification } from "./../middleware/auth.middleware.js";

const orderRouter = express.Router();

// Initialize checkout session (Buy Now or Cart)
orderRouter.post("/checkout/init", tokenVerification, initCheckout);

// Get checkout session details for Address page
orderRouter.get("/checkout/:checkoutId", tokenVerification, getCheckoutDetails);

// Create new order
orderRouter.post("/", tokenVerification, createOrder);

// Get logged-in user's orders
orderRouter.get("/me", tokenVerification, getMyOrders);

// Get single order
orderRouter.get("/:orderId", tokenVerification, getOrderById);

// Cancel order
orderRouter.put("/cancel/:orderId", tokenVerification, cancelOrder);

// Update order status
orderRouter.put("/status/:orderId", tokenVerification, updateOrderStatus);

export default orderRouter;