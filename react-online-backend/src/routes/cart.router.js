import express from "express";

import {
  addToCart,
  getCart,
  updateCartQuantity,
  removeFromCart,
  clearCart,
} from "../controllers/cart.controller.js";

import { tokenVerification } from './../middleware/auth.middleware.js';



const cartRouter = express.Router();

cartRouter.post("/", tokenVerification, addToCart);

cartRouter.get("/", tokenVerification, getCart);

cartRouter.patch("/quantity", tokenVerification, updateCartQuantity);

cartRouter.delete("/:productId", tokenVerification, removeFromCart);

cartRouter.delete("/", tokenVerification, clearCart);

export default cartRouter;