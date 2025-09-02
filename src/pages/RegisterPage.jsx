import { useState } from "react";
import { Form, Input, Button, Typography, message } from "antd";
import { useNavigate } from "react-router-dom";
import authApi from "../api/authApi"; // bạn cần có file authApi để call API

const { Title } = Typography;

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      setLoading(true);
      // Gọi API đăng ký
      await authApi.register(values);
      message.success("Đăng ký thành công! Vui lòng đăng nhập.");
      navigate("/login");
    } catch (err) {
      console.error("Đăng ký lỗi:", err);
      message.error(err.response?.data?.content || "Đăng ký thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-red-500 to-orange-400">
      <div className="bg-white shadow-lg rounded-2xl p-10 w-full max-w-md">
        <Title level={2} className="text-center text-red-600 mb-6">
          Đăng Ký Tài Khoản
        </Title>

        <Form
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ maNhom: "GP05" }}
        >
          <Form.Item
            label="Tài khoản"
            name="taiKhoan"
            rules={[{ required: true, message: "Vui lòng nhập tài khoản!" }]}
          >
            <Input placeholder="Nhập tài khoản" />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="matKhau"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <Input.Password placeholder="Nhập mật khẩu" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
          >
            <Input placeholder="Nhập email" />
          </Form.Item>

          <Form.Item
            label="Số điện thoại"
            name="soDt"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại!" },
              { pattern: /^[0-9]{9,11}$/, message: "Số điện thoại không hợp lệ!" },
            ]}
          >
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>

          <Form.Item
            label="Mã nhóm"
            name="maNhom"
            rules={[{ required: true, message: "Vui lòng nhập mã nhóm!" }]}
          >
            <Input placeholder="VD: GP05" />
          </Form.Item>

          <Form.Item
            label="Họ tên"
            name="hoTen"
            rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
          >
            <Input placeholder="Nhập họ tên" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              className="bg-red-600 hover:bg-red-700"
            >
              Đăng Ký
            </Button>
          </Form.Item>
        </Form>

        <p className="text-center mt-4">
          Đã có tài khoản?{" "}
          <span
            className="text-red-600 font-semibold cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Đăng nhập
          </span>
        </p>
      </div>
    </div>
  );
}
