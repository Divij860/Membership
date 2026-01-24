// routes/user.js
import express from "express";
import upload from "../middleware/cloudinaryUpload.js";
import User from "../models/User.js";

const router = express.Router();

/* ======================
   GET user by ID
====================== */
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ======================
   UPLOAD PAYMENT PROOF
====================== */
router.post(
  "/upload-payment/:id",
  upload.single("paymentProof"),
  async (req, res) => {
    try {
      // 1️⃣ Check file
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded",
        });
      }

      // 2️⃣ Update user
      const user = await User.findByIdAndUpdate(
        req.params.id,
        {
          paymentProof: req.file.filename,
          membershipStatus: "pending_approval",
        },
        { new: true } // return updated user
      );

      // 3️⃣ Check user
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // 4️⃣ Success
      res.json({
        success: true,
        user, // return updated user
        filename: req.file.filename,
        message: "Payment proof uploaded successfully",
      });
    } catch (error) {
      console.error("UPLOAD ERROR:", error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

export default router;
