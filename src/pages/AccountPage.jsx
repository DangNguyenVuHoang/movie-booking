import { useSelector, useDispatch } from "react-redux";
import { Form, Input, Button, Card, message, Select } from "antd";
import { useEffect } from "react";
import authApi from "../api/authApi";
import { login } from "../redux/authSlice";

export default function AccountPage() {
  const { user } = useSelector((state) => state.auth);
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        taiKhoan: user.taiKhoan,
        matKhau: user.matKhau,
        hoTen: user.hoTen,
        email: user.email,
        soDt: user.soDT,
        maNhom: user.maNhom,
        maLoaiNguoiDung: user.maLoaiNguoiDung,
      });
    }
  }, [user, form]);

  const handleUpdate = async (values) => {
    try {
      const res = await authApi.updateAccount(values);
      message.success("Cập nhật thông tin thành công!");

      // cập nhật redux + localStorage
      dispatch(login.fulfilled(res.content));
      localStorage.setItem("user", JSON.stringify(res.content));
    } catch (error) {
      console.error(error);
      message.error("Cập nhật thất bại!");
    }
  };

  if (!user) {
    return <p className="text-center mt-10 text-lg">Vui lòng đăng nhập trước</p>;
  }

  return (
    <div
      className="flex justify-center items-center min-h-screen"
    >
      <Card
        title={<h2 className="text-center text-2xl font-bold text-blue-600">👤 Thông tin tài khoản</h2>}
        className="w-[500px] shadow-2xl rounded-2xl"
        styles={{ header: { borderBottom: "none", textAlign: "center" } }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdate}
          
          initialValues={user}
        >
          <Form.Item label="Tài khoản" name="taiKhoan">
            <Input disabled />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="matKhau"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Họ tên"
            name="hoTen"
            rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Email" name="email">
            <Input disabled />
          </Form.Item>

          <Form.Item
            label="Số điện thoại"
            name="soDt"
            rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Mã nhóm"
            name="maNhom"
            rules={[{ required: true, message: "Vui lòng nhập mã nhóm!" }]}
          >
            <Input placeholder="VD: GP01, GP02..." />
          </Form.Item>

          <Form.Item
            label="Loại người dùng"
            name="maLoaiNguoiDung"
            rules={[{ required: true, message: "Vui lòng chọn loại người dùng!" }]}
          >
            <Select>
              <Select.Option value="KhachHang">Khách hàng</Select.Option>
              <Select.Option value="QuanTri">Quản trị</Select.Option>
            </Select>
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            style={{
              background: "linear-gradient(90deg, #1CB5E0, #000851)",
              border: "none",
              fontWeight: "600",
            }}
          >
            Cập nhật
          </Button>
        </Form>
      </Card>
    </div>
  );
}
