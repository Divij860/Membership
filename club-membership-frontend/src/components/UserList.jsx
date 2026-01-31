import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminUserList() {
  const [approvedUsers, setApprovedUsers] = useState([]);
  const [rejectedUsers, setRejectedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("adminToken");

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      if (!token) {
        setError("Admin token not found. Please login first.");
        setLoading(false);
        return;
      }

      const res = await axios.get("https://membership-brown.vercel.app/api/admin/all-users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const users = res.data.users || [];
      setApprovedUsers(users.filter(u => u.membershipStatus === "approved"));
      setRejectedUsers(users.filter(u => u.membershipStatus === "rejected"));
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Failed to fetch users. Check console."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin-login");
  };

  useEffect(() => {
    if (!token) {
      navigate("/admin-login");
    } else {
      fetchUsers();
    }
  }, [token, navigate]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">Loading users...</p>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md flex flex-col">
        <div className="px-6 py-4 text-2xl font-bold text-gray-800 border-b">
          Admin Panel
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          <button
            onClick={() => navigate("/admin")}
            className="w-full text-left block px-4 py-2 rounded-lg hover:bg-gray-200 text-gray-700 font-medium"
          >
            Dashboard
          </button>
          <button
            onClick={() => navigate("/users")}
            className="w-full text-left block px-4 py-2 rounded-lg hover:bg-gray-200 text-gray-700 font-medium"
          >
            Users
          </button>
        </nav>

        <button
          onClick={handleLogout}
          className="m-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          User List
        </h1>

        {/* Approved Users */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-green-600 mb-4">Approved Users</h2>
          {approvedUsers.length === 0 ? (
            <p className="text-gray-500">No approved users.</p>
          ) : (
            <div className="space-y-4">
              {approvedUsers.map(user => (
                <div
                  key={user._id}
                  className="bg-white shadow-md rounded-2xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center"
                >
                  <div className="flex items-center gap-4 mb-3">
  <img
    src={`${user.photo}`}
    alt={user.name}
    className="w-34 h-34 rounded-full  object-cover border mx-6"
    onError={(e) => {
      e.target.src = "/default-user.png"; // optional fallback
    }}
  />
  </div>
                  <div className="flex-1 space-y-1">
                    <p><span className="font-medium text-gray-700">Name:</span> {user.name}</p>
                    <p><span className="font-medium text-gray-700">Nickname:</span> {user.nickname}</p>
                    <p><span className="font-medium text-gray-700">Email:</span> {user.email}</p>
                    <p><span className="font-medium text-gray-700">Phone:</span> {user.phone}</p>
                    <p><span className="font-medium text-gray-700">Address:</span> {user.address}</p>
                    <p><span className="font-medium text-gray-700">BloodGroup:</span> {user.BloodGroup}</p>
                    <p><span className="font-medium text-gray-700">Age:</span> {user.age}</p>
                    <p><span className="font-medium text-gray-700">DOB:</span> {user.dob}</p>
                    <p><span className="font-medium text-gray-700">Membership ID:</span> {user.membershipId}</p>
                  </div>
                  <span className="mt-3 md:mt-0 px-3 py-1 rounded-full bg-green-500 text-white text-sm">
                    Approved
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Rejected Users */}
        <section>
          <h2 className="text-xl font-semibold text-red-600 mb-4">Rejected Users</h2>
          {rejectedUsers.length === 0 ? (
            <p className="text-gray-500">No rejected users.</p>
          ) : (
            <div className="space-y-4">
              {rejectedUsers.map(user => (
                <div
                  key={user._id}
                  className="bg-white shadow-md rounded-2xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center"
                >
                  <div className="flex-1 space-y-1">
                    <p><span className="font-medium text-gray-700">Name:</span> {user.name}</p>
                    <p><span className="font-medium text-gray-700">Email:</span> {user.email}</p>
                    <p><span className="font-medium text-gray-700">Phone:</span> {user.phone}</p>
                  </div>
                  <span className="mt-3 md:mt-0 px-3 py-1 rounded-full bg-red-500 text-white text-sm">
                    Rejected
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
