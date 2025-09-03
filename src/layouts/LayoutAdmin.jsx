// src/components/Sidebar.jsx
import { Menu } from "antd";
import { DashboardOutlined, VideoCameraOutlined, UserOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="h-full">
      <div className="text-white text-center py-4 font-bold text-lg">
        ⚙️ Admin Panel
      </div>
      <Menu theme="dark" mode="inline">
        <Menu.Item key="1" icon={<DashboardOutlined />}>
          <Link to="/admin">Dashboard</Link>
        </Menu.Item>
        <Menu.Item key="2" icon={<VideoCameraOutlined />}>
          <Link to="/admin/movies">Quản lý phim</Link>
        </Menu.Item>
        <Menu.Item key="3" icon={<UserOutlined />}>
          <Link to="/admin/users">Quản lý người dùng</Link>
        </Menu.Item>
      </Menu>
    </div>
  );
}
