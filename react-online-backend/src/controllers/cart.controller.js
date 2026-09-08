import cart from "../model/cart.model.js";
import Product from "../model/product.model.js";

// Add product to cart
export const addToCart = async (req, res) => {
    try {
        const { productId, quantity = 1 } = req.body;
        const userId = req.user.id;

        if (!productId) {
            return res.status(400).json({
                success: false,
                message: "Product ID is required",
            });
        }

        if (quantity < 1) {
            return res.status(400).json({
                success: false,
                message: "Quantity must be at least 1",
            });
        }

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        if (product.stock < quantity) {
            return res.status(400).json({
                success: false,
                message: "Insufficient stock",
            });
        }

        let cart = await cart.findOne({ user: userId });

        if (!cart) {
            cart = await cart.create({
                user: userId,
                items: [
                    {
                        product: productId,
                        quantity,
                    },
                ],
            });
        } else {
            const existingItem = cart.items.find(
                (item) =>
                    item.product.toString() === productId
            );

            if (existingItem) {
                const newQuantity =
                    existingItem.quantity + quantity;

                if (product.stock < newQuantity) {
                    return res.status(400).json({
                        success: false,
                        message: "Insufficient stock",
                    });
                }

                existingItem.quantity = newQuantity;
            } else {
                cart.items.push({
                    product: productId,
                    quantity,
                });
            }

            await cart.save();
        }

        await cart.populate("items.product");

        return res.status(200).json({
            success: true,
            message: "Product added to cart",
            cart,
        });
    } catch (error) {
        console.error("Add to cart error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};


// Get user's cart
export const getCart = async (req, res) => {
    try {
        const userId = req.user.id;

        const cart = await cart.findOne({
            user: userId,
        }).populate("items.product");

        if (!cart) {
            return res.status(200).json({
                success: true,
                cart: {
                    items: [],
                },
            });
        }

        return res.status(200).json({
            success: true,
            cart,
        });
    } catch (error) {
        console.error("Get cart error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};


// Update cart item quantity
export const updateCartQuantity = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.user.id;

        if (!productId || quantity === undefined) {
            return res.status(400).json({
                success: false,
                message:
                    "Product ID and quantity are required",
            });
        }

        if (quantity < 1) {
            return res.status(400).json({
                success: false,
                message: "Quantity must be at least 1",
            });
        }

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        if (product.stock < quantity) {
            return res.status(400).json({
                success: false,
                message: "Insufficient stock",
            });
        }

        const cart = await cart.findOne({
            user: userId,
        });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found",
            });
        }

        const item = cart.items.find(
            (item) =>
                item.product.toString() === productId
        );

        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Product not found in cart",
            });
        }

        item.quantity = quantity;

        await cart.save();
        await cart.populate("items.product");

        return res.status(200).json({
            success: true,
            message: "Cart updated successfully",
            cart,
        });
    } catch (error) {
        console.error(
            "Update cart quantity error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};


// Remove product from cart
export const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.user.id;

        const cart = await cart.findOne({
            user: userId,
        });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found",
            });
        }

        const itemExists = cart.items.some(
            (item) =>
                item.product.toString() === productId
        );

        if (!itemExists) {
            return res.status(404).json({
                success: false,
                message: "Product not found in cart",
            });
        }

        cart.items = cart.items.filter(
            (item) =>
                item.product.toString() !== productId
        );

        await cart.save();
        await cart.populate("items.product");

        return res.status(200).json({
            success: true,
            message: "Product removed from cart",
            cart,
        });
    } catch (error) {
        console.error(
            "Remove from cart error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};


// Clear entire cart
export const clearCart = async (req, res) => {
    try {
        const userId = req.user.id;

        const cart = await cart.findOne({
            user: userId,
        });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found",
            });
        }

        cart.items = [];

        await cart.save();

        return res.status(200).json({
            success: true,
            message: "Cart cleared successfully",
            cart,
        });
    } catch (error) {
        console.error("Clear cart error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};