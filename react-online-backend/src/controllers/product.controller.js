import ImageKit from "@imagekit/nodejs";
import mongoose from "mongoose";
import ProductModel from "../model/product.model.js";

const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
})

export const AddProduct = async (req, res) => {

    try {

        const start = Date.now();
        
        const sellerId = req.params.sellerId;

        const images = req.files;

        const { name, description, originalPrice, price, category, stock, discount } = req.body;

        if (!name || !description || !price || !category || !images) {
            return res.status(400).json({ message: "All fields are required" });
        }

        console.log("Images received:", images.length);
        console.log("Starting ImageKit upload...");

        const imageKitStart = Date.now();

        const uploadResponse = await Promise.all(
            images.map((file) =>
                imagekit.files.upload({

                    file:file.buffer.toString("base64"),
                    fileName: `product_${Date.now()}_${file.originalname}`,
                    folder: "/products",
                })
            )
        );

        console.log(
            "ImageKit upload time:",
            (Date.now() - imageKitStart) / 1000,
            "seconds"
        );


        const imageUrls = uploadResponse.map((response) => response.url);

        const sellerObjectId = new mongoose.Types.ObjectId(sellerId);

        const newProduct = await ProductModel.create({
            name, description, originalPrice, price, category, stock, discount, images: imageUrls, sellerObjectId
        });

        console.log(
            "Total AddProduct time:",
            (Date.now() - start) / 1000,
            "seconds"
        );

        const io = req.app.get("io");

        io.to(`seller-${sellerId}`).emit("seller-notification", {
            type: "product-added",
            message: "Your product has been added successfully",
            productId: newProduct._id,
            productName: newProduct.name,
        });

        return res.status(201).json({
            message: "Product added successfully",
            product: newProduct,
        });

    } catch (error) {
        res.status(500).json({ message: "Error adding product" });
        console.log(error);

    }
};

export const getAllProducts = async (req, res) => {

    const products = await ProductModel.find();

    res.status(200).json({ message: "Products fetched successfully", products });

}

export const getproductById = async (req, res) => {

    const productId = req.params.id;

    const product = await ProductModel.findById(productId);

    if (!product) {
        return res.status(400).json({ message: "something wants wrong" })
    }

    return res.status(200).json(
        { message: "product fatch succesfully", product })
}

export const deleteProduct = async (req, res) => {

    try {
        const productId = req.body._id;

        const deletedProduct = await ProductModel.findByIdAndDelete(productId);

        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting product" });
        console.log(error);

    }
}

export const getSellerProducts = async (req, res) => {


    try {
        const sellerId = await req.params.sellerId;

        console.log("sellerId:" + sellerId);


        const sellerObjectId = new mongoose.Types.ObjectId(sellerId);


        const Allproducts = await ProductModel.find({ sellerObjectId: sellerObjectId });
        console.log(Allproducts);

        res.status(200).json({ message: "Products fetched successfully", products: Allproducts });
    } catch (error) {
        res.status(500).json({ message: "Error fetching products" });
        console.log(error);

    }
}