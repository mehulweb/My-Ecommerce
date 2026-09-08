import express from 'express';
import { tokenVerification } from '../middleware/auth.middleware.js';
import { deleteUserByAdmin, getAllUsers } from './../controllers/admin.controller.js';

const adminRouter =  express.Router();

adminRouter.get("/allusers", tokenVerification, getAllUsers);
adminRouter.delete("/delete", tokenVerification, deleteUserByAdmin);

export default adminRouter;

