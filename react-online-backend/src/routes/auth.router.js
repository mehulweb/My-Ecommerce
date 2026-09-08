import express from "express";
import { refreshToken, tokenVerification } from "../middleware/auth.middleware.js";
import { changePassword, deleteAccount, getUserProfile, registerUser, updateUser, userLogin, userLogout, verifyOtp } from './../controllers/auth.controller.js';



const router = express.Router()

router.post("/register", registerUser)
router.post("/login", userLogin)
router.post("/verify-otp", verifyOtp)
router.post("/refresh", refreshToken)
router.post("/logout", userLogout)
router.get("/profile", tokenVerification, getUserProfile)

router.delete("/delete/:id", tokenVerification, deleteAccount)
router.patch("/update", tokenVerification, updateUser)
router.patch("/changepassword", tokenVerification, changePassword)





export default router;