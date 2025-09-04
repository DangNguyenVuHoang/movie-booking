// src/api/userApi.js
import axiosClient from "./axiosClient";

const userApi = {
  // 📌 Lấy danh sách người dùng theo nhóm
  getUsers: (maNhom = "GP05") => {
    const user = JSON.parse(localStorage.getItem("user")) || {};
    return axiosClient.get(
      `/QuanLyNguoiDung/LayDanhSachNguoiDung?MaNhom=${maNhom}`,
      {
        headers: {
          Authorization: `Bearer ${user.accessToken || ""}`,
        },
      }
    );
  },

  // 📌 Thêm người dùng
  addUser: (data) => {
    const user = JSON.parse(localStorage.getItem("user")) || {};
    return axiosClient.post("/QuanLyNguoiDung/ThemNguoiDung", data, {
      headers: {
        Authorization: `Bearer ${user.accessToken || ""}`,
        "Content-Type": "application/json",
      },
    });
  },

  // 📌 Cập nhật người dùng
  updateUser: (data) => {
    const user = JSON.parse(localStorage.getItem("user")) || {};
    return axiosClient.post(
      "/QuanLyNguoiDung/CapNhatThongTinNguoiDung",
      data,
      {
        headers: {
          Authorization: `Bearer ${user.accessToken || ""}`,
          "Content-Type": "application/json-patch+json",
        },
      }
    );
  },

  // 📌 Xóa người dùng
  deleteUser: (taiKhoan) => {
    const user = JSON.parse(localStorage.getItem("user")) || {};
    return axiosClient.delete(
      `/QuanLyNguoiDung/XoaNguoiDung?TaiKhoan=${taiKhoan}`,
      {
        headers: {
          Authorization: `Bearer ${user.accessToken || ""}`,
        },
      }
    );
  },
};

export default userApi;
