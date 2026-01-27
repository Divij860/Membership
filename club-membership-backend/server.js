import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authroutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import membershipCardRoute from "./routes/Membershipcard.js";
import memberAuthRoutes from "./routes/memberAuth.js";

dotenv.config();

const app = express();


const allowedOrigins = [
  "http://localhost:5173", 
  "https://membership-front.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (Postman, server-to-server)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

/* ======================
   BODY PARSERS
====================== */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ======================
   REQUEST LOGGER (DEV)
====================== */
app.use((req, res, next) => {
  console.log("➡️ Incoming:", req.method, req.url);
  next();
});

/* ======================
   DATABASE + SERVER START
====================== */
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");

    /* ======================
       ROUTES
    ====================== */
    app.use("/api/auth", authRoutes);
    app.use("/api/member", memberAuthRoutes);
    app.use("/api/user", userRoutes);
    app.use("/api/admin", adminRoutes);
    app.use("/api", membershipCardRoute);

    app.get("/", (req, res) => {
      res.send("✅ Club Membership API running");
    });

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
  });
