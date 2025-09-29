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

const { Search } = Input;

export default function ManageUser() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);

  // State modal edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();

  // State modal add
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addForm] = Form.useForm();

  // Fetch users theo nhóm
  const fetchUsers = async (maNhom) => {
    if (!maNhom) return;
    try {
      setLoading(true);
      const res = await userApi.getUsers(maNhom);
      const data = res?.content || [];
      setUsers(data);
      setFilteredUsers(data);
    } catch (err) {
      message.error("❌ Lỗi khi tải danh sách người dùng");
    } finally {
      setLoading(false);
    }
  };

  // Search user
  const handleSearch = (value) => {
    if (!value) {
      setFilteredUsers(users);
      return;
    }
    const lower = value.toLowerCase();
    const filtered = users.filter(
      (u) =>
        u.taiKhoan.toLowerCase().includes(lower) ||
        u.hoTen.toLowerCase().includes(lower) ||
        u.email.toLowerCase().includes(lower)
    );
    setFilteredUsers(filtered);
  };

  // Xoá user
  const handleDelete = async (taiKhoan) => {
    try {
      await userApi.deleteUser(taiKhoan);
      message.success("✅ Xóa người dùng thành công");
      fetchUsers(selectedGroup);
    } catch (err) {
      const errorMsg = `${err?.message || "Lỗi"} - ${
        err?.response?.data?.content || ""
      }`;
      message.error(errorMsg);
      console.error("Delete error:", err);
    }
  };

  // Edit user
  const handleEdit = (user) => {
    setEditingUser(user);
    form.setFieldsValue(user);
    setIsModalOpen(true);
  };

  // Update user
  const handleUpdate = async () => {
    try {
      const values = await form.validateFields();
      const payload = { ...values, soDt: values.soDT };
      await userApi.updateUser(payload);
      message.success("✅ Cập nhật người dùng thành công");
      setIsModalOpen(false);
      fetchUsers(selectedGroup);
    } catch (err) {
      message.error(err?.response?.data?.content || "❌ Cập nhật thất bại!");
    }
  };

  // Add user
  const handleAddUser = async () => {
    try {
      const values = await addForm.validateFields();
      const payload = { ...values, soDt: values.soDT };
      await userApi.addUser(payload);
      message.success("✅ Thêm người dùng thành công");
      setIsAddModalOpen(false);
      addForm.resetFields();
      fetchUsers(selectedGroup);
    } catch (err) {
      message.error(err?.response?.data?.content || "❌ Thêm người dùng thất bại!");
    }
  };

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
    <div className="p-2 sm:p-4 lg:p-6">
      {/* Header actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
          👥 Quản lý người dùng
        </h2>

        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          <Select
            placeholder="Chọn nhóm"
            className="w-full sm:w-32"
            onChange={(value) => {
              setSelectedGroup(value);
              fetchUsers(value);
            }}
          >
            {Array.from({ length: 8 }).map((_, i) => {
              const value = `GP0${i}`;
              return (
                <Select.Option key={value} value={value}>
                  {value}
                </Select.Option>
              );
            })}
          </Select>

          <Search
            placeholder="Nhập tên, email hoặc tài khoản"
            onSearch={handleSearch}
            enterButton
            allowClear
            disabled={!selectedGroup}
            className="w-full sm:w-60"
          />

          <Button
            type="primary"
            onClick={() => setIsAddModalOpen(true)}
            disabled={!selectedGroup}
            className="w-full sm:w-auto"
          >
            ➕ Thêm người dùng
          </Button>
        </div>
      </div>

      {/* Table */}
      <Table
        rowKey="taiKhoan"
        columns={columns}
        dataSource={filteredUsers}
        loading={loading}
        pagination={{ pageSize: 8 }}
        scroll={{ x: "max-content" }} // ✅ cho mobile scroll ngang
        className="shadow rounded"
      />

      {/* Modal Edit */}
      <Modal
        title="✏️ Sửa thông tin người dùng"
        open={isModalOpen}
        onOk={handleUpdate}
        onCancel={() => setIsModalOpen(false)}
        okText="Cập nhật"
        cancelText="Hủy"
        width="90%"
        className="max-w-lg"
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
            rules={[{ required: true, type: "email" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="soDT"
            label="Số điện thoại"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="maNhom" label="Nhóm" rules={[{ required: true }]}>
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
          <Form.Item name="maLoaiNguoiDung" label="Loại người dùng" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="KhachHang">Khách hàng</Select.Option>
              <Select.Option value="QuanTri">Quản trị</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="matKhau" label="Mật khẩu" rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal Add */}
      <Modal
        title="➕ Thêm người dùng mới"
        open={isAddModalOpen}
        onOk={handleAddUser}
        onCancel={() => setIsAddModalOpen(false)}
        okText="Thêm"
        cancelText="Hủy"
        width="90%"
        className="max-w-lg"
      >
        <Form form={addForm} layout="vertical" initialValues={{ maNhom: selectedGroup }}>
          <Form.Item name="taiKhoan" label="Tài khoản" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="hoTen" label="Họ tên" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: "email" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="soDT" label="Số điện thoại" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="maNhom" label="Nhóm" rules={[{ required: true }]}>
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
          <Form.Item name="maLoaiNguoiDung" label="Loại người dùng" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="KhachHang">Khách hàng</Select.Option>
              <Select.Option value="QuanTri">Quản trị</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="matKhau" label="Mật khẩu" rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
