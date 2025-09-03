// FilmForm.jsx
import { Form, Input, DatePicker, Switch, InputNumber, Button, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useState } from "react";
import dayjs from "dayjs";

export default function FilmForm({ initialValues, onSubmit, isEdit }) {
  const [form] = Form.useForm();
  const [file, setFile] = useState(null);

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        ...initialValues,
        ngayKhoiChieu: initialValues?.ngayKhoiChieu
          ? dayjs(initialValues.ngayKhoiChieu)
          : null,
      }}
      onFinish={(values) => {
        const formData = new FormData();
        if (isEdit) formData.append("maPhim", values.maPhim); // cần cho update

        formData.append("tenPhim", values.tenPhim);
        formData.append("trailer", values.trailer || "");
        formData.append("moTa", values.moTa);
        formData.append("maNhom", "GP05");
        formData.append(
          "ngayKhoiChieu",
          values.ngayKhoiChieu?.format("DD/MM/YYYY")
        );
        formData.append("sapChieu", values.sapChieu);
        formData.append("dangChieu", values.dangChieu);
        formData.append("hot", values.hot);
        formData.append("danhGia", values.danhGia);

        if (file) {
          formData.append("hinhAnh", file, file.name);
        }

        onSubmit(formData);
      }}
    >
      {isEdit && (
        <Form.Item name="maPhim" label="Mã phim">
          <Input disabled />
        </Form.Item>
      )}
      <Form.Item name="tenPhim" label="Tên phim" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="trailer" label="Trailer">
        <Input />
      </Form.Item>
      <Form.Item name="moTa" label="Mô tả">
        <Input.TextArea rows={3} />
      </Form.Item>
      <Form.Item name="ngayKhoiChieu" label="Ngày khởi chiếu">
        <DatePicker format="DD/MM/YYYY" />
      </Form.Item>
      <Form.Item name="sapChieu" label="Sắp chiếu" valuePropName="checked">
        <Switch />
      </Form.Item>
      <Form.Item name="dangChieu" label="Đang chiếu" valuePropName="checked">
        <Switch />
      </Form.Item>
      <Form.Item name="hot" label="Hot" valuePropName="checked">
        <Switch />
      </Form.Item>
      <Form.Item name="danhGia" label="Đánh giá">
        <InputNumber min={1} max={10} />
      </Form.Item>
      <Form.Item label="Hình ảnh">
        <Upload
          beforeUpload={(file) => {
            setFile(file);
            return false; // không upload ngay, chỉ lưu local
          }}
          maxCount={1}
        >
          <Button icon={<UploadOutlined />}>Chọn file</Button>
        </Upload>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          {isEdit ? "Cập nhật" : "Thêm mới"}
        </Button>
      </Form.Item>
    </Form>
  );
}
