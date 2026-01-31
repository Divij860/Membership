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
   REGISTER USER
====================== */
router.post("/register", upload.single("photo"), async (req, res) => {
  let uploadedImage = null;

  try {
    const {
      name,
      nickname,
      email,
      age,
      phone,
      bloodGroup,
      address,
      dob, // optional
    } = req.body;

    // ✅ Required field validation
    if (!name || !nickname || !age || !phone || !bloodGroup || !address) {
      return res.status(400).json({
        success: false,
        message:
          "Name, nickname, age, phone, blood group, and address are required",
      });
    }

    // ✅ Profile photo required
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Profile photo is required",
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

    uploadedImage = req.file;

    const user = await User.create({
      name,
      nickname,
      email: email || null,
      age,
      phone,
      bloodGroup,
      address,
      dob: dob || null, // ✅ DOB optional
      photo: uploadedImage.path,       // Cloudinary secure_url
      photoId: uploadedImage.filename, // Cloudinary public_id
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

    // 🧹 Rollback image if DB fails
    if (uploadedImage?.filename) {
      try {
        await cloudinary.uploader.destroy(uploadedImage.filename);
      } catch (cleanupErr) {
        console.error("Cloudinary cleanup failed:", cleanupErr);
      }
    }

    return res.status(500).json({
      success: false,
      message: "Server error",
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