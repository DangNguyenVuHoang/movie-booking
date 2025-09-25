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
import ModalFormTaoLichChieu from "../../pages/admin/ModalFormTaoLichChieu";
import { NavLink } from "react-router-dom";

export default function Films() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [form] = Form.useForm();
  const [file, setFile] = useState(null);
  const [showtimeMovie, setShowtimeMovie] = useState(null);
  const [showtimeForm] = Form.useForm();

  // ✅ Load danh sách phim
  const fetchMovies = async () => {
    try {
      setLoading(true);
      const res = await movieApi.getMovies();
      setMovies(res.content); // API trả về { content: [...] }
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
    {
      title: "Mã phim",
      dataIndex: "maPhim",
      key: "maPhim",
      width: 100,
    },
    {
      title: "Tên phim",
      dataIndex: "tenPhim",
      key: "tenPhim",
    },
    {
      title: "Hình ảnh",
      dataIndex: "hinhAnh",
      key: "hinhAnh",
      render: (text) => (
        <img
          src={text}
          alt="poster"
          style={{ width: 60, height: 90, objectFit: "cover", borderRadius: 6 }}
        />
      ),
    },
    {
      title: "Mô tả",
      dataIndex: "moTa",
      key: "moTa",
      ellipsis: true,
    },
{
  title: "Thao tác",
  key: "actions",
  render: (_, record) => (
    <Space>
      <Button
        type="primary"
        onClick={() => {
          setEditingMovie(record);
          form.setFieldsValue({
            ...record,
            ngayKhoiChieu: dayjs(record.ngayKhoiChieu),
          });
        }}
      >
        Edit
      </Button>

      {/* Tạo lịch chiếu */}
      <Button
        type="dashed"
        onClick={() => {
          if (record.sapChieu) {
            message.warning(
              "Phim này đang ở trạng thái 'Sắp chiếu'. Vui lòng đổi sang 'Đang chiếu' để tạo lịch chiếu!"
            );
            return;
          }
          setShowtimeMovie(record);
        }}
        disabled={record.sapChieu} // disable nút khi sapChieu = true
      >
        Tạo lịch chiếu
      </Button>

      <Popconfirm
        title="Bạn có chắc muốn xóa phim này?"
        onConfirm={() => handleDelete(record.maPhim)}
        okText="Xóa"
        cancelText="Hủy"
      >
        <Button danger>Xóa</Button>
      </Popconfirm>
    </Space>
  ),
}

  ];

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">🎬 Danh sách phim</h2>
      <Table
        rowKey="maPhim"
        columns={columns}
        dataSource={movies}
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      {/* Modal Edit */}
      <Modal
        open={!!editingMovie}
        title="Cập nhật phim"
        onCancel={() => setEditingMovie(null)}
        footer={null}
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
            <DatePicker format="DD/MM/YYYY" />
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
            <InputNumber min={1} max={10} />
          </Form.Item>
          <Form.Item label="Hình ảnh">
            <Upload
              beforeUpload={(file) => {
                setFile(file);
                return false;
              }}
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Chọn file</Button>
            </Upload>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Cập nhật
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      {/* // trong return JSX cuối cùng */}
      <ModalFormTaoLichChieu
        open={!!showtimeMovie}
        onClose={() => setShowtimeMovie(null)}
        movie={showtimeMovie}
      />
    </div>
  );
}
