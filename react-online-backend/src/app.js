import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.router.js";
import sellerRoutes from "./routes/seller.router.js";
import cookieParser from "cookie-parser";
import productRouter from "./routes/products.router.js";
import adminRouter from "./routes/admin.router.js";
import cartRouter from "./routes/cart.router.js";
import addressRouter from "./routes/address.router.js";
import paymentRouter from "./routes/payment.roter.js";
import orderRouter from "./routes/order.router.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(cors({origin: "http://localhost:5173", credentials: true}));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/seller", sellerRoutes);
app.use("/api", productRouter);
app.use('/api', addressRouter)
app.use("/api/admin", adminRouter);
app.use("/api/cart", cartRouter);
app.use("/api/orders", orderRouter);
app.use("/api/payments", paymentRouter);


export default app;