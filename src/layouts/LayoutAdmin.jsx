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
import Header from "../components/Header"; 
import Footer from "../components/Footer";

const { Sider, Content } = Layout;

export default function LayoutAdmin() {
  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const menuItems = (
    <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]}>
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
        bodyStyle={{ padding: 0 }} // bỏ padding mặc định
      >
        <div className="h-full">{menuItems}</div>
      </Drawer>

      {/* Nội dung chính */}
      <Layout className="flex flex-col">
        <Header mode="admin" onMenuClick={() => setDrawerOpen(true)} />

        {/* Content fill height */}
        <Content className="flex-1 p-4 sm:p-6 bg-white">
          <Outlet />
        </Content>

        {/* Footer */}
        <Footer />
      </Layout>
    </Layout>
  );
}
