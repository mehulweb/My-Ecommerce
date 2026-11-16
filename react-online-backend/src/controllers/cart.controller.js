import mongoose from "mongoose";
import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";

// Add product to cart
export const addToCart = async (req, res) => {
  try {
    const userId = req.userId?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized user",
      });
    }

    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart items are required",
      });
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({
        user: userId,
        items: [],
      });
    }

    for (const item of items) {
      const { _id, quantity = 1 } = item;

      if (
        !_id ||
        !mongoose.Types.ObjectId.isValid(_id) ||
        !Number.isInteger(Number(quantity)) ||
        Number(quantity) < 1
      ) {
        return res.status(400).json({
          success: false,
          message: "Valid product ID and quantity are required",
        });
      }

      const qty = Number(quantity);

      const product = await Product.findById(_id);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${_id}`,
        });
      }

      const stock = Number(product.stock);

      const existingItem = cart.items.find(
        (cartItem) =>
          cartItem.product.toString() === product._id.toString()
      );

      // Frontend sends the complete updated cart,
      // so replace quantity instead of incrementing.
      if (qty > stock) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}`,
        });
      }

      if (existingItem) {
        existingItem.quantity = qty;
      } else {
        cart.items.push({
          product: product._id,
          quantity: qty,
        });
      }
    }

    await cart.save();
    await cart.populate("items.product");

    return res.status(200).json({
      success: true,
      message: "Cart updated successfully",
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
        const userId = req.userId.userId;

        const cart = await Cart.findOne({
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
    const userId = req.userId?.userId;

    // Check authentication
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized user",
      });
    }

    // Validate product ID and quantity
    if (
      !productId ||
      !mongoose.Types.ObjectId.isValid(productId) ||
      !Number.isInteger(Number(quantity)) ||
      Number(quantity) < 1
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid product ID and quantity are required",
      });
    }

    const qty = Number(quantity);

    // Find product
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check stock
    if (Number(product.stock) < qty) {
      return res.status(400).json({
        success: false,
        message: "Insufficient stock",
      });
    }

    // Find user's cart
    const cart = await Cart.findOne({
      user: userId,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    // Find cart item
    const item = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Product not found in cart",
      });
    }

    // Update quantity
    item.quantity = qty;

    await cart.save();
    await cart.populate("items.product");

    return res.status(200).json({
      success: true,
      message: "Cart updated successfully",
      cart,
    });

  } catch (error) {
    console.error("Update cart quantity error:", error);

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
        console.log("productId", productId);
        const userId = req.userId.userId;

        const cart = await Cart.findOne({
            user: userId,
        });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found",
            });
        }

        console.log("cart", cart.items);

        const productid = new mongoose.Types.ObjectId(productId).toString();

        console.log("product id", productid);


        const itemExists = cart.items.find(
            (item) =>
                console.log("item.product", item.product) ||
                item.product.toString() === productid
        );

        if (!itemExists) {
            return res.status(404).json({
                success: false,
                message: "Product not found in cart",
            });
        }

        cart.items = cart.items.filter(
            (item) => {
                console.log("hahhahahhh", item.product.toString())
                return item.product.toString() !== productId
            }
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
        const userId = req.userId.userId;

        const cart = await Cart.findOne({
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