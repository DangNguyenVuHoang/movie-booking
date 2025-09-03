import { Form, Input, Button, Card, message } from "antd";
import { useDispatch } from "react-redux";
import { login } from "../redux/authSlice";
import { useNavigate, Link } from "react-router-dom";

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const user = await dispatch(login(values)).unwrap();
      message.success("Đăng nhập thành công!");

      // ✅ Điều hướng theo role
      if (user.maLoaiNguoiDung === "QuanTri") {
        navigate("/admin");
      } else if (user.maLoaiNguoiDung === "KhachHang") {
        navigate("/user");
      } else {
        // fallback → nếu có role khác
        navigate("/home");
      }
    } catch (err) {
      console.error("Login error:", err);
      message.error("Sai tài khoản hoặc mật khẩu!");
    }
  };

  return (
    <div
      className="flex justify-center items-center min-h-screen"
      style={{
        background: "linear-gradient(135deg, #141E30, #243B55)", // nền tối gradient
      }}
    >
      <Card
        title={
          <h2 className="text-center text-2xl font-bold text-blue-600">
            🎬 Đăng nhập
          </h2>
        }
        className="w-96 shadow-2xl rounded-2xl"
        styles={{
          header: {
            borderBottom: "none",
            textAlign: "center",
          },
        }}
      >
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label={<span className="font-medium">Tài khoản</span>}
            name="taiKhoan"
            rules={[{ required: true, message: "Vui lòng nhập tài khoản!" }]}
          >
            <Input placeholder="Nhập tài khoản" size="large" />
          </Form.Item>
          <Form.Item
            label={<span className="font-medium">Mật khẩu</span>}
            name="matKhau"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <Input.Password placeholder="Nhập mật khẩu" size="large" />
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
            Đăng nhập
          </Button>
        </Form>
        <p className="mt-4 text-center text-sm text-gray-200">
          Chưa có tài khoản?{" "}
          <Link to="/register" className="text-blue-400 hover:underline">
            Đăng ký ngay
          </Link>
        </p>
      </Card>
    </div>
  );
}
