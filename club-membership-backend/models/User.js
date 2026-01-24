import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      lowercase: true,
      trim: true,
      default: null,
    },

    age: {
      type: Number,
      required: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
    },

    // 📸 Cloudinary (profile photo)
    photo: {
      type: String, // Cloudinary URL
    },
    photoId: {
      type: String, // Cloudinary public_id
    },

    // 💳 Cloudinary (payment proof)
    paymentProof: {
      type: String, // Cloudinary URL
    },
    paymentProofId: {
      type: String, // Cloudinary public_id
    },

    membershipStatus: {
      type: String,
      enum: [
        "registered",
        "payment_pending",
        "pending_approval",
        "approved",
        "rejected",
      ],
      default: "registered",
    },

    membershipId: {
      type: String,
      unique: true,
      sparse: true,
    },

    // 🪪 Generated PDF (optional Cloudinary later)
    membershipCard: {
      type: String, // URL if you ever upload PDF to Cloudinary
    },
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);
