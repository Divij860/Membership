import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function MemberDashboard() {
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!token || !userId) {
      navigate("/");
      return;
    }

    axios
      .get(`https://membership-brown.vercel.app/api/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // safe even if backend ignores it
        },
      })
      .then((res) => {
        setMember(res.data.user);
        setLoading(false);
      })
      .catch((err) => {
        console.error("FETCH USER ERROR:", err);
        navigate("/");
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading dashboard...
      </div>
    );
  }

  if (!member) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Membership Under Review. Please come back later.
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r hidden md:flex flex-col justify-between">
        <div>
          <div className="p-6 text-xl font-bold text-indigo-600">
            Member Portal
          </div>

          <nav className="px-4 space-y-2 text-sm">
            <p className="px-3 py-2 rounded-lg bg-indigo-50 text-indigo-600 font-medium">
              Dashboard
            </p>
          </nav>
        </div>

        <div className="border-t p-4 space-y-3">
          <button
            onClick={handleLogout}
            className="w-full text-sm font-medium text-red-600 hover:bg-red-50 py-2 rounded-lg transition"
          >
            Logout
          </button>

          <p className="text-xs text-gray-400 text-center">
            © 2026 Green Star Arts and Sports Club
          </p>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1">
        <section className="bg-gradient-to-r from-indigo-600 to-blue-600 p-8 text-white">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <img
              src={member.photo || "/default-avatar.png"}
              alt={member.name}
              className={`w-32 h-32 rounded-full border-4 border-white object-cover ${
                member.membershipStatus !== "approved" ? "blur-sm" : ""
              }`}
            />

            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold">{member.name}</h1>
              <p className="opacity-90">{member.phone}</p>

              <span
                className={`inline-block mt-3 px-5 py-1 rounded-full text-sm font-medium ${
                  member.membershipStatus === "approved"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {member.membershipStatus?.replace("_", " ").toUpperCase()}
              </span>
            </div>
          </div>
        </section>

        <section className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoCard label="Full Name" value={member.name} />
          <InfoCard label="Phone Number" value={member.phone} />
          <InfoCard
            label="Membership ID"
            value={member.membershipId}
            highlight
          />
          <InfoCard
            label="Expiry Date"
            value={
              member.expiryDate
                ? new Date(member.expiryDate).toLocaleDateString()
                : "Not Available"
            }
          />
        </section>
      </main>
    </div>
  );
}

/* INFO CARD COMPONENT */
function InfoCard({ label, value, highlight }) {
  return (
    <div
      className={`bg-white rounded-2xl shadow p-5 ${
        highlight ? "border-l-4 border-indigo-600" : ""
      }`}
    >
      <p className="text-xs text-gray-500">{label}</p>
      <p className="mt-1 font-semibold text-gray-800">{value}</p>
    </div>
  );
}
