import dotenv from 'dotenv';
dotenv.config();
import app from './src/app.js';
import { Server } from "socket.io";
import { createServer } from "http";
import connectDB from './src/config/db.js';

connectDB();

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

app.set("io", io);

io.on("connection", (socket) => {
  console.log("Seller connected:", socket.id);

  socket.on("seller-join", (sellerId) => {
    socket.join(`seller-${sellerId}`);

    console.log(`Seller joined room: seller-${sellerId}`);
  });
});

server.listen(process.env.PORT || 3000, () => {
    console.log(`server is running in ${process.env.PORT || 3000}`);
    
})