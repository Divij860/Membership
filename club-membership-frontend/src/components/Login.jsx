import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [formData, setFormData] = useState({
    membershipId: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        "https://membership-brown.vercel.app/api/member/login",
        {
          membershipId: formData.membershipId,
          phone: formData.phone,
        },
      );
      console.log("LOGIN RESPONSE 👉", res.data);


      // ✅ Save ONLY what is needed
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId);

      // ✅ Redirect to dashboard
      navigate("/dashboard");
    } catch (err) {
      const msg = err.response?.data?.message;

      if (msg === "Membership not approved yet") {
        alert("Your registration is pending admin approval. Please wait.");
      } else if (msg === "Invalid phone number or Membership ID") {
        alert(
          "Invalid Membership ID or Phone number. Please check and try again.",
        );
      } else {
        alert(msg || "Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Member Login
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            name="membershipId"
            placeholder="Membership ID"
            value={formData.membershipId}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-semibold py-3 rounded-lg shadow-md transition duration-300"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-5 text-center text-gray-500 text-sm">
          Don&apos;t have an account?{" "}
          <a href="/register" className="text-blue-500 hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
}
