import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import configViewEngine from "./config/viewEngine";
import connectDB from "./config/connectDB";
import initWebRoutes from "./routes/web";
import path from "path";
import multer from "multer";
import { Server } from "socket.io";
import http from "http";
import connectCloudinary from "./config/cloudinary";
require("dotenv").config();
let app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});
let onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("🔌 Client connected:", socket.id);

  socket.on("register", (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log(`✅ ${userId} registered with socket ${socket.id}`);
  });

  socket.on("send_message", (data) => {
    const { senderId, receiverId, content, type } = data;
    const receiverSocket = onlineUsers.get(receiverId);

    if (receiverSocket) {
      io.to(receiverSocket).emit("receive_message", {
        senderId,
        content,
        type,
        timestamp: new Date(),
      });
    }
  });

  socket.on("disconnect", () => {
    for (let [userId, sockId] of onlineUsers.entries()) {
      if (sockId === socket.id) {
        onlineUsers.delete(userId);
        console.log(`❌ ${userId} disconnected`);
        break;
      }
    }
  });
});

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        origin.includes("localhost:5173") ||
        origin.includes("localhost:5174")
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
configViewEngine(app);
initWebRoutes(app);

connectDB();
connectCloudinary();

let port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log("Server is running on port 3000");
});
