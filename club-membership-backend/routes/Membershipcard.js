import express from "express";
import PDFDocument from "pdfkit";
import User from "../models/User.js";

const router = express.Router();

router.get("/membership-card/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user || user.membershipStatus !== "approved") {
      return res.status(404).json({ message: "Membership not approved" });
    }

    const startDate = new Date(user.createdAt);
    const expiryDate = new Date(
      new Date(startDate).setFullYear(startDate.getFullYear() + 1)
    );

    const doc = new PDFDocument({
  size: [340, 215], // ID Card size
  margin: 0
});

doc.pipe(res);

/* Card Background */
doc.rect(0, 0, 340, 215).fill("#e5e7eb");

/* Main Card */
doc.roundedRect(8, 8, 324, 199, 15).fill("#ffffff");

/* Header Bar */
doc.rect(8, 8, 324, 40).fill("#1e40af");

/* Club Name */
doc
  .fillColor("#ffffff")
  .fontSize(14)
  .font("Helvetica-Bold")
  .text("KING STAR ARTS & SPORTS CLUB", 20, 20);

/* Photo Box */
doc
  .roundedRect(20, 60, 80, 95, 10)
  .stroke("#1e40af");

/* Member Photo */
if (user.photo) {
  doc.image(`uploads/${user.photo}`, 22, 62, {
    width: 76,
    height: 91,
    fit: [76, 91]
  });
}

/* Member Details */
doc.fillColor("#000000").fontSize(10);
doc.text(`Name`, 115, 60);
doc.font("Helvetica-Bold").text(user.name, 115, 73);

doc.font("Helvetica").text(`Member ID`, 115, 92);
doc.font("Helvetica-Bold").text(user.membershipId, 115, 105);

doc.font("Helvetica").text(`Phone`, 115, 124);
doc.font("Helvetica-Bold").text(user.phone, 115, 137);

doc.font("Helvetica").text(`Valid Till`, 115, 156);
doc.font("Helvetica-Bold").text(
  expiryDate.toDateString(),
  115,
  169
);

/* Status Badge */
doc
  .roundedRect(235, 165, 75, 22, 10)
  .fill("#16a34a");

doc
  .fillColor("#ffffff")
  .fontSize(9)
  .text("ACTIVE", 255, 171);

/* Footer */
doc
  .fillColor("#6b7280")
  .fontSize(7)
  .text("This card is property of Green Star Arts & Sports Club", 20, 195);

doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).send("Error generating membership card");
  }
});

export default router;
