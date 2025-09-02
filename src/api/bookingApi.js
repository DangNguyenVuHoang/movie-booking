import axiosClient from "./axiosClient";

const bookingApi = {
  getRoom: (maLichChieu) =>
    axiosClient.get(`/QuanLyDatVe/LayDanhSachPhongVe?MaLichChieu=${maLichChieu}`),
};

export default bookingApi;
