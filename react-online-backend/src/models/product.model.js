import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    sellerObjectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "seller",
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    originalPrice: {
        type: Number
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    images: {
        type: [String],
        required: true
    },
    discount: {
        type: Number,
        required: true
    },
    stock: {
        type: String,
        required: true
    }

});

const ProductModel = mongoose.model("Product", productSchema);

export default ProductModel;