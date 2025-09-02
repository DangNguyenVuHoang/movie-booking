import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import ListMoviePage from "./pages/ListMoviePage.jsx";
import ListMovieDetail from "./pages/ListMovieDetail.jsx";
import AccountPage from "./pages/AccountPage.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx"; // ✅ Giao diện admin
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";

// ✅ Route yêu cầu login
function PrivateRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));
  return user ? children : <Navigate to="/login" />;
}

// ✅ Route dành cho login/register, chặn khi đã login
function PublicRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));
  return user ? (
    user.maLoaiNguoiDung === "QuanTri" ? (
      <Navigate to="/admin" />
    ) : (
      <Navigate to="/home" />
    )
  ) : (
    children
  );
}

// ✅ Route dành riêng cho admin
function AdminRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));
  return user?.maLoaiNguoiDung === "QuanTri" ? (
    children
  ) : (
    <Navigate to="/home" />
  );
}

export default function App() {
  return (
    <BrowserRouter>
      {/* Header ẩn ở trang Admin */}
      {window.location.pathname.startsWith("/admin") ? null : <Header />}

      {/* Nội dung */}
      <main
        className="container-fluid flex-grow mb-5"
        style={{ maxWidth: "2000px" }}
      >
        <Routes>
          {/* Public */}
          <Route path="/" element={<LandingPage />} />

          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <RegisterPage />
              </PublicRoute>
            }
          />

          {/* User */}
          <Route
            path="/home"
            element={
              <PrivateRoute>
                <HomePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/account"
            element={
              <PrivateRoute>
                <AccountPage />
              </PrivateRoute>
            }
          />
          <Route path="/movies" element={<ListMoviePage />} />
          <Route path="/movies/:id" element={<ListMovieDetail />} />

          {/* Admin */}
          <Route
            path="/admin/*"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
        </Routes>
      </main>

      {/* Footer cũng ẩn ở trang Admin */}
      {window.location.pathname.startsWith("/admin") ? null : <Footer />}
    </BrowserRouter>
  );
}
