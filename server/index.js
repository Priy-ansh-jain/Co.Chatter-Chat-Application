import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import authRoutes from "./routes/AuthRoutes.js";
import { contactsRoutes } from "./routes/ContactRoutes.js";
import setupSocket from "./socket.js";
import messagesRoutes from "./routes/messagesRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5179;
const databaseURL = process.env.DATABASE_URL;

// Middleware setup
app.use(
  cors({
    origin: [process.env.ORIGIN], // Should be http://localhost:5173
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);
app.use("/uploads/profiles", express.static("uploads/profiles"));
app.use(cookieParser());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactsRoutes);
app.use("/api/messages", messagesRoutes);

// Start the server and then set up socket.io
const server = app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});

setupSocket(server);
// Database connection
mongoose
  .connect(databaseURL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
