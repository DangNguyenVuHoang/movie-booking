// src/pages/user/UserDashboard.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "../HomePage";
import ListMoviePage from "../ListMoviePage";
import ListMovieDetail from "../ListMovieDetail";
import AccountPage from "../AccountPage";
// import Header from "../../components/Header";
// import Footer from "../../components/Footer";

export default function UserDashboard() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* ✅ Header user
      <Header /> */}

      {/* ✅ Nội dung chính */}
      <main className="flex-grow container mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Navigate to="/user/home" />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/movies" element={<ListMoviePage />} />
          <Route path="/movies/:id" element={<ListMovieDetail />} />
          <Route path="/account" element={<AccountPage />} />
        </Routes>
      </main>

      {/* ✅ Footer user
      <Footer /> */}
    </div>
  );
}
