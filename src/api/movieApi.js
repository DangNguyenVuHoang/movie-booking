// src/api/movieApi.js
import axiosClient from "./axiosClient";

const TOKEN_CYBERSOFT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJCb290Y2FtcCA4NSIsIkhldEhhblN0cmluZyI6IjExLzAyLzIwMjYiLCJIZXRIYW5UaW1lIjoiMTc3MDc2ODAwMDAwMCIsIm5iZiI6MTc0MzAxMjAwMCwiZXhwIjoxNzcwOTE5MjAwfQ._5a1o_PuNL8CuHuGdsi1TABKYJwuMsnG5uSKAILfaY8";

// 👉 Hàm tạo headers
const getHeaders = (isMultipart = false) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const headers = {
    TokenCybersoft: TOKEN_CYBERSOFT,
  };

  if (user?.accessToken) {
    headers.Authorization = `Bearer ${user.accessToken}`;
  }

  return headers;
};

const movieApi = {
  getBanner: () =>
    axiosClient.get("/QuanLyPhim/LayDanhSachBanner", {
      headers: getHeaders(),
    }),

  getMovies: (maNhom = "GP05") =>
    axiosClient.get(`/QuanLyPhim/LayDanhSachPhim?maNhom=${maNhom}`, {
      headers: getHeaders(),
    }),

  getMoviesPaging: (page = 1, size = 10, maNhom = "GP05") =>
    axiosClient.get(
      `/QuanLyPhim/LayDanhSachPhimPhanTrang?maNhom=${maNhom}&soTrang=${page}&soPhanTuTrenTrang=${size}`,
      { headers: getHeaders() }
    ),

  getMovieDetail: (maPhim) =>
    axiosClient.get(`/QuanLyPhim/LayThongTinPhim?MaPhim=${maPhim}`, {
      headers: getHeaders(),
    }),

    // ✅ Tạo lịch chiếu
  createShowtime: (data) => axiosClient.post("/QuanLyDatVe/TaoLichChieu", data),

  // ✅ Lấy hệ thống rạp
  getHeThongRap: () => axiosClient.get("/QuanLyRap/LayThongTinHeThongRap"),

  // ✅ Lấy cụm rạp theo hệ thống
  getCumRapTheoHeThong: (maHeThongRap) =>
    axiosClient.get(`/QuanLyRap/LayThongTinCumRapTheoHeThong?maHeThongRap=${maHeThongRap}`),

  // ✅ Thêm phim
  addMovie: (formData) =>
    axiosClient.post("/QuanLyPhim/ThemPhimUploadHinh", formData, {
      headers: getHeaders(true),
    }),

  // ✅ Cập nhật phim
  updateMovie: (formData) =>
    axiosClient.post("/QuanLyPhim/CapNhatPhimUpload", formData, {
      headers: getHeaders(true),
    }),
  // ✅ Tạo lịch chiếu
  createShowtime: (data) =>
    axiosClient.post("/QuanLyDatVe/TaoLichChieu", data, {
      headers: getHeaders(),
    }),
  // ✅ Xóa phim
  deleteMovie: (maPhim) =>
    axiosClient.delete(`/QuanLyPhim/XoaPhim?MaPhim=${maPhim}`, {
      headers: getHeaders(),
    }),
};

export default movieApi;
