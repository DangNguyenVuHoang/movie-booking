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

  // 📌 State cho modal add
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addForm] = Form.useForm();

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

      const payload = {
        taiKhoan: values.taiKhoan,
        matKhau: values.matKhau,
        email: values.email,
        soDt: values.soDT,
        maNhom: values.maNhom || "GP05", // ✅ nếu không chọn -> GP05
        maLoaiNguoiDung: values.maLoaiNguoiDung,
        hoTen: values.hoTen,
      };

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

  // 📌 Tạo mới user
  const handleAddUser = async () => {
    try {
      const values = await addForm.validateFields();

      const payload = {
        taiKhoan: values.taiKhoan,
        matKhau: values.matKhau,
        email: values.email,
        soDt: values.soDT,
        maNhom: "GP05",
        maLoaiNguoiDung: values.maLoaiNguoiDung,
        hoTen: values.hoTen,
      };

      await userApi.addUser(payload);
      message.success("✅ Thêm người dùng thành công");
      setIsAddModalOpen(false);
      addForm.resetFields();
      fetchUsers();
    } catch (err) {
      const errorMsg =
        err?.response?.data?.content ||
        err?.message ||
        "❌ Thêm người dùng thất bại!";
      message.error(errorMsg);
      console.error("Add user error:", err);
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
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">👥 Quản lý người dùng</h2>
        <Button type="primary" onClick={() => setIsAddModalOpen(true)}>
          ➕ Thêm người dùng
        </Button>
      </div>

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

      {/* Modal Add User */}
{/* Modal Add User */}
<Modal
  title="➕ Thêm người dùng mới"
  open={isAddModalOpen}
  onOk={handleAddUser}
  onCancel={() => setIsAddModalOpen(false)}
  okText="Thêm"
  cancelText="Hủy"
>
  <Form
    form={addForm}
    layout="vertical"
    initialValues={{ maNhom: "GP05" }} // ✅ default GP05
  >
    <Form.Item
      name="taiKhoan"
      label="Tài khoản"
      rules={[{ required: true, message: "Vui lòng nhập tài khoản" }]}
    >
      <Input />
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

    {/* ✅ Chọn nhóm với default GP05 */}
    <Form.Item
      name="maNhom"
      label="Nhóm"
      rules={[{ required: true, message: "Vui lòng chọn nhóm" }]}
    >
      <Select>
        {Array.from({ length: 8 }).map((_, i) => {
          const value = `GP0${i}`;
          return (
            <Select.Option key={value} value={value}>
              {value}
            </Select.Option>
          );
        })}
      </Select>
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
