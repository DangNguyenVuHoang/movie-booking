// src/pages/admin/Films.jsx
import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Popconfirm,
  message,
  Space,
  Modal,
  Form,
  Input,
  DatePicker,
  Switch,
  InputNumber,
  Upload,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import movieApi from "../../api/movieApi";
import ModalFormTaoLichChieu from "./ModalFormTaoLichChieu";

export default function Films() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [form] = Form.useForm();
  const [file, setFile] = useState(null);
  const [showtimeMovie, setShowtimeMovie] = useState(null);

  // ✅ Load danh sách phim
  const fetchMovies = async () => {
    try {
      setLoading(true);
      const res = await movieApi.getMovies();
      setMovies(res.content || []);
    } catch (err) {
      console.error(err);
      message.error("Không tải được danh sách phim!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  // ✅ Xóa phim
  const handleDelete = async (maPhim) => {
    try {
      await movieApi.deleteMovie(maPhim);
      message.success("Xóa phim thành công!");
      fetchMovies();
    } catch (err) {
      console.error(err);
      message.error("Xóa phim thất bại!");
    }
  };

  // ✅ Submit cập nhật
  const handleUpdate = async (values) => {
    try {
      const formData = new FormData();
      formData.append("maPhim", values.maPhim);
      formData.append("tenPhim", values.tenPhim);
      formData.append("trailer", values.trailer || "");
      formData.append("moTa", values.moTa);
      formData.append("maNhom", "GP05");
      formData.append(
        "ngayKhoiChieu",
        values.ngayKhoiChieu.format("DD/MM/YYYY")
      );
      formData.append("sapChieu", values.sapChieu);
      formData.append("dangChieu", values.dangChieu);
      formData.append("hot", values.hot);
      formData.append("danhGia", values.danhGia);

      if (file) {
        formData.append("hinhAnh", file, file.name);
      }

      await movieApi.updateMovie(formData);
      message.success("Cập nhật phim thành công!");
      setEditingMovie(null);
      fetchMovies();
    } catch (err) {
      console.error(err);
      message.error("Cập nhật thất bại!");
    }
  };

  // ✅ Columns cho bảng
  const columns = [
    { title: "Mã phim", dataIndex: "maPhim", key: "maPhim", width: 90 },
    {
      title: "Tên phim",
      dataIndex: "tenPhim",
      key: "tenPhim",
      // Cách 1: Tự động xuống dòng
      render: (text) => (
        <div className="whitespace-normal break-words max-w-[200px]">
          {text}
        </div>
      ),
    },
    {
      title: "Hình ảnh",
      dataIndex: "hinhAnh",
      key: "hinhAnh",
      render: (text) => (
        <img
          src={text}
          alt="poster"
          className="w-14 h-20 object-cover rounded-md"
        />
      ),
    },
    {
      title: "Mô tả",
      dataIndex: "moTa",
      key: "moTa",
      ellipsis: true,
      responsive: ["lg"], // ❌ ẩn ở mobile/tablet, chỉ hiện ở laptop
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_, record) => (
        <Space
          direction="vertical"
          size="small"
          className="sm:flex-row sm:space-x-2"
        >
          <Button
            type="primary"
            size="small"
            onClick={() => {
              setEditingMovie(record);
              form.setFieldsValue({
                ...record,
                ngayKhoiChieu: dayjs(record.ngayKhoiChieu),
              });
            }}
          >
            Sửa
          </Button>

          <Button
            type="dashed"
            size="small"
            onClick={() => {
              if (record.sapChieu) {
                message.warning(
                  "Phim này đang ở trạng thái 'Sắp chiếu'. Vui lòng đổi sang 'Đang chiếu' để tạo lịch chiếu!"
                );
                return;
              }
              setShowtimeMovie(record);
            }}
            disabled={record.sapChieu}
          >
            Lịch chiếu
          </Button>

          <Popconfirm
            title="Bạn có chắc muốn xóa phim này?"
            onConfirm={() => handleDelete(record.maPhim)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button danger size="small">
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-2 sm:p-4 lg:p-6">
      <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-4">
        🎬 Danh sách phim
      </h2>

      {/* Table có thể cuộn ngang ở mobile */}
      <div className="overflow-x-auto">
        <Table
          rowKey="maPhim"
          columns={columns}
          dataSource={movies}
          loading={loading}
          pagination={{ pageSize: 10 }}
          scroll={{ x: 600 }} // cho phép scroll ngang ở mobile
        />
      </div>

      {/* Modal Edit */}
      <Modal
        open={!!editingMovie}
        title="Cập nhật phim"
        onCancel={() => setEditingMovie(null)}
        footer={null}
        width="95%"
        className="max-w-2xl"
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleUpdate}>
          <Form.Item name="maPhim" label="Mã phim">
            <Input disabled />
          </Form.Item>
          <Form.Item
            name="tenPhim"
            label="Tên phim"
            rules={[{ required: true, message: "Vui lòng nhập tên phim" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="trailer" label="Trailer">
            <Input />
          </Form.Item>
          <Form.Item name="moTa" label="Mô tả">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="ngayKhoiChieu" label="Ngày khởi chiếu">
            <DatePicker format="DD/MM/YYYY" className="w-full" />
          </Form.Item>
          <Form.Item name="sapChieu" label="Sắp chiếu" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item
            name="dangChieu"
            label="Đang chiếu"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
          <Form.Item name="hot" label="Hot" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item name="danhGia" label="Đánh giá">
            <InputNumber min={1} max={10} className="w-full" />
          </Form.Item>
          <Form.Item label="Hình ảnh">
            <Upload
              beforeUpload={(file) => {
                setFile(file);
                return false;
              }}
              maxCount={1}
              accept="image/*"
            >
              <Button icon={<UploadOutlined />}>Chọn file</Button>
            </Upload>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Lưu thay đổi
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal Tạo lịch chiếu */}
      <ModalFormTaoLichChieu
        open={!!showtimeMovie}
        onClose={() => setShowtimeMovie(null)}
        movie={showtimeMovie}
      />
    </div>
  );
}
