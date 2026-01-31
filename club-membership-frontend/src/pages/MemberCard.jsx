import React, { useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MemberContent from "../components/MemberContent";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const MembershipCard = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const user = state?.user;

  const componentRef = useRef(null);

  const handleDownloadPDF = async () => {
    if (!componentRef.current) return;

    try {
      const canvas = await html2canvas(componentRef.current, {
        scale: 2,
        useCORS: true,
        
        logging: false,

        onclone: (clonedDoc) => {
          // 🔒 Lock root styles (prevents Tailwind vars)
          const root = clonedDoc.documentElement;
          
          root.style.color = "#000000";

          // 🧹 Replace ALL unsupported color functions
          clonedDoc.querySelectorAll("*").forEach((el) => {
            const computed =
              clonedDoc.defaultView.getComputedStyle(el);

            [
              "color",
              "background-color",
              "border-color",
              "outline-color",
            ].forEach((prop) => {
              const value = computed.getPropertyValue(prop);
              if (value && value.includes("oklch")) {
                el.style.setProperty(prop, "#000000", "important");
              }
            });
          });
        },
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
  orientation: "landscape",
  unit: "px",
  format: [1080, 720], 
});

pdf.addImage(imgData, "PNG", 0, 0, 1080, 720);


      const fileId = user?.membershipId
        ? user.membershipId.slice(-4).toUpperCase()
        : "CARD";

      pdf.save(`Membership_${fileId}.pdf`);
    } catch (error) {
      console.error("PDF generation failed:", error);
      alert("PDF generation failed. Please try again.");
    }
  };

  if (!user) {
    return (
      <div className=" flex flex-col items-center text-center ">
        <p className="text-red-600 mb-4">
          Invalid access. Please open from dashboard.
        </p>
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-gray-800 text-white px-4 py-2 rounded"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className=" flex flex-col items-center pt-8">
      {/* ✅ SAFE CAPTURE ZONE */}
      <div
        ref={componentRef}
        // style={{
        //   all: "unset", // 🚫 kills Tailwind inheritance
        //   width: "720px", // A4 width @ 96 DPI
        //   backgroundColor: "#ffffff",
        //   padding: "",
        //   boxSizing: "border-box",
        //   color: "#000000",
        //   fontFamily: "Arial, sans-serif",
        // }}
      >
        <MemberContent user={user} />
      </div>

      <button
        onClick={handleDownloadPDF}
        className="mt-6 bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition"
      >
        Download PDF
      </button>
    </div>
  );
};

export default MembershipCard;
