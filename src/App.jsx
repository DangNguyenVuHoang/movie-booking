// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// User pages
import LandingPage from "./pages/LandingPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import ListMoviePage from "./pages/ListMoviePage.jsx";
import ListMovieDetail from "./pages/ListMovieDetail.jsx";
import AccountPage from "./pages/AccountPage.jsx";
import UserDashboard from "./pages/user/UserDashboard.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";

// Admin pages
import ManageUser from "./pages/admin/ManageUser.jsx";
import Films from "./pages/admin/Films.jsx";
import AddFilm from "./pages/admin/AddFilm.jsx";

// Layouts
import LayoutUser from "./layouts/LayoutUser.jsx";
import LayoutAdmin from "./layouts/LayoutAdmin.jsx";


// ========== Route Guards ========== //
function getUser() {
  return JSON.parse(localStorage.getItem("user"));
}

function PrivateRoute({ children }) {
  const user = getUser();
  return user ? children : <Navigate to="/login" />;
}

function PublicRoute({ children }) {
  const user = getUser();
  if (!user) return children;
  return user.maLoaiNguoiDung === "QuanTri"
    ? <Navigate to="/admin" />
    : <Navigate to="/user" />;
}

function AdminRoute({ children }) {
  const user = getUser();
  return user?.maLoaiNguoiDung === "QuanTri"
    ? children
    : <Navigate to="/login" />;
}

function UserRoute({ children }) {
  const user = getUser();
  return user?.maLoaiNguoiDung === "KhachHang"
    ? children
    : <Navigate to="/login" />;
}


// ========== App Component ========== //
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ---------- USER LAYOUT ---------- */}
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

        {/* ---------- ADMIN LAYOUT ---------- */}
        <Route
          path="/admin/*"
          element={
            <AdminRoute>
              <LayoutAdmin />
            </AdminRoute>
          }
        >
          {/* <Route index element={<h2>👋 Chào mừng Admin</h2>} />
          <Route path="users" element={<ManageUser />} />
          <Route path="movies" element={<Films />} />
          <Route path="movies/add" element={<AddFilm />} /> */}
           <Route path="*" element={<AdminDashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
