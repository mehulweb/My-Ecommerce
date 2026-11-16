import mongoose from "mongoose";

const checkoutSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    source: {
      type: String,
      enum: ["buy_now", "cart"],
      required: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        sellerId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User", // Ya 'Seller', jo bhi tumhare Product model mein hai
          required: true,
        },
        name: String,
        price: Number,
        quantity: { type: Number, required: true, min: 1 },
        image: String,
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 60 * 60 * 1000), // 1 ghante baad auto-delete
      index: { expires: 0 },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Checkout", checkoutSchema);