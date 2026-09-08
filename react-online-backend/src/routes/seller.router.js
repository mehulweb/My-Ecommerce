import express from "express";
import { cancelSellerOrder, deleteSeller, getProfile, getSellerDashboard,  SellerLogin, SellerLogout, SellerRegister, updateSellerOrderStatus } from './../controllers/seller.controller.js';
import { refreshToken, tokenVerification } from "../middleware/auth.middleware.js";

const sellerRouter = express.Router()

sellerRouter.post("/register", SellerRegister)
sellerRouter.post("/login", SellerLogin, tokenVerification)
sellerRouter.post("/refresh", refreshToken)
sellerRouter.post("/logout", SellerLogout)
sellerRouter.delete("/delete-seller", tokenVerification, deleteSeller)
// sellerRouter.get("/new-orders/:sellerId", tokenVerification, newOrder)
sellerRouter.get("/products/:sellerId", tokenVerification, getSellerDashboard)
sellerRouter.get("/seller-profile/:sellerId", tokenVerification, getProfile)
sellerRouter.put("/order/:orderId/status", tokenVerification, updateSellerOrderStatus)
sellerRouter.put("/order/:orderId/cancel", tokenVerification, cancelSellerOrder)

export default sellerRouter;