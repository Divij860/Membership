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

      const res = await axios.get(
        "https://membership-brown.vercel.app/api/admin/all-users",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const users = res.data.users || [];
      setApprovedUsers(users.filter((u) => u.membershipStatus === "approved"));
      setRejectedUsers(users.filter((u) => u.membershipStatus === "rejected"));
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
    <div className="flex min-h-screen bg-gray-100 flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white shadow-md flex md:flex-col flex-row md:min-h-screen">
        <div className="px-4 py-3 md:px-6 md:py-4 text-xl md:text-2xl font-bold text-gray-800 border-b w-full">
          Admin Panel
        </div>

        <nav className="flex-1 px-2 py-3 md:px-4 md:py-6 flex md:block gap-2 md:space-y-2">
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
          className="m-2 md:m-4 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm md:text-base"
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-3 md:p-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 text-center">
          User List
        </h1>

        {/* Approved Users */}
        <section className="mb-10">
          <h2 className="text-lg md:text-xl font-semibold text-green-600 mb-4">
            Approved Users
          </h2>

          {approvedUsers.length === 0 ? (
            <p className="text-gray-500">No approved users.</p>
          ) : (
            <div className="space-y-4">
              {approvedUsers.map((user) => (
                <div
                  key={user._id}
                  className="bg-white shadow-md rounded-2xl p-4 md:p-5 flex flex-col md:flex-row gap-4 items-start md:items-center"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={`${user.photo}`}
                      alt={user.name}
                      className="w-20 h-20 md:w-32 md:h-32 rounded-full object-cover border"
                      onError={(e) => {
                        e.target.src = "/default-user.png";
                      }}
                    />
                  </div>

                  <div className="flex-1 space-y-1 text-sm md:text-base">
                    <p><span className="font-medium">Name:</span> {user.name}</p>
                    <p><span className="font-medium">Nickname:</span> {user.nickname}</p>
                    <p><span className="font-medium">Email:</span> {user.email}</p>
                    <p><span className="font-medium">Phone:</span> {user.phone}</p>
                    <p><span className="font-medium">Address:</span> {user.address}</p>
                    <p><span className="font-medium">BloodGroup:</span> {user.BloodGroup}</p>
                    <p><span className="font-medium">Age:</span> {user.age}</p>
                    <p><span className="font-medium">DOB:</span> {user.dob}</p>
                    <p><span className="font-medium">Membership ID:</span> {user.membershipId}</p>
                  </div>

                  <span className="px-3 py-1 rounded-full bg-green-500 text-white text-sm self-start md:self-auto">
                    Approved
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Rejected Users */}
        <section>
          <h2 className="text-lg md:text-xl font-semibold text-red-600 mb-4">
            Rejected Users
          </h2>

          {rejectedUsers.length === 0 ? (
            <p className="text-gray-500">No rejected users.</p>
          ) : (
            <div className="space-y-4">
              {rejectedUsers.map((user) => (
                <div
                  key={user._id}
                  className="bg-white shadow-md rounded-2xl p-4 md:p-5 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center"
                >
                  <div className="flex-1 space-y-1 text-sm md:text-base">
                    <p><span className="font-medium">Name:</span> {user.name}</p>
                    <p><span className="font-medium">Email:</span> {user.email}</p>
                    <p><span className="font-medium">Phone:</span> {user.phone}</p>
                  </div>

                  <span className="px-3 py-1 rounded-full bg-red-500 text-white text-sm">
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
