// src/components/ModalFormTaoLichChieu.jsx
import { Modal, Form, Input, DatePicker, InputNumber, Button, message, Select } from "antd";
import { useEffect, useState } from "react";
import movieApi from "../../api/movieApi";

const ModalFormTaoLichChieu = ({ open, onClose, movie }) => {
  const [form] = Form.useForm();
  const [heThongRap, setHeThongRap] = useState([]);
  const [cumRap, setCumRap] = useState([]);

  // ✅ Load hệ thống rạp khi mở modal
  useEffect(() => {
    if (open) {
      (async () => {
        try {
          const res = await movieApi.getHeThongRap();
          setHeThongRap(res.content || []);
        } catch (err) {
          console.error(err);
          message.error("Không tải được hệ thống rạp!");
        }
      })();
    }
  }, [open]);

  // ✅ Khi chọn hệ thống rạp → load cụm rạp
  const handleChangeHeThongRap = async (maHeThongRap) => {
    try {
      const res = await movieApi.getCumRapTheoHeThong(maHeThongRap);
      setCumRap(res.content || []);
      form.setFieldsValue({ maRap: undefined }); // reset cụm rạp
    } catch (err) {
      console.error(err);
      message.error("Không tải được cụm rạp!");
    }
  };

  // ✅ Set mặc định khi mở modal
  useEffect(() => {
    if (movie) {
      form.setFieldsValue({
        maPhim: movie.maPhim,
        giaVe: 75000,
      });
    }
  }, [movie, form]);

  // ✅ Submit form
  const handleFinish = async (values) => {
    try {
      const payload = {
        ...values,
        ngayChieuGioChieu: values.ngayChieuGioChieu.format("DD/MM/YYYY HH:mm:ss"),
      };
      await movieApi.createShowtime(payload);
      message.success("Tạo lịch chiếu thành công!");
      onClose();
    } catch (err) {
      console.error(err);
      message.error("Tạo lịch chiếu thất bại!");
    }
  };

  return (
    <Modal
      open={open}
      title={`Tạo lịch chiếu - ${movie?.tenPhim || ""}`}
      onCancel={onClose}
      footer={null}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item name="maPhim" label="Mã phim">
          <Input disabled />
        </Form.Item>

        <Form.Item
          name="heThongRap"
          label="Hệ thống rạp"
          rules={[{ required: true, message: "Vui lòng chọn hệ thống rạp" }]}
        >
          <Select placeholder="Chọn hệ thống rạp" onChange={handleChangeHeThongRap}>
            {heThongRap.map((rap) => (
              <Select.Option key={rap.maHeThongRap} value={rap.maHeThongRap}>
                {rap.tenHeThongRap}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="maRap"
          label="Cụm rạp"
          rules={[{ required: true, message: "Vui lòng chọn cụm rạp" }]}
        >
          <Select placeholder="Chọn cụm rạp">
            {cumRap.map((rap) => (
              <Select.Option key={rap.maCumRap} value={rap.maCumRap}>
                {rap.tenCumRap}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="ngayChieuGioChieu"
          label="Ngày chiếu giờ chiếu"
          rules={[{ required: true, message: "Vui lòng chọn ngày giờ" }]}
        >
          <DatePicker showTime format="DD/MM/YYYY HH:mm:ss" style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="giaVe"
          label="Giá vé"
          rules={[{ required: true, message: "Vui lòng nhập giá vé" }]}
        >
          <InputNumber min={50000} step={5000} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Tạo lịch chiếu
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalFormTaoLichChieu;
