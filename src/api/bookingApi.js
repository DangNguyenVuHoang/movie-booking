import axiosClient from "./axiosClient";

const bookingApi = {
  // Lấy danh sách ghế của 1 lịch chiếu
  getRoom: (maLichChieu) =>
    axiosClient.get(
      `/QuanLyDatVe/LayDanhSachPhongVe?MaLichChieu=${maLichChieu}`
    ),

  // Lấy thông tin lịch chiếu theo MaPhim
  getShowtimes: (maPhim) =>
    axiosClient.get(
      `/QuanLyRap/LayThongTinLichChieuPhim?MaPhim=${maPhim}`
    ),

  // Đặt vé (yêu cầu Bearer token)
  bookTicket: (data) => {
    const user = JSON.parse(localStorage.getItem("user")) || {};
    return axiosClient.post("/QuanLyDatVe/DatVe", data, {
      headers: {
        Authorization: `Bearer ${user.accessToken || ""}`,
      },
    });
  },
};

export default bookingApi;
