import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

/* ======================
   MEMBER LOGIN
====================== */
router.post("/login", async (req, res) => {
  try {
    const { phone, membershipId } = req.body;

    if (!phone || !membershipId) {
      return res.status(400).json({
        success: false,
        message: "Phone number and Membership ID are required",
      });
    }

    const member = await User.findOne({ phone, membershipId });

    if (!member) {
      return res.status(401).json({
        success: false,
        message: "Invalid phone number or Membership ID",
      });
    }

    if (member.membershipStatus !== "approved") {
      return res.status(403).json({
        success: false,
        message: "Membership not approved yet",
      });
    }

    const token = jwt.sign(
      {
        id: member._id,
        role: "member",
        membershipId: member.membershipId,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      success: true,
      message: "Login successful",
      token,
      member: {
        name: member.name,
        phone: member.phone,
        membershipId: member.membershipId,
      },
    });
  } catch (err) {
    console.error("Member login error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

export default router;
