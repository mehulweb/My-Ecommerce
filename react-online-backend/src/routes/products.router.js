import express from 'express';
import { AddProduct, deleteProduct, getAllProducts, getproductById, getSellerProducts } from '../controllers/product.controller.js';
import { tokenVerification } from '../middleware/auth.middleware.js';
import upload from '../middleware/multer.middleware.js';

const productRouter = express.Router();

productRouter.post("/add-product/:sellerId", tokenVerification, upload.array("images"), AddProduct)
productRouter.get("/products", getAllProducts)
productRouter.get("/product/:id" , getproductById)
productRouter.get("/get-seller-products/:sellerId", tokenVerification, getSellerProducts)
productRouter.delete("/delete-product", tokenVerification, deleteProduct)

export default productRouter;