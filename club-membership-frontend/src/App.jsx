import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminPage from "./components/AdminPage";
import MemberRegister from "./components/MemberRegister";
import UploadPayment from "./components/UpdatePayment";
import Login from "./components/Login";
import MemberDashboard from "./components/MembershipDashboard";
import UserList from "./components/UserList"
import AdminLogin from "./components/AdminLogin";


function App() {
  const userId = localStorage.getItem("userId"); // store user ID after login

  return (
    <Router>
      <Routes>
        <Route path="/Register" element={<MemberRegister />} />
        <Route path="/admin-login" element={<AdminLogin/>} />
        <Route path="/upload-payment" element={<UploadPayment />} />
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<MemberDashboard userId={userId} />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/users" element={<UserList />} />
      </Routes>
    </Router>
  );
}

export default App;
