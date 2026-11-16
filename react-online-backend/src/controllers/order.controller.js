import Checkout from "../models/checkout.model.js";
import Order from "../models/order.model.js";
import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";

// ==========================================
// 1. INIT CHECKOUT (Buy Now ya Cart se ID banana)
// ==========================================
export const initCheckout = async (req, res) => {
  try {
    const userId = req.userId.userId;
    const { source, productId, quantity = 1 } = req.body;

    let checkoutItems = [];
    let totalAmount = 0;

    if (source === "buy_now") {
      // Single Product Buy Now
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ success: false, message: "Product not found" });
      }
      if (product.stock < quantity) {
        return res.status(400).json({ success: false, message: `${product.name} is out of stock` });
      }

      checkoutItems.push({
        product: product._id,
        sellerId: product.sellerObjectId, // Tumhare Product model wala field
        name: product.name,
        price: product.price,
        quantity,
        image: product.image || "",
      });

      totalAmount = product.price * quantity;

    } else if (source === "cart") {
      // Cart ke saare items
      const cart = await Cart.findOne({ user: userId }).populate("items.product");
      if (!cart || cart.items.length === 0) {
        return res.status(400).json({ success: false, message: "Your cart is empty" });
      }

      for (const item of cart.items) {
        const product = item.product;
        if (!product) continue;

        if (product.stock < item.quantity) {
          return res.status(400).json({
            success: false,
            message: `${product.name} has insufficient stock`,
          });
        }

        checkoutItems.push({
          product: product._id,
          sellerId: product.sellerObjectId,
          name: product.name,
          price: product.price,
          quantity: item.quantity,
          image: product.image || "",
        });

        totalAmount += product.price * item.quantity;
      }
    } else {
      return res.status(400).json({ success: false, message: "Invalid checkout source" });
    }

    // Checkout session save karo aur ID bhej do
    const checkout = await Checkout.create({
      user: userId,
      source,
      items: checkoutItems,
      totalAmount,
    });

    return res.status(201).json({
      success: true,
      checkoutId: checkout._id,
      checkout, // Address page par summary dikhane ke liye kaam aayega
    });
  } catch (error) {
    console.error("Init checkout error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ==========================================
// 2. GET CHECKOUT DETAILS (Address page par dikhane ke liye)
// ==========================================
export const getCheckoutDetails = async (req, res) => {
  try {
    const userId = req.userId.userId;
    const { checkoutId } = req.params;

    const checkout = await Checkout.findOne({ _id: checkoutId, user: userId });
    if (!checkout) {
      return res.status(404).json({ success: false, message: "Checkout session expired or not found" });
    }

    return res.status(200).json({ success: true, checkout });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ==========================================
// 3. PLACE FINAL ORDER (Address & Payment ke baad)
// ==========================================
export const createOrder = async (req, res) => {
  try {
    const userId = req.userId.userId;
    const { checkoutId, shippingAddress, paymentMethod = "cod" } = req.body;

    // 1. Validate Address
    if (
      !shippingAddress?.name ||
      !shippingAddress?.phone ||
      !shippingAddress?.address ||
      !shippingAddress?.state ||
      !shippingAddress?.pincode
    ) {
      return res.status(400).json({ success: false, message: "Complete shipping address is required" });
    }

    // 2. Validate Payment Method
    const allowedMethods = ["cod", "upi", "netbanking", "debitcard", "creditcard"];
    if (!allowedMethods.includes(paymentMethod)) {
      return res.status(400).json({ success: false, message: "Invalid payment method" });
    }

    // 3. Checkout Session nikalo
    const checkout = await Checkout.findOne({ _id: checkoutId, user: userId });
    if (!checkout) {
      return res.status(404).json({ success: false, message: "Checkout session expired or invalid" });
    }

    // 4. Items ko Seller ke hisaab se group karo (Multi-seller support)
    const itemsBySeller = {};
    for (const item of checkout.items) {
      const sId = item.sellerId.toString();
      if (!itemsBySeller[sId]) {
        itemsBySeller[sId] = { items: [], sellerTotal: 0 };
      }
      itemsBySeller[sId].items.push({
        product: item.product,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      });
      itemsBySeller[sId].sellerTotal += item.price * item.quantity;
    }

    // 5. Har seller ke liye alag Order create karo
    const createdOrders = [];

    for (const [sellerId, data] of Object.entries(itemsBySeller)) {
      const order = await Order.create({
        user: userId,
        sellerId,
        items: data.items,
        shippingAddress,
        totalAmount: data.sellerTotal,
        paymentMethod,
        paymentStatus: "pending",
        orderStatus: paymentMethod === "cod" ? "confirmed" : "pending",
        sellerConfirmation: "pending",
      });

      createdOrders.push(order);

      // Stock kam karo
      for (const item of data.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: -item.quantity },
        });
      }
    }

    // 6. Agar order Cart se aaya tha, toh Cart khali kar do
    if (checkout.source === "cart") {
      await Cart.findOneAndUpdate({ user: userId }, { $set: { items: [] } });
    }

    // 7. Checkout session delete kar do taaki dubara order na ho jaye
    await Checkout.findByIdAndDelete(checkoutId);

    return res.status(201).json({
      success: true,
      message: paymentMethod === "cod" ? "Order placed successfully" : "Order created successfully",
      orders: createdOrders, // Array of orders (1 ya zyada sellers ke hisaab se)
    });
  } catch (error) {
    console.error("Create order error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};


// export const createOrder = async (req, res) => {
//   try {
//     const userId = req.userId.userId;
//     const sellerId = req.body.item.product.sellerObjectId;
    

//     if(!sellerId){
//       return res.status(400).json({
//         success: false,
//         message: "Seller ID is required",
//       });
//     }    

//     const {
//       shippingAddress,
//       paymentMethod = "cod",
//     } = req.body;

//     const item = req.body.item;
//     console.log("item:", item);

//     console.log("address:", shippingAddress);
//     console.log("shippingAddress:", req.body);
//     // Validate address
//     if (
//       !shippingAddress?.name ||
//       !shippingAddress?.phone ||
//       !shippingAddress?.address ||
//       !shippingAddress?.state ||
//       !shippingAddress?.pincode
//     ) {
//         console.log("error inside shipping");
        
//       return res.status(400).json({
//         success: false,
//         message: "Complete shipping address is required",
//       });
//     }

//     // Validate payment method
//     const allowedMethods = [
//       "cod",
//       "upi",
//       "netbanking",
//       "debitcard",
//       "creditcard",
//     ];

//     if (!allowedMethods.includes(paymentMethod)) {
//         console.log("error in side allowmethod");
        
//       return res.status(400).json({
//         success: false,
//         message: "Invalid payment method",
//       });
//     }
    

//     // Get user's cart
//     // const cart = await Cart.findOne({
//     //   user: userId,
//     // }).populate("items.product");

//     // if (!cart || cart.items.length === 0) {
//     //     console.log("error inside cart");
//     //   return res.status(400).json({
//     //     success: false,
//     //     message: "Your cart is empty",
//     //   });
//     // }

//     // Check products and calculate total
//     const orderItems = [];
//     let totalAmount = 0;

//     // for (const item of cart.items) {

//       const product = await Product.findById(
//         item.product._id
//       );


//       if (!product) {
//         console.log("error inside product");
//         return res.status(404).json({
//           success: false,
//           message: `Product not found`,
//         });
//       }

//       if (product.stock < item.quantity) {
//         console.log("error inside stock");
//         return res.status(400).json({
//           success: false,
//           message: `${product.name} is out of stock`,
//         });
//       }

//       const itemTotal =
//         product.price * item.quantity;

//       totalAmount += itemTotal;

//       orderItems.push({
//         product: product._id,
//         name: product.name,
//         price: product.price,
//         quantity: item.quantity,
//         image: product.image || "",
//       });
//     // }

//     // Create order
//     const order = await Order.create({
//       user: userId,
//       sellerId: sellerId,

//       items: orderItems,

//       shippingAddress,

//       totalAmount,

//       paymentMethod,

//       paymentStatus: "pending",

//       orderStatus: "pending",

//       sellerConfirmation: "pending",
//     });

//     // For COD, order can be confirmed immediately
//     if (paymentMethod === "cod") {
//       order.orderStatus = "confirmed";

//       await order.save();

//       // Clear cart after order creation
//       // cart.items = [];
//       // await cart.save();

//       return res.status(201).json({
//         success: true,
//         message: "Order placed successfully",
//         order,
//       });
//     }

//     // For online payment
//     return res.status(201).json({
//       success: true,
//       message: "Order created successfully",
//       orderId: order._id,
//       order,
//     });
//   } catch (error) {
//     console.error("Create order error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//     });
//   }
// };

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