import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import upload from "../middleware/cloudinaryUpload.js";

const router = express.Router();

/* ======================
   MEMBERSHIP ID GENERATOR
====================== */
const getNextMembershipId = async () => {
  const lastUser = await User.findOne().sort({ createdAt: -1 });

  let nextNumber = 1;

  if (lastUser?.membershipId) {
    const lastNumber = parseInt(lastUser.membershipId.replace("KSASC", ""), 10);
    nextNumber = lastNumber + 1;
  }

  return `KSASC${String(nextNumber).padStart(4, "0")}`;
};

/* ======================
   REGISTER (photo + payment REQUIRED)
====================== */
router.post("/register", upload.any(), async (req, res) => {
  try {
    console.log("===== Register Route Called =====");

    const { name, email, age, phone } = req.body;
    const files = req.files || [];

    // 🔒 REQUIRED FILES
    const photo = files.find((f) => f.fieldname === "photo");
    const payment = files.find((f) => f.fieldname === "paymentProof");

    if (!photo || !payment) {
      return res.status(400).json({
        success: false,
        message: "Profile photo and payment proof are required",
      });
    }

    // 🔒 REQUIRED FIELDS
    if (!name || !age || !phone) {
      return res.status(400).json({
        success: false,
        message: "Name, age, and phone are required",
      });
    }

    // 🔎 CHECK EXISTING USER
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User with this phone number already exists",
      });
    }

    let createdUser = null;
    let attempts = 0;

    while (!createdUser && attempts < 3) {
      attempts++;

      const membershipId = await getNextMembershipId();

      try {
        createdUser = await User.create({
          name,
          email: email || null,
          age,
          phone,

          photo: photo.secure_url,
          photoId: photo.public_id,
          paymentProof: payment.secure_url,
          paymentProofId: payment.public_id,

          membershipStatus: "pending_approval",
          membershipId,
        });
      } catch (err) {
        // Duplicate membershipId → retry
        if (err.code === 11000 && err.keyPattern?.membershipId) {
          console.warn("⚠️ Duplicate membershipId detected, retrying...");
          continue;
        }
        throw err;
      }
    }

    if (!createdUser) {
      return res.status(500).json({
        success: false,
        message: "Could not generate unique membership ID. Please try again.",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Registered successfully. Await admin approval.",
      membershipId: createdUser.membershipId,
    });
  } catch (err) {
    console.error("Register route error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error: " + err.message,
    });
  }
});

/* ======================
   ADMIN LOGIN
====================== */
router.post("/admin/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: "Username and password are required",
    });
  }

  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const token = jwt.sign(
      { role: "admin", username },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    return res.json({
      success: true,
      token,
      admin: {
        username,
        role: "admin",
      },
    });
  }

  return res.status(401).json({
    success: false,
    message: "Invalid credentials",
  });
});

export default router;
