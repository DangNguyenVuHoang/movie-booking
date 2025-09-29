// src/components/Header.jsx
import {
  UserOutlined,
  LogoutOutlined,
  LoginOutlined,
  IdcardOutlined,
  MenuOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../redux/authSlice";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Button } from "antd";

export default function Header({ mode = "user", navLinks = [], onMenuClick }) {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate(mode === "admin" ? "/login" : "/");
  };

  // Hiệu ứng scroll chỉ áp dụng cho user
  useEffect(() => {
    if (mode !== "user") return;
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [mode]);

  // ================== USER HEADER ==================
  if (mode === "user") {
    return (
      <motion.header
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed w-full top-0 z-30 transition-colors duration-300 ${
          scrolled ? "bg-black shadow-lg" : "bg-gray-900"
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-6 py-3">
          {/* Logo */}
          <motion.div whileHover={{ scale: 1.1 }}>
            <Link
              to="/user/home"
              className="text-white font-bold text-lg tracking-wide"
            >
              🎬 Movie Booking
            </Link>
          </motion.div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex gap-6 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-white font-medium hover:text-cyan-400 transition-colors"
              >
                {link.label}
              </Link>
            ))}

            {user ? (
              <div className="flex items-center gap-3 text-white">
                <UserOutlined />
                <span className="font-semibold">{user.taiKhoan}</span>
                <Link
                  to="/user/account"
                  className="px-3 py-1 border border-cyan-400 text-cyan-400 rounded-md hover:bg-cyan-400 hover:text-black transition"
                >
                  <IdcardOutlined /> Tài khoản
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1 border border-white rounded-md hover:bg-white hover:text-black transition"
                >
                  <LogoutOutlined /> Đăng xuất
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-3 py-1 bg-cyan-500 text-black rounded-md font-semibold hover:bg-cyan-400 transition"
              >
                <LoginOutlined /> Đăng nhập
              </Link>
            )}
          </nav>

          {/* Mobile button */}
          <button
            className="lg:hidden text-white text-2xl"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {open ? <CloseOutlined /> : <MenuOutlined />}
          </button>
        </div>

        {/* Mobile Menu Drawer */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              exit={{ height: 0 }}
              className="lg:hidden overflow-hidden bg-gray-800"
            >
              <div className="flex flex-col px-4 pb-4 space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setOpen(false)}
                    className="text-white font-medium hover:text-cyan-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}

                {user ? (
                  <div className="flex flex-col gap-3 text-white mt-2">
                    <div className="flex items-center gap-2">
                      <UserOutlined />
                      <span className="font-semibold">{user.taiKhoan}</span>
                    </div>
                    <Link
                      to="/user/account"
                      onClick={() => setOpen(false)}
                      className="px-3 py-1 border border-cyan-400 text-cyan-400 rounded-md hover:bg-cyan-400 hover:text-black transition text-center"
                    >
                      <IdcardOutlined /> Tài khoản
                    </Link>
                    <button
                      onClick={() => {
                        setOpen(false);
                        handleLogout();
                      }}
                      className="px-3 py-1 border border-white rounded-md hover:bg-white hover:text-black transition text-center"
                    >
                      <LogoutOutlined /> Đăng xuất
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setOpen(false)}
                    className="px-3 py-1 bg-cyan-500 text-black rounded-md font-semibold hover:bg-cyan-400 transition text-center"
                  >
                    <LoginOutlined /> Đăng nhập
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    );
  }

  // ================== ADMIN HEADER ==================
  if (mode === "admin") {
    return (
      <header className="bg-white shadow flex justify-between items-center px-4 md:px-6 h-14">
        <div className="flex items-center gap-3">
          {/* Nút menu chỉ hiện ở mobile */}
          {onMenuClick && (
            <button
              className="block md:hidden text-xl"
              onClick={onMenuClick}
              aria-label="Toggle admin menu"
            >
              <MenuOutlined />
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className="font-medium text-gray-700">
            {user?.taiKhoan || "Admin"}
          </span>
          <Button
            type="primary"
            danger
            icon={<LogoutOutlined />}
            onClick={handleLogout}
          >
            Đăng xuất
          </Button>
        </div>
      </header>
    );
  }

  return null;
}
