// src/components/Header.jsx
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import {
  UserOutlined,
  LogoutOutlined,
  LoginOutlined,
  IdcardOutlined,
} from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { logout } from "../redux/authSlice";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Header() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  // Lắng nghe scroll để đổi style header
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ❌ Không render Header trong admin
  if (location.pathname.startsWith("/admin")) return null;

  return (
    <motion.div
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Navbar
        expand="lg"
        className={`py-3 px-3 ${
          scrolled ? "bg-black shadow-lg" : "bg-dark"
        } navbar-dark transition-all duration-300`}
      >
        <Container fluid>
          {/* Logo */}
          <motion.div whileHover={{ scale: 1.1 }}>
            <Navbar.Brand
              as={Link}
              to="/user/home"
              className="fw-bold text-light fs-5"
              style={{ letterSpacing: "1px" }}
            >
              🎬 Movie Booking
            </Navbar.Brand>
          </motion.div>

          {/* Toggle cho mobile */}
          <Navbar.Toggle aria-controls="main-navbar" />
          <Navbar.Collapse id="main-navbar">
            {/* Navigation links */}
            <Nav className="me-auto">
              <Nav.Link
                as={Link}
                to="/user/home"
                className="fw-semibold text-light"
              >
                Trang chủ
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/user/movies"
                className="fw-semibold text-light"
              >
                Phim
              </Nav.Link>
              <Nav.Link as={Link} to="/" className="fw-semibold text-light">
                Liên hệ
              </Nav.Link>
            </Nav>

            {/* User actions */}
            <Nav>
              {user ? (
                <motion.div
                  className="d-flex align-items-center gap-2 text-light"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <UserOutlined />
                  <span className="fw-semibold">{user.taiKhoan}</span>

                  {/* Nút vào trang Tài khoản */}
                  <Button
                    as={Link}
                    to="/user/account"
                    variant="outline-info"
                    size="sm"
                    className="fw-semibold"
                  >
                    <IdcardOutlined /> Tài khoản
                  </Button>

                  {/* Nút đăng xuất */}
                  <Button
                    variant="outline-light"
                    size="sm"
                    onClick={handleLogout}
                    className="fw-semibold"
                  >
                    <LogoutOutlined /> Đăng xuất
                  </Button>
                </motion.div>
              ) : (
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Button
                    as={Link}
                    to="/login"
                    variant="primary"
                    size="sm"
                    className="fw-semibold"
                  >
                    <LoginOutlined /> Đăng nhập
                  </Button>
                </motion.div>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </motion.div>
  );
}
