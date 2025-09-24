// import { Spin, Alert, Typography } from "antd";
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
  const [error, setError] = useState(null);

  const handleBooking = async () => {
    setError("");
    const user = localStorage.getItem("user");
    if (!user) {
      setError("Vui lòng đăng nhập để tiếp tục đặt vé!");
      return;
    }
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
      await bookingApi.bookTicket({ maLichChieu, danhSachVe });
      message.success("Đặt vé thành công!");
      setSelected([]);
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

  // Lưới 10x16
  const ROWS = 10;
  const COLS = 16;

  // Kích thước ghế & nhãn responsive (đồng bộ)
  const seatBox = "w-7 h-7 text-[10px] sm:w-8 sm:h-8 sm:text-[11px] md:w-8 md:h-8 md:text-xs lg:w-9 lg:h-9";
  const labelBox = "w-7 sm:w-8 md:w-8 lg:w-9"; // dùng cho nhãn hàng & ô trống đầu dòng
  const gapX = "mx-0.5"; // khoảng cách ngang giữa ghế

  // Chuẩn hoá seats thành ma trận
  const seatGrid = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
  seats.forEach((seat, index) => {
    const r = Math.floor(index / COLS);
    const c = index % COLS;
    if (r >= 0 && r < ROWS && c >= 0 && c < COLS) seatGrid[r][c] = seat;
  });

  const getSeatColor = (seat, isSelected) => {
    if (!seat) return "bg-transparent border-transparent cursor-default";
    if (isSelected) return "bg-[#ffa940] border-[#ffa940] text-white";
    if (seat.daDat) return "bg-gray-400 border-gray-500 cursor-not-allowed text-white";
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

      {/* Sơ đồ ghế: cho phép cuộn ngang trên mobile */}
      <div className="w-full overflow-x-auto">
        {/* Bên trong dùng w-max để chiều rộng bám theo nội dung; 
            md:items-center để căn giữa trên màn lớn */}
        <div className="flex flex-col items-start md:items-center w-max mx-auto">
          {/* Dòng số cột */}
          <div className="flex mb-1 sm:mb-2">
            <div className={`${labelBox} mr-2`} />
            {Array.from({ length: COLS }, (_, i) => (
              <div
                key={`col-${i}`}
                className={`${labelBox} text-center font-bold text-[10px] sm:text-xs`}
              >
                {/* Phân cột ngang bằng cách i +1, tuy nhiên không sử dụng, và hiển thị nữa */}
                {/* {i + 1} */}
              </div>
            ))}
          </div>

          {/* Các hàng ghế */}
          {seatGrid.map((row, rowIndex) => {
            const rowName = String.fromCharCode(65 + rowIndex);
            return (
              <div key={`row-${rowIndex}`} className="flex items-center mb-1.5 sm:mb-2">
                {/* Nhãn hàng */}
                <div className={`${labelBox} mr-2 font-bold text-center text-xs sm:text-sm`}>
                  {rowName}
                </div>

                {/* Ghế trong hàng */}
                {row.map((seat, colIndex) => {
                  const isSelected = seat && selected.includes(seat.maGhe);
                  const isBooked = seat && seat.daDat;
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
                              isBooked ? " (Đã đặt)" : ""
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
          <h3 className="font-semibold mb-4 text-base sm:text-lg">Thông tin ghế đã chọn:</h3>
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
                <div key={seatId} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="font-semibold text-blue-800">Ghế: {seat.tenGhe}</div>
                  <div className="text-sm mt-1">
                    <div>• Vị trí: {seatPosition} (Hàng {rowName}, Cột {colIndex + 1})</div>
                    <div>• Loại ghế: {seat.loaiGhe}</div>
                    <div>• Mã ghế (API): {seat.maGhe}</div>
                    <div>• Giá: {new Intl.NumberFormat("vi-VN").format(seat.giaVe)} VNĐ</div>
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

      {/* Debug + nút đặt vé */}
      <div className="mt-4 p-3 bg-gray-200 rounded text-xs">
        <div className="font-semibold mb-2">Thông tin dữ liệu từ API:</div>
        <div>• Tổng số ghế từ API: {seats.length}</div>
        <div>• Bố cục hiển thị: {ROWS} hàng x {COLS} cột = {ROWS * COLS} vị trí</div>
        <div>• 5 ghế đầu tiên: {seats.slice(0, 5).map((s) => s.tenGhe).join(", ")}</div>
        <div>• Các hàng hiển thị: A đến {String.fromCharCode(65 + ROWS - 1)}</div>
      </div>

      {selected.length > 0 && (
        <div className="mt-6 flex justify-center items-center gap-4">
          <Button type="primary" size="large" loading={booking} onClick={handleBooking}>
            Xác nhận đặt vé
          </Button>
          {error && <Alert message={error} type="error" showIcon className="w-fit" />}
        </div>
      )}
    </div>
  );
}
