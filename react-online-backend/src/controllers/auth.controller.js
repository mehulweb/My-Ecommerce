import UserModel from "../model/user.model.js";
import emailservice from "../services/email.service.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const registerUser = async (req, res) => {

    try {

        console.log(req.body);

        const { username, email, password, role } = req.body;

        const existingUser = await UserModel.findOne({ email });

        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }

        const hash = await bcrypt.hash(password, 10);
        const otp = Math.floor(100000 + Math.random() * 900000);

        const pendingUser = await PendingModel.create({ username, email, password: hash, role, otp });

        await emailservice.sendOtp(email, username, otp);

        res.status(200).json({ message: "OTP sent to email" });

    } catch (error) {
        res.status(400).json({ message: "Error registering user" });
        console.log("error:", error);
    }
};

export const verifyOtp = async (req, res) => {

    try {
        console.log("verifyOtp called with body:", req.body);
        const { email, otp } = req.body;
        const user = await PendingModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (user.otp !== otp) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        user.isVerified = true;
        await user.save();

        const newUser = await UserModel.create({ email: user.email, username: user.username, password: user.password, role: user.role });

        const deletePendingUser = await PendingModel.deleteOne({ email: user.email });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '3d' });

        res.cookie("token", token)

        res.status(201).json({ message: "User registered successfully", token });

        await emailservice.sendRegistrationEmail(email, user.username);

    } catch (error) {
        res.status(500).json({ message: "Error verifying OTP" });
    }
};

export const userLogin = async (req, res) => {

    try {
        const { email, password } = req.body

        const isUserExist = await UserModel.findOne({ email })

        if (!isUserExist) {
            return res.status(401).json({ message: "Email or passsword is Invalid" })
        }

        const isVaildPasword = await bcrypt.compare(password, isUserExist.password)

        if (!isVaildPasword) {
            return res.status(401).json({ message: "Email or passsword is Invalid" })
        }

        const token = jwt.sign({ userId: isUserExist._id }, process.env.JWT_SECRET, { expiresIn: "1h" })

        const refreshToken = jwt.sign({ userId: isUserExist._id }, process.env.JWT_SECRET, { expiresIn: "7d" })

        const userId = isUserExist._id;

        res.cookie("token", token)
        res.cookie("refreshtoken", refreshToken)

        res.status(200).json({ message: "Login successful", token, userId })
    }
    catch (error) {
        res.status(500).json({ message: "Error logging in user" })
    }

};

export const userLogout = async (req, res) => {

    res.clearCookie("token")
    res.clearCookie("refreshtoken")
    res.status(200).json({ message: "Logout successful" })

};

export const getUserProfile = async (req, res) => {

    try {
        const userId = await req.userId;
        const user = await UserModel.findById(userId);
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: "Error fetching user profile" });
    }

};

export const deleteAccount = async (req, res) => {

    try {
        const userId = await req.params.id;
        await UserModel.findByIdAndDelete(userId);
        res.clearCookie("token")
        res.clearCookie("refreshtoken")
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting user" });
        console.log("err:" + error);
    }

};

export const updateUser = async (req, res) => {

    try {
        const userId = req.userId;
        const { username } = req.body;
        const updateUser = await UserModel.findByIdAndUpdate(userId, { username })
        res.status(200).json({ message: "User updated successfully", user: updateUser });
    } catch (error) {
        res.status(500).json({ message: "Error updating user" });
    }
};

export const changePassword = async (req, res) => {

    try {
        const userId = req.userId;
        const { oldPassword, newPassword, confirmPassword } = req.body;

        const isUserExist = await UserModel.findById(userId);

        if (!isUserExist) {
            return res.status(404).json({ message: "User not found" });
        }

        const isVaildPassword = await bcrypt.compare(oldPassword, isUserExist.password);

        if (!isVaildPassword) {
            return res.status(401).json({ message: "Old password is incorrect" });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: "New password and confirm password do not match" });
        }

        const hash = await bcrypt.hash(newPassword, 10);

        await UserModel.findByIdAndUpdate(userId, { password: hash });

        res.status(200).json({ message: "Password changed successfully" });

    } catch (error) {
        res.status(500).json({ message: "Error changing password" });
    }

};






