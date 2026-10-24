import express from "express";
import { cancelSellerOrder, deleteSeller, getProfile, getSellerDashboard,  newOrder,  SellerLogin, SellerLogout, SellerRegister, updateSellerOrderStatus } from './../controllers/seller.controller.js';
import { sellerrefreshToken, sellertokenVerification } from "../middleware/seller.middleware.js";

const sellerRouter = express.Router()

sellerRouter.post("/register", SellerRegister)
sellerRouter.post("/login", SellerLogin, sellertokenVerification)
sellerRouter.post("/refresh", sellerrefreshToken)
sellerRouter.post("/logout", SellerLogout)
sellerRouter.delete("/delete-seller", sellertokenVerification, deleteSeller)
sellerRouter.get("/new-orders/", sellertokenVerification, newOrder)
sellerRouter.get("/products/:sellerId", sellertokenVerification, getSellerDashboard)
sellerRouter.get("/seller-profile/:sellerId", sellertokenVerification, getProfile)
sellerRouter.put("/order/:orderId/status", sellertokenVerification, updateSellerOrderStatus)
sellerRouter.put("/order/:orderId/cancel", sellertokenVerification, cancelSellerOrder)

export default sellerRouter;