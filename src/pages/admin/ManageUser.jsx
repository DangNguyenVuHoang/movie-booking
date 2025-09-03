import { useEffect, useState } from "react";
import { Table, Button, Space, Popconfirm, message } from "antd";
import userApi from "../../api/userApi";

export default function ManageUser() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await userApi.getUsers();
      setUsers(res.content); // API cybersoft trả về content
    } catch (err) {
      message.error("Lỗi khi tải danh sách người dùng");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (taiKhoan) => {
    try {
      await userApi.deleteUser(taiKhoan);
      message.success("Xóa người dùng thành công");
      fetchUsers(); // reload lại danh sách
    } catch (err) {
      message.error("Xóa thất bại");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const columns = [
    { title: "Tài khoản", dataIndex: "taiKhoan", key: "taiKhoan" },
    { title: "Họ tên", dataIndex: "hoTen", key: "hoTen" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "SĐT", dataIndex: "soDT", key: "soDT" },
    { title: "Loại người dùng", dataIndex: "maLoaiNguoiDung", key: "maLoaiNguoiDung" },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button type="primary">Sửa</Button>
          <Popconfirm
            title="Xóa người dùng?"
            onConfirm={() => handleDelete(record.taiKhoan)}
          >
            <Button danger>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">👥 Quản lý người dùng</h2>
      <Table
        rowKey="taiKhoan"
        columns={columns}
        dataSource={users}
        loading={loading}
      />
    </div>
  );
}
