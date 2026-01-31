import express from "express";
import User from "../models/User.js";
import adminAuth from "../middleware/adminauth.js"; // import your middleware

const router = express.Router();

/* =========================
   GET ALL PENDING USERS
========================= */
router.get("/pending-users", adminAuth, async (req, res) => {
  try {
    const users = await User.find({ membershipStatus: "pending_approval" })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/* =========================
   APPROVE USER
========================= */
router.put("/approve/:id", adminAuth, async (req, res) => {
  try {
    const id = req.params.id; // ✅ define the ID
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.membershipId) {
      user.membershipId = `CLUB-${Date.now()}`;
    }

    const approvedAt = new Date();
    const expiryDate = new Date(approvedAt);
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);

    // update the database using the ID
    await User.findByIdAndUpdate(id, {
      membershipStatus: "approved",
      approvedAt,
      expiryDate,
    });

    // update the local user object before sending response
    user.approvedAt = approvedAt;
    user.expiryDate = expiryDate;
    user.membershipStatus = "approved";

    await user.save();

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Approve route error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});



/* =========================
   REJECT USER
========================= */
router.put("/reject/:id", adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.membershipStatus = "rejected";
    await user.save();

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/* =========================
   GET ALL USERS
========================= */
router.get("/all-users", adminAuth, async (req, res) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;
