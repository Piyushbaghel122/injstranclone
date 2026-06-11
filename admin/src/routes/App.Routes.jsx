import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "../screens/Login";
import Register from "../screens/regitser";
import Phone from "../screens/Phone.jsx";
import Feed from "../auth/pages/feed.jsx";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/phone" element={<Phone />} />
        <Route path="/otp" element={<Phone />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
