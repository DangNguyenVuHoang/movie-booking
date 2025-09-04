// import { Spin, Alert, Typography } from "antd";
import { Spin, Alert, Typography, Button, message, notification } from "antd";

import { useState } from "react";
import bookingApi from "../api/bookingApi"; // đường dẫn import tuỳ project
const { Text } = Typography;

export default function SeatMap({
  seats,
  selected,
  onSelect,
  loading,
  maLichChieu,
  setSelected,
}) {
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState(null);
//   const isLoggedIn = Boolean(localStorage.getItem("user"));
  const handleBooking = async () => {
    setError(""); // reset lỗi trước khi xử lý
    console.error(
      "Booking with maLichChieu:",
      maLichChieu,
      "and seats:",
      selected
    );
    // ✅ Kiểm tra đăng nhập
    const user = localStorage.getItem("user");
    if (!user) {
      setError("Vui lòng đăng nhập để tiếp tục đặt vé!");
      return;
    }
    // // ✅ Kiểm tra đăng nhập trước
    // const user = localStorage.getItem("user");
    // if (!user) {
    //   notification.error({
    //     message: "Yêu cầu đăng nhập",
    //     description: "Vui lòng đăng nhập để tiếp tục đặt vé!",
    //     placement: "top", // thông báo nổi phía trên
    //   });
    //   return;
    // }

    if (!maLichChieu || selected.length === 0) {
      message.warning("Vui lòng chọn lịch chiếu và ghế trước khi đặt vé!");
      return;
    }

    const danhSachVe = selected.map((seatId) => {
      const seat = seats.find((s) => s.maGhe === seatId);
      return { maGhe: seat.maGhe, giaVe: seat.giaVe };
    });

    try {
      setBooking(true);
      await bookingApi.bookTicket({ maLichChieu, danhSachVe }); // ✅ gọi API
      message.success("Đặt vé thành công!");
      setSelected([]); // reset ghế đã chọn
    } catch (err) {
      console.error(err);
      message.error("Đặt vé thất bại!");
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6 bg-gray-100 rounded-lg shadow-md flex justify-center items-center h-96">
        <Spin tip="Đang tải sơ đồ ghế..." size="large" />
      </div>
    );
  }

  if (!seats || seats.length === 0) {
    return (
      <div className="max-w-6xl mx-auto p-6 bg-gray-100 rounded-lg shadow-md flex justify-center items-center h-96">
        <Alert
          message="Không có dữ liệu ghế"
          description="Vui lòng chọn lịch chiếu khác hoặc thử lại sau."
          type="warning"
        />
      </div>
    );
  }
  // Bố cục 10x16 (10 hàng x 16 cột)
  const ROWS = 10;
  const COLS = 16;

  // Tạo mảng 2D cho ghế
  const seatGrid = Array(ROWS)
    .fill()
    .map(() => Array(COLS).fill(null));

  // Điền ghế vào lưới dựa trên thứ tự
  seats.forEach((seat, index) => {
    // Tính toán vị trí dựa trên index
    const rowIndex = Math.floor(index / COLS);
    const colIndex = index % COLS;

    // Đặt ghế vào lưới nếu nằm trong phạm vi
    if (rowIndex >= 0 && rowIndex < ROWS && colIndex >= 0 && colIndex < COLS) {
      seatGrid[rowIndex][colIndex] = seat;
    }
  });

  // Xác định loại ghế và màu sắc tương ứng
  const getSeatColor = (seat, isSelected) => {
    if (!seat) return "bg-transparent border-transparent cursor-default";
    if (isSelected) return "bg-[#ffa940] border-[#ffa940] text-white";
    if (seat.daDat)
      return "bg-gray-400 border-gray-500 cursor-not-allowed text-white";

    switch (seat.loaiGhe) {
      case "Vip":
        return "bg-[#ff4d4f] border-[#ff4d4f] hover:bg-[#ff7875] text-white";
      case "Thuong":
      default:
        return "bg-[#1890ff] border-[#1890ff] hover:bg-[#40a9ff] text-white";
    }
  };

  // Hàm xử lý khi click vào ghế
  const handleSeatClick = (seat) => {
    if (seat && !seat.daDat) {
      onSelect(seat);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
      {/* Màn hình */}
      <div className="text-center mb-8">
        <div className="inline-block px-24 py-4 bg-gradient-to-t from-gray-400 to-gray-200 text-gray-800 font-bold rounded-md shadow-lg text-lg">
          MÀN HÌNH
        </div>
      </div>

      {/* Chú thích */}
      <div className="flex justify-center gap-6 mb-8 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-[#1890ff] rounded-sm"></div>
          <Text>Ghế thường</Text>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-[#ff4d4f] rounded-sm"></div>
          <Text>Ghế VIP</Text>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-[#ffa940] rounded-sm"></div>
          <Text>Đang chọn</Text>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-gray-400 rounded-sm"></div>
          <Text>Đã đặt</Text>
        </div>
      </div>

      {/* Sơ đồ ghế - Lưới 10x16 */}
      <div className="flex flex-col items-center">
        {/* Hiển thị số cột phía trên */}
        <div className="flex mb-2">
          <div className="w-8 mr-2"></div> {/* Ô trống cho góc */}
          {Array.from({ length: COLS }, (_, i) => (
            <div key={`col-${i}`} className="w-8 text-center font-bold text-sm">
              {i + 1}
            </div>
          ))}
        </div>

        {/* Hiển thị các hàng ghế */}
        {seatGrid.map((row, rowIndex) => {
          const rowName = String.fromCharCode(65 + rowIndex); // A, B, C, ...

          return (
            <div key={`row-${rowIndex}`} className="flex items-center mb-2">
              {/* Hiển thị tên hàng */}
              <div className="w-8 mr-2 font-bold text-center">{rowName}</div>

              {/* Hiển thị ghế trong hàng */}
              {row.map((seat, colIndex) => {
                const isSelected = seat && selected.includes(seat.maGhe);
                const isBooked = seat && seat.daDat;
                const displayNumber = colIndex + 1;
                const seatPosition = `${rowName}${displayNumber}`;

                return (
                  <div
                    key={seat ? seat.maGhe : `empty-${rowIndex}-${colIndex}`}
                    className={`w-8 h-8 flex items-center justify-center rounded-md border-2 font-bold text-xs mx-0.5 ${getSeatColor(
                      seat,
                      isSelected
                    )}`}
                    onClick={() => handleSeatClick(seat)}
                    title={
                      seat
                        ? `Ghế ${seat.tenGhe} (${seatPosition}) - ${
                            seat.loaiGhe
                          }${isBooked ? " (Đã đặt)" : ""}`
                        : `Vị trí ${seatPosition}`
                    }
                  >
                    {displayNumber}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Thông tin ghế đã chọn - HIỂN THỊ CHI TIẾT */}
      {selected.length > 0 && (
        <div className="mt-6 p-4 bg-white rounded-lg shadow">
          <h3 className="font-semibold mb-4 text-lg">Thông tin ghế đã chọn:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selected.map((seatId) => {
              const seat = seats.find((s) => s.maGhe === seatId);
              if (!seat) return null;

              // Tìm vị trí của ghế trong mảng seats
              const seatIndex = seats.findIndex((s) => s.maGhe === seatId);
              const rowIndex = Math.floor(seatIndex / COLS);
              const colIndex = seatIndex % COLS;
              const rowName = String.fromCharCode(65 + rowIndex);
              const seatPosition = `${rowName}${colIndex + 1}`;

              return (
                <div
                  key={seatId}
                  className="p-3 bg-blue-50 rounded-lg border border-blue-200"
                >
                  <div className="font-semibold text-blue-800">
                    Ghế: {seat.tenGhe}
                  </div>
                  <div className="text-sm mt-1">
                    <div>
                      • Vị trí: {seatPosition} (Hàng {rowName}, Cột{" "}
                      {colIndex + 1})
                    </div>
                    <div>• Loại ghế: {seat.loaiGhe}</div>
                    <div>• Mã ghế (API): {seat.maGhe}</div>
                    <div>
                      • Giá: {new Intl.NumberFormat("vi-VN").format(seat.giaVe)}{" "}
                      VNĐ
                    </div>
                    <div>
                      • Trạng thái:{" "}
                      {seat.daDat ? (
                        <span className="text-red-600">Đã đặt</span>
                      ) : (
                        <span className="text-green-600">Còn trống</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tóm tắt lựa chọn */}
      {selected.length > 0 && (
        <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
          <h4 className="font-semibold text-amber-800 mb-2">Tóm tắt:</h4>
          <div className="flex flex-wrap gap-2">
            {selected.map((seatId) => {
              const seat = seats.find((s) => s.maGhe === seatId);
              const seatIndex = seats.findIndex((s) => s.maGhe === seatId);
              const rowIndex = Math.floor(seatIndex / COLS);
              const colIndex = seatIndex % COLS;
              const rowName = String.fromCharCode(65 + rowIndex);
              const seatPosition = `${rowName}${colIndex + 1}`;

              return seat ? (
                <span
                  key={seatId}
                  className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium"
                >
                  {seat.tenGhe} ({seatPosition}) - {seat.loaiGhe}
                </span>
              ) : null;
            })}
          </div>
          <div className="mt-2 font-semibold">
            Tổng tiền:{" "}
            {new Intl.NumberFormat("vi-VN").format(
              selected.reduce((total, seatId) => {
                const seat = seats.find((s) => s.maGhe === seatId);
                return total + (seat ? seat.giaVe : 0);
              }, 0)
            )}{" "}
            VNĐ
          </div>
        </div>
      )}

      {/* Debug info - hiển thị thông tin API */}
      <div className="mt-4 p-3 bg-gray-200 rounded text-xs">
        <div className="font-semibold mb-2">Thông tin dữ liệu từ API:</div>
        <div>• Tổng số ghế từ API: {seats.length}</div>
        <div>
          • Bố cục hiển thị: {ROWS} hàng x {COLS} cột = {ROWS * COLS} vị trí
        </div>
        <div>
          • 5 ghế đầu tiên:{" "}
          {seats
            .slice(0, 5)
            .map((s) => s.tenGhe)
            .join(", ")}
        </div>
        <div>
          • Các hàng hiển thị: A đến {String.fromCharCode(65 + ROWS - 1)}
        </div>
      </div>
      {/* Nút đặt vé */}
      {/* Nút đặt vé + Thông báo lỗi */}
      {selected.length > 0 && (
        <div className="mt-6 flex justify-center items-center gap-4">
          <Button
            type="primary"
            size="large"
            loading={booking}
            onClick={handleBooking}
          >
            Xác nhận đặt vé
          </Button>

          {/* ✅ Thông báo lỗi kế bên nút */}
          {error && (
            <Alert message={error} type="error" showIcon className="w-fit" />
          )}
        </div>
      )}
    </div>
  );
}
