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

      if (user.maLoaiNguoiDung === "QuanTri") {
        navigate("/admin");
      } else if (user.maLoaiNguoiDung === "KhachHang") {
        navigate("/user");
      } else {
        navigate("/home");
      }
    } catch (err) {
      console.error("Login error:", err);
      message.error("Sai tài khoản hoặc mật khẩu!");
    }
  };
// bg-gradient-to-br from-[#141E30] to-[#243B55]
  return (
    <div className="flex justify-center items-center min-h-screen px-4">
      <Card
        title={
          <h2 className="text-center text-xl sm:text-2xl md:text-3xl font-bold text-blue-600">
            🎬 Đăng nhập
          </h2>
        }
        className="
          w-full
          max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl
          shadow-2xl rounded-2xl
        "
        styles={{
          header: { borderBottom: "none", textAlign: "center" },
        }}
      >
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label={<span className="font-medium text-sm sm:text-base">Tài khoản</span>}
            name="taiKhoan"
            rules={[{ required: true, message: "Vui lòng nhập tài khoản!" }]}
          >
            <Input placeholder="Nhập tài khoản" size="large" />
          </Form.Item>

          <Form.Item
            label={<span className="font-medium text-sm sm:text-base">Mật khẩu</span>}
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
            className="!bg-gradient-to-r from-[#1CB5E0] to-[#000851] !border-none font-semibold"
          >
            Đăng nhập
          </Button>
        </Form>

        <p className="mt-4 text-center text-xs sm:text-sm text-gray-500">
          Chưa có tài khoản?{" "}
          <Link to="/register" className="text-blue-500 hover:underline">
            Đăng ký ngay
          </Link>
        </p>
      </Card>
    </div>
  );
}
