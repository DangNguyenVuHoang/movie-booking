import { useState } from "react";
import {
  Form, Input, DatePicker, InputNumber, Switch, Button,
  Upload, Card, message, Select, Row, Col
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import movieApi from "../../api/movieApi";

export default function AddFilm() {
  const [form] = Form.useForm();
  const [image, setImage] = useState(null);

  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();
      formData.append("tenPhim", values.tenPhim);
      formData.append("trailer", values.trailer);
      formData.append("moTa", values.moTa);
      formData.append("maNhom", values.maNhom);
      formData.append("ngayKhoiChieu", values.ngayKhoiChieu.format("DD/MM/YYYY"));
      formData.append("sapChieu", values.sapChieu);
      formData.append("dangChieu", values.dangChieu);
      formData.append("hot", values.hot);
      formData.append("danhGia", values.danhGia);

      if (image) formData.append("hinhAnh", image, image.name);

      await movieApi.addMovie(formData);
      message.success("🎉 Thêm phim thành công!");
      form.resetFields();
      setImage(null);
    } catch (error) {
      console.error("❌ Lỗi khi thêm phim:", error);
      message.error("❌ Thêm phim thất bại!");
    }
  };

  return (
    <Card title="➕ Thêm phim mới" className="shadow-lg rounded-xl">
      <Form
        layout="vertical"
        form={form}
        onFinish={handleSubmit}
        initialValues={{
          ngayKhoiChieu: dayjs(),
          sapChieu: false,
          dangChieu: true,
          hot: false,
          danhGia: 5,
          maNhom: "GP01",
        }}
      >
        <Row gutter={[16, 16]}>
          {/* Cột trái */}
          <Col xs={24} md={12}>
            <Form.Item label="Tên phim" name="tenPhim" rules={[{ required: true }]}>
              <Input />
            </Form.Item>

            <Form.Item
              label="Trailer"
              name="trailer"
              rules={[
                { required: true, type: "url", message: "Trailer phải là URL hợp lệ" },
              ]}
            >
              <Input placeholder="https://..." />
            </Form.Item>

            <Form.Item label="Mô tả" name="moTa" rules={[{ required: true }]}>
              <Input.TextArea rows={3} />
            </Form.Item>

            <Form.Item label="Mã nhóm" name="maNhom" rules={[{ required: true }]}>
              <Select
                options={["GP01", "GP02", "GP03", "GP04", "GP05", "GP06", "GP07"].map(
                  (g) => ({ label: g, value: g })
                )}
              />
            </Form.Item>
          </Col>

          {/* Cột phải */}
          <Col xs={24} md={12}>
            <Form.Item
              label="Ngày khởi chiếu"
              name="ngayKhoiChieu"
              rules={[{ required: true }]}
            >
              <DatePicker format="DD/MM/YYYY" className="w-full" />
            </Form.Item>

            <Form.Item label="Đang chiếu" name="dangChieu" valuePropName="checked">
              <Switch />
            </Form.Item>

            <Form.Item label="Sắp chiếu" name="sapChieu" valuePropName="checked">
              <Switch />
            </Form.Item>

            <Form.Item label="Hot" name="hot" valuePropName="checked">
              <Switch />
            </Form.Item>

            <Form.Item label="Đánh giá" name="danhGia" rules={[{ required: true }]}>
              <InputNumber min={1} max={10} className="w-full" />
            </Form.Item>

            <Form.Item label="Upload Hình ảnh">
              <Upload
                beforeUpload={(file) => {
                  setImage(file);
                  return false;
                }}
                onRemove={() => setImage(null)}
                maxCount={1}
                accept="image/*"
              >
                <Button icon={<UploadOutlined />}>Chọn hình</Button>
              </Upload>

              {image && (
                <img
                  src={URL.createObjectURL(image)}
                  alt="preview"
                  className="mt-2 w-32 h-48 object-cover rounded"
                />
              )}
            </Form.Item>
          </Col>
        </Row>

        {/* Submit */}
        <Button type="primary" htmlType="submit" block size="large">
          ➕ Thêm phim
        </Button>
      </Form>
    </Card>
  );
}
