import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Form, Select, DatePicker, InputNumber, Button, message, Card } from "antd";
import movieApi from "../../api/movieApi";
import dayjs from "dayjs";

export default function ShowtimeForm() {
  const { idFilm } = useParams();
  const [form] = Form.useForm();
  const [heThongRap, setHeThongRap] = useState([]);
  const [cumRap, setCumRap] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Load hệ thống rạp
  useEffect(() => {
    const fetchRap = async () => {
      try {
        const res = await movieApi.getHeThongRap();
        setHeThongRap(res.content);
      } catch (err) {
        console.error(err);
        message.error("Không tải được hệ thống rạp!");
      }
    };
    fetchRap();
  }, []);

  // ✅ Khi chọn hệ thống rạp thì load cụm rạp
  const handleChangeHeThongRap = async (maHeThongRap) => {
    try {
      const res = await movieApi.getCumRapTheoHeThong(maHeThongRap);
      setCumRap(res.content);
    } catch (err) {
      console.error(err);
      message.error("Không tải được cụm rạp!");
    }
  };

  // ✅ Submit form
  const handleSubmit = async (values) => {
    try {
      const payload = {
        maPhim: +idFilm,
        ngayChieuGioChieu: values.ngayChieuGioChieu.format("DD/MM/YYYY HH:mm:ss"),
        maRap: values.maRap,
        giaVe: values.giaVe,
      };
      await movieApi.taoLichChieu(payload);
      message.success("Tạo lịch chiếu thành công!");
      form.resetFields();
    } catch (err) {
      console.error(err);
      message.error("Tạo lịch chiếu thất bại!");
    }
  };

  return (
    <Card title={`🎬 Tạo lịch chiếu - Mã phim ${idFilm}`} bordered={false}>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item name="heThongRap" label="Hệ thống rạp" rules={[{ required: true }]}>
          <Select placeholder="Chọn hệ thống rạp" onChange={handleChangeHeThongRap}>
            {heThongRap.map((rap) => (
              <Select.Option key={rap.maHeThongRap} value={rap.maHeThongRap}>
                {rap.tenHeThongRap}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="maRap" label="Cụm rạp" rules={[{ required: true }]}>
          <Select placeholder="Chọn cụm rạp">
            {cumRap.map((rap) => (
              <Select.Option key={rap.maCumRap} value={rap.maCumRap}>
                {rap.tenCumRap}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="ngayChieuGioChieu" label="Ngày chiếu giờ chiếu" rules={[{ required: true }]}>
          <DatePicker showTime format="DD/MM/YYYY HH:mm:ss" />
        </Form.Item>

        <Form.Item name="giaVe" label="Giá vé" rules={[{ required: true }]}>
          <InputNumber min={75000} max={200000} step={5000} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Tạo lịch chiếu
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}
