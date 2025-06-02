import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { Server } from "socket.io";
import connectDB from "./config/db.js";
import userRoute from "./routes/userRoute.js";
import chatRoute from "./routes/chatRoute.js";
import messageRoute from "./routes/messageRoute.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import { protect } from "./middleware/authMiddleware.js";
import path from "path";

dotenv.config();

const port = process.env.PORT || 5000;

// Initialize Express app and HTTP server
const app = express();
const httpServer = createServer(app);

// Initialize Socket.io
const io = new Server(httpServer,{
  cors: {
    origin: [
      'https://realtimechatapp-opal.vercel.app',
      'https://realtimechat-1-gpm1.onrender.com',
      'http://localhost:5173'
    ],
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Connect to database
connectDB();

// Express middleware
app.use(express.json());
const corsOptions = {
  origin: [
    'https://realtimechatapp-opal.vercel.app', // Your Vercel frontend
    'https://realtimechat-1-gpm1.onrender.com', // Your Render backend
    'http://localhost:5173' // For local development
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/users", userRoute);
app.use("/api/chats", protect, chatRoute);
app.use("/api/messages", protect, messageRoute);

// Socket.io logic
let onlineUsers = [];

io.on("connection", (socket) => {
  console.log("new connection", socket.id);

  // listen to a connection
  socket.on("addNewUser", (userId) => {
    if (!onlineUsers.some((user) => user.userId === userId)) {
      onlineUsers.push({
        userId,
        socketId: socket.id,
      });
    }

    console.log("onlineUsers", onlineUsers);
    io.emit("getOnlineUsers", onlineUsers);
  });

  // add message
  socket.on("sendMessage", (message) => {
    const user = onlineUsers.find((user) => user.userId === message.recipientId);

    if (user) {
      io.to(user.socketId).emit("getMessage", message);
      io.to(user.socketId).emit("getNotification", {
        senderId: message.senderId,
        isRead: false,
        date: new Date(),
      });
    }
  });

  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
    io.emit("getOnlineUsers", onlineUsers);
  });
});

// Static files and production setup
if (process.env.NODE_ENV === "production") {
  const __dirname = path.resolve();
  const __rootdir = path.join(__dirname, "..");
  app.use(express.static(path.join(__rootdir, "/client/dist")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__rootdir, "client", "dist", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running....");
  });
}

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start the server
httpServer.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});