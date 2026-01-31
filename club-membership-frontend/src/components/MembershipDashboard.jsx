import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function MemberDashboard() {
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPreview, setShowPreview] = useState(false);

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
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setMember(res.data.user);
        setLoading(false);
      })
      .catch(() => navigate("/"));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/");
  };

  // ✅ BACKEND PDF DOWNLOAD
  // const downloadMembershipCard = async () => {
  //   try {
  //     const token = localStorage.getItem("token");
  //     const userId = localStorage.getItem("userId");

  //     const response = await axios.get(
  //       `https://membership-brown.vercel.app/api/membership-card/${userId}`,
  //       {
  //         responseType: "blob",
  //         headers: { Authorization: `Bearer ${token}` },
  //       }
  //     );

  //     const url = window.URL.createObjectURL(new Blob([response.data]));
  //     const link = document.createElement("a");
  //     link.href = url;
  //     link.download = `MembershipCard_${member.membershipId}.pdf`;
  //     document.body.appendChild(link);
  //     link.click();
  //     link.remove();
  //     window.URL.revokeObjectURL(url);
  //   } catch (err) {
  //     alert("Failed to download membership card");
  //   }
  // };

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
        Membership under review
      </div>
    );
  }

  const expiryDate = member.createdAt
    ? new Date(
        new Date(member.createdAt).setFullYear(
          new Date(member.createdAt).getFullYear() + 1,
        ),
      ).toLocaleDateString()
    : "N/A";

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r hidden md:flex flex-col justify-between">
        <div className="p-6 text-2xl font-bold text-indigo-600">
          Member Portal
        </div>

        <div className="border-t p-4">
          <button
            onClick={handleLogout}
            className="w-full text-red-600 font-medium hover:bg-red-50 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 p-6 space-y-8">
        {/* PROFILE HEADER */}
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col md:flex-row gap-6 items-center">
          <img
            src={member.photo || "/default-avatar.png"}
            alt={member.name}
            className="w-32 h-32 rounded-full border-4 border-indigo-500 object-cover"
          />

          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold">{member.name}</h1>
            <p className="text-gray-600">{member.phone}</p>

            <span
              className={`inline-block mt-2 px-4 py-1 rounded-full text-sm font-semibold
                ${
                  member.membershipStatus === "approved"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
            >
              {member.membershipStatus.toUpperCase()}
            </span>
          </div>
        </div>

        {/* USER DETAILS */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-bold mb-4">Member Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <Detail label="Full Name" value={member.name} />
            <Detail label="Membership ID" value={member.membershipId} />
            <Detail label="Phone" value={member.phone} />
            <Detail label="Blood Group" value={member.bloodGroup || "N/A"} />
            <Detail label="Valid Upto" value={expiryDate} />
            <Detail
              label="Joined On"
              value={new Date(member.createdAt).toLocaleDateString()}
            />
          </div>
        </div>

        {/* PREVIEW & DOWNLOAD */}
        {member.membershipStatus === "approved" && (
          <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center gap-6">
            <button
              onClick={() => navigate("/member", { state: { user: member } })}
              className="bg-gray-800 text-white px-6 py-3 rounded-lg"
            >
              Preview Membership Card
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

/* SMALL HELPER COMPONENT */
function Detail({ label, value }) {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <p className="text-gray-500 text-xs">{label}</p>
      <p className="font-semibold text-gray-800">{value}</p>
    </div>
  );
}
