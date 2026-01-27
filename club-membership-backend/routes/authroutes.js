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
router.post(
  "/register",
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "paymentProof", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { name, email, age, phone } = req.body;

      const photo = req.files?.photo?.[0];
      const payment = req.files?.paymentProof?.[0];

      // ✅ Required validations
      if (!name || !age || !phone) {
        return res.status(400).json({
          success: false,
          message: "Name, age, and phone are required",
        });
      }

      if (!photo || !payment) {
        return res.status(400).json({
          success: false,
          message: "Profile photo and payment proof are required",
        });
      }

      const existingUser = await User.findOne({ phone });
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "User with this phone number already exists",
        });
      }

      const membershipId = await getNextMembershipId();

      const user = await User.create({
        name,
        email: email || null,
        age,
        phone,
        photo: photo.path,
        photoId: photo.filename,
        paymentProof: payment.path,
        paymentProofId: payment.filename,
        membershipStatus: "pending_approval",
        membershipId,
      });

      return res.status(201).json({
        success: true,
        message: "Registered successfully. Await admin approval.",
        membershipId: user.membershipId,
      });
    } catch (err) {
      console.error("Register error:", err);
      return res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  },
);

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
