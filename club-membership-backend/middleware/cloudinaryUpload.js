import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

/* ======================
   CLOUDINARY STORAGE
====================== */
const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    let folder = "members/others";

    if (file.fieldname === "photo") {
      folder = "members/photos";
    }

    if (file.fieldname === "paymentProof") {
      folder = "members/payments";
    }

    return {
      folder,
      allowed_formats: ["jpg", "jpeg", "png"],
    };
  },
});

/* ======================
   FILE FILTER
====================== */
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];

  if (!allowedTypes.includes(file.mimetype)) {
    return cb(
      new Error("Only JPG, JPEG, and PNG image files are allowed"),
      false,
    );
  }

  cb(null, true);
};

/* ======================
   MULTER CONFIG
====================== */
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

export default upload;
