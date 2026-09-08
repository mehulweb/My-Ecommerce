import mongoose from "mongoose";
import addressModel from "../model/address.model.js";

export const userAddress = async (req, res) => {
    try {
        const userId = req.userId.userId;

        console.log("userId:", userId);
        console.log("body:", req.body);

        if (!userId) {
            return res.status(401).json({
                message: "Please login and try again"
            });
        }

        const {
            name,
            phone,
            address,
            state,
            country,
            pincode,
            type
        } = req.body;

        if (
            !name ||
            !phone ||
            !address ||
            !state ||
            !country ||
            !pincode ||
            !type
        ) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                message: "Invalid user ID"
            });
        }

        const userObjectId =
            new mongoose.Types.ObjectId(userId);

        const savedAddress =
            await addressModel.create({
                name,
                phone,
                address,
                state,
                country,
                pincode,
                type,
                userObjectId
            });

        return res.status(201).json({
            success: true,
            message: "Address saved",
            address: savedAddress
        });

    } catch (err) {
        console.error("Address error:", err);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err.message
        });
    }
};

export const getAddress = async (req, res) => {
  try {
    const userId = req.userId.userId;

    console.log("userId:", userId);

    if (!userId) {
      return res.status(401).json({
        message: "Please login and try again",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        message: "Invalid user ID",
      });
    }

    const userObjectId =
      new mongoose.Types.ObjectId(userId);

    const address = await addressModel.find({
      userObjectId: userObjectId,
    });

    console.log("address:", address);

    return res.status(200).json({
      success: true,
      message: "Address fetched successfully",
      data: address,
    });
  } catch (error) {
    console.error("Error fetching address:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch address",
    });
  }
};