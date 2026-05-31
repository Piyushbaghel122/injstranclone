import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "../screens/Login";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" />
        <Route path="/api/auth/login" element={<Login />} />
        <Route path="/home" element={<div>Welcome home</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
