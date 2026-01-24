import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null); // stores userId being approved/rejected
  const [error, setError] = useState(""); // new: inline error messages
  const navigate = useNavigate();

  const token = localStorage.getItem("adminToken");

  const authHeader = {
    headers: { Authorization: `Bearer ${token}` },
  };

  // Fetch pending users
  const fetchUsers = async () => {
    if (!token) {
      navigate("/admin-login");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const res = await axios.get(
        "https://membership-brown.vercel.app/api/admin/pending-users",
        authHeader
      );
      setUsers(res.data.users || []);
    } catch (err) {
      console.error("Fetch users error:", err.response?.data);
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem("adminToken");
        setUsers([]);
        navigate("/admin-login");
      } else {
        setError(err.response?.data?.message || "Error fetching users");
      }
    } finally {
      setLoading(false);
    }
  };

  const approveUser = async (id) => {
    try {
      setActionLoading(id);
      setError("");
      const res = await axios.put(
        `https://membership-brown.vercel.app/api/admin/approve/${id}`,
        {},
        authHeader
      );
      alert(`User approved! Membership ID: ${res.data.user.membershipId}`);
      fetchUsers();
    } catch (err) {
      console.error("Approve error:", err.response?.data);
      setError(err.response?.data?.message || "Error approving user");
    } finally {
      setActionLoading(null);
    }
  };

  const rejectUser = async (id) => {
    try {
      setActionLoading(id);
      setError("");
      await axios.put(
        `https://membership-brown.vercel.app/api/admin/reject/${id}`,
        {},
        authHeader
      );
      fetchUsers();
    } catch (err) {
      console.error("Reject error:", err.response?.data);
      setError(err.response?.data?.message || "Error rejecting user");
    } finally {
      setActionLoading(null);
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin-login");
  };

  // Check token and fetch users on mount
  useEffect(() => {
    if (!token) {
      navigate("/admin-login");
      return;
    }
    fetchUsers();
  }, [token, navigate]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md flex flex-col">
        <div className="px-6 py-4 text-2xl font-bold text-gray-800 border-b">
          Admin Panel
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          <button
            onClick={() => window.scrollTo(0, 0)}
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
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Pending Approvals
        </h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {loading ? (
          <p className="text-center text-gray-500 text-lg mt-6">
            Loading users...
          </p>
        ) : users.length === 0 ? (
          <p className="text-center text-gray-500 text-lg mt-6">
            No pending users
          </p>
        ) : (
          <div className="space-y-6">
            {users.map((user) => (
              <div
                key={user._id}
                className="bg-white shadow-md rounded-2xl p-5 flex flex-col md:flex-row gap-5 items-center"
              >
                {user.photo ? (
                  <img
                    src={`https://membership-brown.vercel.app/uploads/${user.photo}`}
                    alt={user.name}
                    className="w-20 h-20 rounded-full object-cover border"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                    No Photo
                  </div>
                )}

                <div className="flex-1">
                  <p><b>Name:</b> {user.name}</p>
                  <p><b>Email:</b> {user.email || "—"}</p>
                  <p><b>Phone:</b> {user.phone}</p>

                  {user.paymentProof && (
                    <a
                      href={`https://membership-brown.vercel.app/uploads/${user.paymentProof}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 text-sm"
                    >
                      View Payment Proof
                    </a>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => approveUser(user._id)}
                    disabled={actionLoading === user._id}
                    className={`px-4 py-2 rounded-lg text-white ${
                      actionLoading === user._id
                        ? "bg-green-400 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700"
                    }`}
                  >
                    {actionLoading === user._id ? "Processing..." : "Approve"}
                  </button>

                  <button
                    onClick={() => rejectUser(user._id)}
                    disabled={actionLoading === user._id}
                    className={`px-4 py-2 rounded-lg text-white ${
                      actionLoading === user._id
                        ? "bg-red-400 cursor-not-allowed"
                        : "bg-red-600 hover:bg-red-700"
                    }`}
                  >
                    {actionLoading === user._id ? "Processing..." : "Reject"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
