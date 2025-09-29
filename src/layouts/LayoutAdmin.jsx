// src/layouts/LayoutAdmin.jsx
import { Layout, Menu, Drawer } from "antd";
import {
  DashboardOutlined,
  VideoCameraOutlined,
  UserOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Link, Outlet } from "react-router-dom";
import { useState } from "react";
import Header from "../components/Header"; // Dùng lại Header chung

const { Sider, Content } = Layout;

export default function LayoutAdmin() {
  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const menuItems = (
    <Menu
      theme="dark"
      mode="inline"
      defaultSelectedKeys={["1"]}
      className="h-full border-r-0"
    >
      <Menu.Item key="1" icon={<DashboardOutlined />}>
        <Link to="/admin/home">Dashboard</Link>
      </Menu.Item>
      <Menu.Item key="2" icon={<VideoCameraOutlined />}>
        <Link to="/admin/movies">Quản lý phim</Link>
      </Menu.Item>
      <Menu.Item key="3" icon={<PlusOutlined />}>
        <Link to="/admin/movies/add">Thêm phim</Link>
      </Menu.Item>
      <Menu.Item key="4" icon={<UserOutlined />}>
        <Link to="/admin/users">Quản lý người dùng</Link>
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar tablet/laptop */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(val) => setCollapsed(val)}
        width={220}
        collapsedWidth={80}
        className="hidden md:block"
      >
        <div
          className="text-white text-center py-4 font-bold text-lg"
          style={{ background: "linear-gradient(90deg,#0b63c6,#0b8fe6)" }}
        >
          {collapsed ? "⚙️" : "⚙️ Admin Panel"}
        </div>
        {menuItems}
      </Sider>

      {/* Drawer mobile */}
      <Drawer
        placement="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        width={220}
        className="drawer-admin md:hidden"
        title={
          <div className="flex items-center gap-2">
            <span>⚙️</span>
            <span className="font-semibold">Admin</span>
          </div>
        }
      >
        {menuItems}
      </Drawer>

      {/* Nội dung chính */}
      <Layout>
        <Header mode="admin" onMenuClick={() => setDrawerOpen(true)} />
        <Content className="m-4 bg-white p-4 sm:p-6 rounded shadow-sm">
          {/* Chỗ này render các route con */}
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
