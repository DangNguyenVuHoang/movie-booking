// src/components/SeatMap.jsx
import { Spin, Alert, Typography, Button, message } from "antd";
import { useState } from "react";
import bookingApi from "../api/bookingApi";

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

  const handleBooking = async () => {
    const user = localStorage.getItem("user");

    if (!user) {
      message.error({
        content: "Vui lòng đăng nhập để tiếp tục đặt vé!",
        duration: 5,
      });
      return;
    }

    if (!maLichChieu || selected.length === 0) {
      message.warning({
        content: "Vui lòng chọn lịch chiếu và ghế trước khi đặt vé!",
        duration: 5,
      });
      return;
    }

    const danhSachVe = selected.map((seatId) => {
      const seat = seats.find((s) => s.maGhe === seatId);
      return { maGhe: seat.maGhe, giaVe: seat.giaVe };
    });

    try {
      setBooking(true);
      await bookingApi.bookTicket({ maLichChieu, danhSachVe });
      message.success({
        content: "Đặt vé thành công!",
        duration: 5,
      });
      setSelected([]);
    } catch (err) {
      console.error(err);
      message.error({
        content: "Đặt vé thất bại!",
        duration: 5,
      });
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

  // --- Lưới ghế ---
  const ROWS = 10;
  const COLS = 16;

  // Responsive box size
  const seatBox =
    "w-7 h-7 text-[10px] sm:w-8 sm:h-8 sm:text-[11px] md:w-8 md:h-8 md:text-xs lg:w-9 lg:h-9";
  const labelBox = "w-7 sm:w-8 md:w-8 lg:w-9";
  const gapX = "mx-0.5";

  // Tạo ma trận ghế
  const seatGrid = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
  seats.forEach((seat, index) => {
    const r = Math.floor(index / COLS);
    const c = index % COLS;
    if (r >= 0 && r < ROWS && c >= 0 && c < COLS) seatGrid[r][c] = seat;
  });

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

  const handleSeatClick = (seat) => {
    if (seat && !seat.daDat) onSelect(seat);
  };

  return (
    <div>
      {/* Màn hình */}
      <div className="text-center mb-6 sm:mb-8">
        <div className="inline-block px-10 sm:px-16 md:px-24 py-3 sm:py-4 bg-gradient-to-t from-gray-400 to-gray-200 text-gray-800 font-bold rounded-md shadow text-sm sm:text-base">
          MÀN HÌNH
        </div>
      </div>

      {/* Chú thích */}
      <div className="flex justify-center gap-4 sm:gap-6 mb-6 sm:mb-8 flex-wrap text-xs sm:text-sm">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-[#1890ff] rounded-sm" />
          <Text>Ghế thường</Text>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-[#ff4d4f] rounded-sm" />
          <Text>Ghế VIP</Text>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-[#ffa940] rounded-sm" />
          <Text>Đang chọn</Text>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-gray-400 rounded-sm" />
          <Text>Đã đặt</Text>
        </div>
      </div>

      {/* Sơ đồ ghế */}
      <div className="w-full overflow-x-auto">
        <div className="flex flex-col items-start md:items-center w-max mx-auto">
          {/* Hàng số cột */}
          <div className="flex mb-1 sm:mb-2">
            <div className={`${labelBox} mr-2`} />
            {Array.from({ length: COLS }, (_, i) => (
              <div
                key={`col-${i}`}
                className={`${labelBox} text-center font-bold text-[10px] sm:text-xs`}
              />
            ))}
          </div>

          {/* Các hàng ghế */}
          {seatGrid.map((row, rowIndex) => {
            const rowName = String.fromCharCode(65 + rowIndex);
            return (
              <div
                key={`row-${rowIndex}`}
                className="flex items-center mb-1.5 sm:mb-2"
              >
                {/* Nhãn hàng */}
                <div
                  className={`${labelBox} mr-2 font-bold text-center text-xs sm:text-sm`}
                >
                  {rowName}
                </div>

                {/* Ghế */}
                {row.map((seat, colIndex) => {
                  const isSelected = seat && selected.includes(seat.maGhe);
                  const displayNumber = colIndex + 1;
                  const seatPosition = `${rowName}${displayNumber}`;
                  return (
                    <div
                      key={seat ? seat.maGhe : `empty-${rowIndex}-${colIndex}`}
                      className={`${seatBox} ${gapX} shrink-0 flex items-center justify-center rounded-md border-2 font-bold ${getSeatColor(
                        seat,
                        isSelected
                      )}`}
                      onClick={() => handleSeatClick(seat)}
                      title={
                        seat
                          ? `Ghế ${seat.tenGhe} (${seatPosition}) - ${seat.loaiGhe}${
                              seat.daDat ? " (Đã đặt)" : ""
                            }`
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
      </div>

      {/* Thông tin ghế đã chọn */}
      {selected.length > 0 && (
        <div className="mt-6 p-4 bg-white rounded-lg shadow">
          <h3 className="font-semibold mb-4 text-base sm:text-lg">
            Thông tin ghế đã chọn:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selected.map((seatId) => {
              const seat = seats.find((s) => s.maGhe === seatId);
              if (!seat) return null;
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
                      • Giá:{" "}
                      {new Intl.NumberFormat("vi-VN").format(seat.giaVe)} VNĐ
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

      {/* Tóm tắt */}
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

      {/* Nút đặt vé */}
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
        </div>
      )}
    </div>
  );
}
