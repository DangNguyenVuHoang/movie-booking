// src/api/userApi.js
import axiosClient from "./axiosClient";

const userApi = {
  // Lấy danh sách người dùng theo nhóm
  getUsers: (maNhom = "GP00") =>
    axiosClient.get(`/QuanLyNguoiDung/LayDanhSachNguoiDung?MaNhom=${maNhom}`),

  // Thêm người dùng
  addUser: (data) =>
    axiosClient.post("/QuanLyNguoiDung/ThemNguoiDung", data),

  // Cập nhật người dùng
  updateUser: (data) =>
    axiosClient.post("/QuanLyNguoiDung/CapNhatThongTinNguoiDung", data),

  // Xóa người dùng
  deleteUser: (taiKhoan) =>
    axiosClient.delete(`/QuanLyNguoiDung/XoaNguoiDung?TaiKhoan=${taiKhoan}`),
};

export default userApi;
