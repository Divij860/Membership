import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import upload from "../middleware/cloudinaryUpload.js";

const router = express.Router();

/* ======================
   REGISTER (photos optional)
====================== */
router.post(
  "/register",
  upload.any(),
  async (req, res) => {
    try {
      console.log("===== Register Route Called =====");

      const { name, email, age, phone } = req.body;
      const files = req.files || [];

      // Optional files
      const photo = files.find((f) => f.fieldname === "photo");
      const payment = files.find((f) => f.fieldname === "paymentProof");

      // ✅ Required fields only
      if (!name || !age || !phone) {
        return res.status(400).json({
          success: false,
          message: "Name, age, and phone are required",
        });
      }

      // 2️⃣ Check if user already exists
      const existingUser = await User.findOne({ phone });
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "User with this phone number already exists",
        });
      }

      // 3️⃣ Generate membership ID
      const membershipId = `MEM-${Date.now()}`;

      // 4️⃣ Create user
      const user = await User.create({
        name,
        email: email || null,
        age,
        phone,

        // ✅ Optional uploads
        photo: photo?.secure_url || null,
        photoId: photo?.public_id || null,
        paymentProof: payment?.secure_url || null,
        paymentProofId: payment?.public_id || null,

        membershipStatus: "pending_approval",
        membershipId,
      });

      // 5️⃣ Success response
      return res.status(201).json({
        success: true,
        message: "Registered successfully. Await admin approval.",
        membershipId: user.membershipId,
      });
    } catch (err) {
      console.error("Register route error:", err);
      return res.status(500).json({
        success: false,
        message: "Server error: " + err.message,
      });
    }
  }
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
      { expiresIn: "1d" }
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
