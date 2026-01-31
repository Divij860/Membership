import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import Lines from "../assets/lines.webp";
import CenterLogo from "../assets/logo-Malayalam.webp";
import ClubName from "../assets/logo.webp";
import Hashtag from "../assets/hashtag.webp";

export default function MemberRegister() {
  const [formData, setFormData] = useState({
    name: "",
    nickname: "",
    age: "",
    phone: "",
    email: "",
    bloodGroup: "",
    address: "",
    dob: "",
  });

  const [photo, setPhoto] = useState(null);
  const [membershipId, setMembershipId] = useState("");
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const [errors, setErrors] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  /* ======================
     VALIDATION
  ====================== */
  const validateForm = () => {
    const newErrors = {};
    if (formData.name.trim().length < 3) newErrors.name = "Min 3 characters";
    if (formData.nickname.trim().length < 2) newErrors.nickname = "Required";
    if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = "10 digit number";
    if (!formData.bloodGroup) newErrors.bloodGroup = "Select blood group";
    if (!formData.address.trim()) newErrors.address = "Required";
    if (!photo) newErrors.photo = "Photo required";

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
      Object.entries(formData).forEach(([k, v]) => v && data.append(k, v));
      data.append("photo", photo);

      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setMembershipId(res.data.membershipId);
      setShowSuccessModal(true);
      setAlreadyRegistered(false);
    } catch (err) {
      const msg = err.response?.data?.message || "Something went wrong";
      msg.includes("already exists")
        ? setAlreadyRegistered(true)
        : alert(msg);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center relative px-4 sm:px-6">
      {/* BACKGROUND */}
      <img
        src={Lines}
        className="absolute bottom-0 left-0 w-full h-[400px] sm:h-[600px] opacity-40 -z-10 object-cover"
        alt=""
      />

      {/* MAIN BOX */}
      <div className="relative w-full max-w-3xl rounded-2xl px-4 sm:px-10 py-4 sm:py-6">
        <img
          src={Hashtag}
          className="absolute right-3 sm:right-7 bottom-0 h-6 sm:h-7 pt-2"
          alt=""
        />

        <div className="flex justify-center items-center mb-2 gap-2 flex-wrap">
          <img src={CenterLogo} className="h-14 sm:h-20" />
          <img src={ClubName} className="h-14 sm:h-20" />
        </div>

        <h1 className="text-center text-lg sm:text-2xl font-extrabold mb-3">
          MEMBER REGISTRATION
        </h1>

        {alreadyRegistered && (
          <p className="text-red-600 text-center mb-4">
            Phone number already registered
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <input name="name" placeholder="Full Name" onChange={handleChange} className="p-2 border rounded-lg" />
            <input name="nickname" placeholder="Nickname" onChange={handleChange} className="p-2 border rounded-lg" />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <input type="number" name="age" placeholder="Age" onChange={handleChange} className="p-2 border rounded-lg" />
            <input name="phone" placeholder="Mobile Number" onChange={handleChange} className="p-2 border rounded-lg" />
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <input name="email" placeholder="Email (optional)" onChange={handleChange} className="p-2 border rounded-lg" />
            <input type="date" name="dob" onChange={handleChange} className="p-2 border rounded-lg" />
            <select name="bloodGroup" onChange={handleChange} className="p-2 border rounded-lg">
              <option value="">Select Blood Group</option>
              {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(bg => (
                <option key={bg}>{bg}</option>
              ))}
            </select>
          </div>

          <textarea name="address" placeholder="Address" onChange={handleChange} className="h-24 p-2 border rounded-lg" />

          <div>
            <label className="block text-sm font-semibold mb-1">
              Upload Profile Photo
            </label>
            <input type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files[0])} />
            {errors.photo && <p className="text-red-500 text-sm">{errors.photo}</p>}
          </div>

          <button className="w-full bg-gradient-to-r from-blue-700 to-blue-900 text-white py-3 rounded-xl">
            REGISTER
          </button>

          <p className="text-center text-sm mt-3">
            Already registered?{" "}
            <button type="button" onClick={() => navigate("/")} className="text-blue-700 font-semibold">
              Login
            </button>
          </p>
        </form>
      </div>

      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <div className="p-6 rounded-xl text-center">
            <h2 className="text-2xl font-bold text-green-600">
              Registration Successful 🎉
            </h2>
            <button onClick={() => navigate("/")} className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg">
              Go to Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
