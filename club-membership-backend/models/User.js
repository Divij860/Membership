import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    
    name: {
      type: String,
      required: true,
      trim: true,
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
      min: 10,
      max: 100,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    /* ======================
       CLOUDINARY PROFILE PHOTO
    ====================== */
    photo: {
      type: String, // Cloudinary secure_url
      required: true,
    },

    photoId: {
      type: String, // Cloudinary public_id
      required: true,
    },

  approvedAt: {
  type: Date,
},

expiryDate: {
  type: Date,
},


    /* ======================
       MEMBERSHIP
    ====================== */
    membershipStatus: {
      type: String,
      enum: [
        "registered",
        "pending_approval",
        "approved",
        "rejected",
      ],
      default: "pending_approval",
    },

    membershipId: {
      type: String,
      unique: true,
      required: true,
    },

    /* ======================
       FUTURE USE (OPTIONAL)
    ====================== */
    membershipCard: {
      type: String, // URL (PDF or image if uploaded later)
      default: null,
    },
  },
  { timestamps: true }

  
);

export default mongoose.model("User", userSchema);
