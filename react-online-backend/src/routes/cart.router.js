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

cartRouter.post("/addcart", tokenVerification, addToCart);

cartRouter.get("/getCartItems", tokenVerification, getCart);

cartRouter.patch("/updateCart", tokenVerification, updateCartQuantity);

cartRouter.delete("/deleteCartItem/:productId", tokenVerification, removeFromCart);

cartRouter.delete("/clearCart", tokenVerification, clearCart);

export default cartRouter;