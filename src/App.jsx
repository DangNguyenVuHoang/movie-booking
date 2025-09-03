import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import ListMoviePage from "./pages/ListMoviePage.jsx";
import ListMovieDetail from "./pages/ListMovieDetail.jsx";
import AccountPage from "./pages/AccountPage.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import UserDashboard from "./pages/user/UserDashboard.jsx";

import LayoutUser from "./layouts/LayoutUser.jsx";

// ✅ Route guards
function PrivateRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));
  return user ? children : <Navigate to="/login" />;
}
function PublicRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));
  return user ? (
    user.maLoaiNguoiDung === "QuanTri" ? (
      <Navigate to="/admin" />
    ) : (
      <Navigate to="/user" />
    )
  ) : (
    children
  );
}
function AdminRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));
  return user?.maLoaiNguoiDung === "QuanTri" ? children : <Navigate to="/user" />;
}
function UserRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));
  return user?.maLoaiNguoiDung === "KhachHang" ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Layout cho user */}
        <Route element={<LayoutUser />}>
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
              <UserRoute>
                <AccountPage />
              </UserRoute>
            }
          />
          <Route path="/movies" element={<ListMoviePage />} />
          <Route path="/movies/:id" element={<ListMovieDetail />} />

          {/* Dashboard user */}
          <Route
            path="/user/*"
            element={
              <UserRoute>
                <UserDashboard />
              </UserRoute>
            }
          />
        </Route>

        {/* Layout cho admin - KHÔNG bọc LayoutAdmin nữa */}
        <Route
          path="/admin/*"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
