import Cart from "../model/cart.model.js";
import Product from "../model/product.model.js";
import Order from "../model/order.model.js";

// Create Order
export const createOrder = async (req, res) => {
  try {
    const userId = req.userId.userId;
    const sellerId = req.body.item.product.sellerObjectId;
    

    if(!sellerId){
      return res.status(400).json({
        success: false,
        message: "Seller ID is required",
      });
    }    

    const {
      shippingAddress,
      paymentMethod = "cod",
    } = req.body;

    const item = req.body.item;
    console.log("item:", item);

    console.log("address:", shippingAddress);
    console.log("shippingAddress:", req.body);
    // Validate address
    if (
      !shippingAddress?.name ||
      !shippingAddress?.phone ||
      !shippingAddress?.address ||
      !shippingAddress?.state ||
      !shippingAddress?.pincode
    ) {
        console.log("error inside shipping");
        
      return res.status(400).json({
        success: false,
        message: "Complete shipping address is required",
      });
    }

    // Validate payment method
    const allowedMethods = [
      "cod",
      "upi",
      "netbanking",
      "debitcard",
      "creditcard",
    ];

    if (!allowedMethods.includes(paymentMethod)) {
        console.log("error in side allowmethod");
        
      return res.status(400).json({
        success: false,
        message: "Invalid payment method",
      });
    }
    

    // Get user's cart
    // const cart = await Cart.findOne({
    //   user: userId,
    // }).populate("items.product");

    // if (!cart || cart.items.length === 0) {
    //     console.log("error inside cart");
    //   return res.status(400).json({
    //     success: false,
    //     message: "Your cart is empty",
    //   });
    // }

    // Check products and calculate total
    const orderItems = [];
    let totalAmount = 0;

    // for (const item of cart.items) {

      const product = await Product.findById(
        item.product._id
      );


      if (!product) {
        console.log("error inside product");
        return res.status(404).json({
          success: false,
          message: `Product not found`,
        });
      }

      if (product.stock < item.quantity) {
        console.log("error inside stock");
        return res.status(400).json({
          success: false,
          message: `${product.name} is out of stock`,
        });
      }

      const itemTotal =
        product.price * item.quantity;

      totalAmount += itemTotal;

      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.image || "",
      });
    // }

    // Create order
    const order = await Order.create({
      user: userId,
      sellerId: sellerId,

      items: orderItems,

      shippingAddress,

      totalAmount,

      paymentMethod,

      paymentStatus: "pending",

      orderStatus: "pending",

      sellerConfirmation: "pending",
    });

    // For COD, order can be confirmed immediately
    if (paymentMethod === "cod") {
      order.orderStatus = "confirmed";

      await order.save();

      // Clear cart after order creation
      // cart.items = [];
      // await cart.save();

      return res.status(201).json({
        success: true,
        message: "Order placed successfully",
        order,
      });
    }

    // For online payment
    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      orderId: order._id,
      order,
    });
  } catch (error) {
    console.error("Create order error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get user's orders
export const getMyOrders = async (req, res) => {
  try {
    const userId = req.userId.userId;

    const orders = await Order.find({
      user: userId,
    })
      .populate("items.product")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Get orders error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get single order
export const getOrderById = async (req, res) => {
  try {
    const userId = req.userId.userId;
    const { orderId } = req.params;

    const order = await Order.findOne({
      _id: orderId,
      user: userId,
    }).populate("items.product");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Get order error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const userId = req.userId.userId;
    const { orderId } = req.params;
       

    const order = await Order.findOne({
      _id: orderId,
      user: userId,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.orderStatus = "cancelled";
    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      order,
    });
  } catch (error) {
    console.error("Cancel order error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.orderStatus = status;
    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.error("Update order status error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
