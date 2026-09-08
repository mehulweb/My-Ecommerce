import express from "express";

import {
  createPayment,
  verifyPayment,
} from "../controllers/payment.controller.js";

import { tokenVerification } from "../middleware/auth.middleware.js";



const paymentRouter = express.Router();

// Create Razorpay order
paymentRouter.post("/create", tokenVerification, createPayment);

// Verify Razorpay payment
paymentRouter.post("/verify", tokenVerification, verifyPayment);

export default paymentRouter;