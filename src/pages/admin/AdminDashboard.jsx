// src/pages/admin/AdminDashboard.jsx
import { useState, useEffect } from "react";
import { Layout, Menu, Button } from "antd";
import {
  UserOutlined,
  VideoCameraOutlined,
  PlusOutlined,
  LogoutOutlined,
  DashboardOutlined,
} from "@ant-design/icons";
import { Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ManageUser from "./ManageUser";
import Films from "./Films";
import AddFilm from "./AddFilm";
import { logout } from "../../redux/authSlice";

const { Header, Sider, Content } = Layout;

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((s) => s.auth || {});
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const getSelectedKey = () => {
    const path = location.pathname;
    if (path.startsWith("/admin/movies/add")) return "4";
    if (path.startsWith("/admin/movies")) return "3";
    if (path.startsWith("/admin/users")) return "2";
    if (path === "/admin" || path === "/admin/") return "1";
    return "1";
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(val) => setCollapsed(val)}
        width={220}
        collapsedWidth={80}
      >
        <div
          style={{
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontWeight: 700,
            fontSize: 16,
            background: "linear-gradient(90deg,#0b63c6,#0b8fe6)",
          }}
        >
          {!collapsed ? "🎬 Admin Panel" : "🎬"}
        </div>

        <Menu theme="dark" mode="inline" selectedKeys={[getSelectedKey()]}>
          <Menu.Item key="1" icon={<DashboardOutlined />}>
            <Link to="/admin">Dashboard</Link>
          </Menu.Item>
          <Menu.Item key="2" icon={<UserOutlined />}>
            <Link to="/admin/users">Quản lý người dùng</Link>
          </Menu.Item>
          <Menu.SubMenu key="sub1" icon={<VideoCameraOutlined />} title="Quản lý phim">
            <Menu.Item key="3" icon={<VideoCameraOutlined />}>
              <Link to="/admin/movies">Films</Link>
            </Menu.Item>
            <Menu.Item key="4" icon={<PlusOutlined />}>
              <Link to="/admin/movies/add">Thêm phim</Link>
            </Menu.Item>
          </Menu.SubMenu>
        </Menu>
      </Sider>

      {/* Phần chính */}
      <Layout>
        {/* Header */}
        <Header
          style={{
            background: "#fff",
            padding: "0 20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          }}
        >
          <h3 style={{ margin: 0 }}>👨‍💻 Quản trị hệ thống</h3>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontWeight: 600 }}>{user?.taiKhoan || "Admin"}</span>
            <Button type="primary" danger icon={<LogoutOutlined />} onClick={handleLogout}>
              Đăng xuất
            </Button>
          </div>
        </Header>

        {/* Content */}
        <Content style={{ margin: "16px", background: "#fff", padding: 20 }}>
          <Routes>
            <Route path="/" element={<h2>Chào mừng Admin 👋</h2>} />
            <Route path="/users" element={<ManageUser />} />
            <Route path="/movies" element={<Films />} />
            <Route path="/movies/add" element={<AddFilm />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
}
