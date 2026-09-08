import express from 'express';
import { getAddress, userAddress } from '../controllers/address.controller.js';
import { tokenVerification } from '../middleware/auth.middleware.js';

const addressRouter = express.Router();

addressRouter.post("/add-address", tokenVerification, userAddress);
addressRouter.get("/user/address", tokenVerification, getAddress);

export default addressRouter;