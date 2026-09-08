import SellerModel from "../model/seller.model.js";
import bcrypt from 'bcryptjs';
import ImageKit from "@imagekit/nodejs";
import jwt from "jsonwebtoken";
import ProductModel from "../model/product.model.js";
import mongoose from "mongoose";
import Order from "../model/order.model.js";


export const SellerRegister = async (req, res) => {

    try {
        const { firstName, lastName, bname, email, phone, category, gst, terms, password } = req.body.form;

        const isSellerExist = await SellerModel.findOne({ email, phone });

        if (isSellerExist) {
            return res.status(400).json({ message: "Seller already exist" });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const newSeller = await SellerModel.create({ firstName, lastName, bname, email, phone, category, gst, terms, password: hashPassword });

        res.status(201).json({ message: "Seller created successfully", seller: newSeller });
    } catch (error) {
        res.status(500).json({ message: "Error creating seller" });
        console.log(error);
    }
}

export const SellerLogin = async (req, res) => {

    try {

        const { email, password } = req.body;

        const seller = await SellerModel.findOne({ email: email });

        if (!seller) {
            return res.status(400).json({ message: "Seller not found" });
        }

        const isPasswordValid = await bcrypt.compare(password, seller.password);

        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid password" });
        }


        const token = jwt.sign({ id: seller._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        const refreshToken = jwt.sign({ id: seller._id }, process.env.JWT_SECRET, { expiresIn: "1h" });


        const sellerId = seller._id

        res.cookie("refreshtoken", refreshToken);

        res.cookie("token", token);

        res.status(200).json({
            message: "login succesfully",
            sellerId,
            token
        });


    } catch (error) {
        res.status(500).json();
        console.log(error);

    }
}

export const SellerLogout = async (req, res) => {
    try {
        res.clearCookie("token");
        res.clearCookie("refreshtoken");
        res.status(200).json({ message: "Seller logged out successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error logging out seller" });
    }
}

export const getProfile = async (req, res) => {

    try {
        const sellerId = await req.params.sellerId;

        const seller = await SellerModel.findById(sellerId);

        res.status(200).json({ message: "profile fatch successfully", seller });
    } catch (error) {
        res.status(500).json({ message: "Error fetching user profile" });
    }
}

export const getSellerDashboard = async (req, res) => {
        const sellerId = await req.params.sellerId;

        const sellerOdjectId = new mongoose.Types.ObjectId(sellerId);

        try{
            if (!sellerOdjectId) {
                return res.status(400).json({ message: "Seller ID is required" });
            }

            const products = await ProductModel.find({ sellerObjectId: sellerOdjectId });

            if (!products) {
                return res.status(404).json({ message: "No products found for this seller" });
            }

            const newOrders = await Order.find({ sellerId: sellerId, sellerConfirmation: "pending" });

            if(!newOrders) {
                return res.status(404).json({ message: "No new orders found for this seller" });
            }

            const monthlyRevenue = await Order.aggregate([
                {
                    $match: {
                        sellerId: sellerId,
                        orderDate: {
                            $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                            $lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)
                        }
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalRevenue: { $sum: "$totalAmount" }
                    }
                }
            ]);

            if (!monthlyRevenue) {
                return res.status(404).json({ message: "No revenue data found for this seller" });
            }

            res.status(200).json({ message: "Products fetched successfully", products, newOrders, monthlyRevenue });

        }catch (err){
            console.error("Error fetching products:", err);
            res.status(500).json({ message: "Error fetching products" });
        }
}

export const deleteSeller = async (req, res) => {

    try {
        const sellerId = req.body._id;

        await SellerModel.findByIdAndDelete(sellerId);

        res.status(200).json({ message: "Seller deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting seller" });
    }
}

// export const newOrder = async (req, res) => {

//     const sellerId = await req.params.sellerId;

//     try {
//         const orders = await Order.find({ sellerId: sellerId });

//         if (!orders) {
//             return res.status(404).json({ message: "No orders found for this seller" });
//         }

//         if (orders.some(order => order.sellerConfirmation === "pending" || order.sellerConfirmation === "confirmed" || order.sellerConfirmation === "shipped" || order.sellerConfirmation === "delivered" || order.sellerConfirmation === "cancelled")) {
//             res.status(200).json({ message: "Orders fetched successfully", orders });
//         }

//     } catch (error) {
//         console.error("Error fetching orders:", error);
//         res.status(500).json({ message: "Error fetching orders" });
//     }
    
// }

export const updateSellerOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        console.log("orderId:", orderId);
        console.log("status:", status);

        const order = await Order.findById(orderId);
        
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if(status === "confirmed") {
            order.sellerConfirmation = status;
            await order.save();
            return res.status(200).json({ message: "Order status updated successfully", order });
        }
        
        // order.sellerConfirmation = status;
        // await order.save();

        // res.status(200).json({ message: "Order status updated successfully", order });
    } catch (error) {
        console.error("Error updating order status:", error);
        res.status(500).json({ message: "Error updating order status" });
    }
}

export const cancelSellerOrder = async (req, res) => {
    const { orderId } = req.params;

    try {
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        order.sellerConfirmation = "cancelled";
        await order.save();
        res.status(200).json({ message: "Order cancelled successfully", order });
    } catch (error) {
        console.error("Error cancelling order:", error);
        res.status(500).json({ message: "Error cancelling order" });
    }
}

