import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function MemberRegister() {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    phone: "",
    email: "",
  });

  const [photo, setPhoto] = useState(null);
  const [paymentProof, setPaymentProof] = useState(null);

  const [membershipId, setMembershipId] = useState("");
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const [errors, setErrors] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  /* ======================
     FORM VALIDATION
  ====================== */
  const validateForm = () => {
    const newErrors = {};

    if (formData.name.trim().length < 3)
      newErrors.name = "Name must be at least 3 characters";

    if (!formData.age || formData.age < 10 || formData.age > 100)
      newErrors.age = "Age must be between 10 and 100";

    if (!/^\d{10}$/.test(formData.phone))
      newErrors.phone = "Phone number must be 10 digits";

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Invalid email address";

    // 🔒 REQUIRED FILES
    if (!photo) newErrors.photo = "Profile photo is required";
    if (!paymentProof) newErrors.paymentProof = "Payment proof is required";

    // 🔒 FILE SIZE (5MB)
    if (photo && photo.size > 5 * 1024 * 1024)
      newErrors.photo = "Photo must be under 5MB";

    if (paymentProof && paymentProof.size > 5 * 1024 * 1024)
      newErrors.paymentProof = "Payment proof must be under 5MB";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ======================
     SUBMIT
  ====================== */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("age", formData.age);
      data.append("phone", formData.phone);
      if (formData.email) data.append("email", formData.email);

      // 🔥 REQUIRED FILES (MATCH BACKEND FIELD NAMES)
      data.append("photo", photo);
      data.append("paymentProof", paymentProof);

      const res = await axios.post(
        "https://membership-brown.vercel.app/api/auth/register",
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      setMembershipId(res.data.membershipId);
      setAlreadyRegistered(false);
      setShowSuccessModal(true);

      // Reset
      setFormData({ name: "", age: "", phone: "", email: "" });
      setPhoto(null);
      setPaymentProof(null);
      setErrors({});
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Something went wrong";

      if (message.includes("already exists")) {
        setAlreadyRegistered(true);
      } else {
        alert(message);
      }
    }
  };

  /* ======================
     UI
  ====================== */
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-lg bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-2xl font-bold text-center mb-6">
          Member Registration
        </h1>

        {alreadyRegistered && (
          <p className="text-red-500 text-center mb-4">
            User with this phone number already exists
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />
          {errors.name && <p className="text-red-500">{errors.name}</p>}

          <input
            name="email"
            placeholder="Email (optional)"
            value={formData.email}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />
          {errors.email && <p className="text-red-500">{errors.email}</p>}

          <div className="flex gap-4">
            <input
              type="number"
              name="age"
              placeholder="Age"
              value={formData.age}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            />
            <input
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            />
          </div>
          {(errors.age || errors.phone) && (
            <p className="text-red-500">{errors.age || errors.phone}</p>
          )}

          {/* REQUIRED FILE UPLOADS */}
          <div>
            <label className="block font-medium mb-1">Profile Photo *</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setPhoto(e.target.files[0])}
            />
            {errors.photo && <p className="text-red-500">{errors.photo}</p>}
          </div>

          <div>
            <label className="block font-medium mb-1">Payment Proof *</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setPaymentProof(e.target.files[0])}
            />
            {errors.paymentProof && (
              <p className="text-red-500">{errors.paymentProof}</p>
            )}
          </div>

          <button className="w-full bg-blue-500 text-white py-3 rounded-lg">
            Register
          </button>
        </form>
      </div>

      {/* SUCCESS MODAL */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl text-center">
            <h2 className="text-2xl font-bold text-green-600">
              Registration Successful 🎉
            </h2>
            <p className="mt-2">
              Membership ID: <b>{membershipId}</b>
            </p>
            <button
              onClick={() => navigate("/")}
              className="mt-4 bg-green-500 text-white px-6 py-2 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
