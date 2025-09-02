import axiosClient from "./axiosClient";

const authApi = {
  login: (data) => axiosClient.post("/QuanLyNguoiDung/DangNhap", data),
  register: (data) => axiosClient.post("/QuanLyNguoiDung/DangKy", data),
  getAccount: () => axiosClient.post("/QuanLyNguoiDung/ThongTinTaiKhoan"),
  updateAccount: (data) =>
  axiosClient.put("/QuanLyNguoiDung/CapNhatThongTinNguoiDung", data),

};

export default authApi;
