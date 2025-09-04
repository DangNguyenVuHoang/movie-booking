// src/pages/admin/ManageUser.jsx
import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Space,
  Popconfirm,
  message,
  Modal,
  Form,
  Input,
  Select,
} from "antd";
import userApi from "../../api/userApi";

export default function ManageUser() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // 📌 State cho modal edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();

  // 📌 Lấy danh sách user
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await userApi.getUsers();
      setUsers(res?.content || []); // Cybersoft API trả về { content: [...] }
    } catch (err) {
      message.error("❌ Lỗi khi tải danh sách người dùng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 📌 Xoá user
  const handleDelete = async (taiKhoan) => {
    try {
      await userApi.deleteUser(taiKhoan);
      message.success("✅ Xóa người dùng thành công");
      fetchUsers();
    } catch (err) {
      const errorMsg = `${err?.message || "Lỗi"} - ${err?.response?.data?.content || ""}`;
      message.error(errorMsg);
      console.error("Delete error:", err);
    }
  };

  // 📌 Bấm nút sửa
  const handleEdit = (user) => {
    setEditingUser(user);
    form.setFieldsValue(user); // Load dữ liệu user vào form
    setIsModalOpen(true);
  };

 // 📌 Cập nhật user
const handleUpdate = async () => {
  try {
    const values = await form.validateFields();

    // Map dữ liệu đúng với API
    const payload = {
      taiKhoan: values.taiKhoan,
      matKhau: values.matKhau,
      email: values.email,
      soDt: values.soDT, // 🛠 map đúng key
      maNhom: "GP05", // hoặc "GP00", tuỳ nhóm bạn dùng
      maLoaiNguoiDung: values.maLoaiNguoiDung,
      hoTen: values.hoTen,
    };

    console.log("📤 Payload gửi đi:", payload); // 👉 kiểm tra log

    await userApi.updateUser(payload);
    message.success("✅ Cập nhật người dùng thành công");
    setIsModalOpen(false);
    fetchUsers();
  } catch (err) {
    const errorMsg =
      err?.response?.data?.content ||
      err?.message ||
      "❌ Cập nhật thất bại, vui lòng thử lại!";
    message.error(errorMsg);
    console.error("Update error:", err);
  }
};

  const columns = [
    { title: "Tài khoản", dataIndex: "taiKhoan", key: "taiKhoan" },
    { title: "Họ tên", dataIndex: "hoTen", key: "hoTen" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "SĐT", dataIndex: "soDT", key: "soDT" },
    {
      title: "Loại người dùng",
      dataIndex: "maLoaiNguoiDung",
      key: "maLoaiNguoiDung",
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button type="primary" onClick={() => handleEdit(record)}>
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc muốn xoá người dùng này?"
            okText="Xoá"
            cancelText="Hủy"
            onConfirm={() => handleDelete(record.taiKhoan)}
          >
            <Button danger>Xoá</Button>
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
        pagination={{ pageSize: 8 }}
      />

      {/* Modal Edit User */}
      <Modal
        title="✏️ Sửa thông tin người dùng"
        open={isModalOpen}
        onOk={handleUpdate}
        onCancel={() => setIsModalOpen(false)}
        okText="Cập nhật"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="taiKhoan" label="Tài khoản">
            <Input disabled />
          </Form.Item>
          <Form.Item
            name="hoTen"
            label="Họ tên"
            rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Vui lòng nhập email" },
              { type: "email", message: "Email không hợp lệ" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="soDT"
            label="Số điện thoại"
            rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="maLoaiNguoiDung"
            label="Loại người dùng"
            rules={[{ required: true, message: "Vui lòng chọn loại người dùng" }]}
          >
            <Select>
              <Select.Option value="KhachHang">Khách hàng</Select.Option>
              <Select.Option value="QuanTri">Quản trị</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="matKhau"
            label="Mật khẩu"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
          >
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
