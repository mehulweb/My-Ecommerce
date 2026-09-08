import mongoose from "mongoose";

const sellerSchema = new mongoose.Schema({
    // sellerObjectId: {
    //         type: mongoose.Schema.Types.ObjectId,
    //         ref: "seller",
    //         required: true
    //     },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
    },
    bname: {
        type: String,
        unique: true,
        required: true
    },
    phone: {
        type: Number,
        unique: true,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    gst: {
        type: String,
        unique: true,
        required: true
    },
    category:{
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    terms: {
        type: Boolean,
        default: false
    }
}, {timestamps: true});


const SellerModel = mongoose.model('seller', sellerSchema);

export default SellerModel;