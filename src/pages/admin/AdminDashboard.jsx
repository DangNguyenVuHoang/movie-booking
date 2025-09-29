// src/pages/admin/AdminDashboard.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import ManageUser from "./ManageUser";
import Films from "./Films";
import AddFilm from "./AddFilm";

export default function AdminDashboard() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/admin/home" />} />
      <Route path="/home" element={<h2 className="text-xl font-bold">👋 Chào mừng Admin</h2>} />
      <Route path="/users" element={<ManageUser />} />
      <Route path="/movies" element={<Films />} />
      <Route path="/movies/add" element={<AddFilm />} />
    </Routes>
  );
}
