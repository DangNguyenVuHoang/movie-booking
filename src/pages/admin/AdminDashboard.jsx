// src/pages/admin/AdminDashboard.jsx
import { Layout, Menu } from "antd";
import { UserOutlined, VideoCameraOutlined, HomeOutlined } from "@ant-design/icons";
import { Routes, Route, Link } from "react-router-dom";
import ManageUser from "./ManageUser";
import ManageMovie from "./ManageMovie";

const { Header, Sider, Content } = Layout;

export default function AdminDashboard() {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider>
        <div className="text-white text-center py-4 font-bold text-lg">
          🎬 Admin Panel
        </div>
        <Menu theme="dark" mode="inline">
          <Menu.Item key="1" icon={<HomeOutlined />}>
            <Link to="/admin">Trang chính</Link>
          </Menu.Item>
          <Menu.Item key="2" icon={<UserOutlined />}>
            <Link to="/admin/users">Quản lý User</Link>
          </Menu.Item>
          <Menu.Item key="3" icon={<VideoCameraOutlined />}>
            <Link to="/admin/movies">Quản lý Phim</Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header style={{ background: "#fff", padding: 0 }} />
        <Content style={{ margin: "16px" }}>
          <Routes>
            <Route path="/" element={<h2>Chào mừng Admin 👋</h2>} />
            <Route path="/users" element={<ManageUser />} />
            <Route path="/movies" element={<ManageMovie />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
}
