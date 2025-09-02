import axiosClient from "./axiosClient";

const TOKEN_CYBERSOFT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJCb290Y2FtcCA4NSIsIkhldEhhblN0cmluZyI6IjExLzAyLzIwMjYiLCJIZXRIYW5UaW1lIjoiMTc3MDc2ODAwMDAwMCIsIm5iZiI6MTc0MzAxMjAwMCwiZXhwIjoxNzcwOTE5MjAwfQ._5a1o_PuNL8CuHuGdsi1TABKYJwuMsnG5uSKAILfaY8";

const movieApi = {
  // Banner
  getBanner: () =>
    axiosClient.get("/QuanLyPhim/LayDanhSachBanner", {
      headers: {
        TokenCybersoft: TOKEN_CYBERSOFT,
      },
    }),

  // Danh sách phim theo nhóm
  getMovies: (maNhom = "GP01") =>
    axiosClient.get(`/QuanLyPhim/LayDanhSachPhim?maNhom=${maNhom}`, {
      headers: {
        TokenCybersoft: TOKEN_CYBERSOFT,
      },
    }),

  // Phân trang phim
  getMoviesPaging: (page = 1, size = 10, maNhom = "GP01") =>
    axiosClient.get(
      `/QuanLyPhim/LayDanhSachPhimPhanTrang?maNhom=${maNhom}&soTrang=${page}&soPhanTuTrenTrang=${size}`,
      {
        headers: {
          TokenCybersoft: TOKEN_CYBERSOFT,
        },
      }
    ),

  // ✅ Chi tiết phim theo mã
  getMovieDetail: (maPhim) =>
    axiosClient.get(`/QuanLyPhim/LayThongTinPhim?MaPhim=${maPhim}`, {
      headers: {
        TokenCybersoft: TOKEN_CYBERSOFT,
      },
    }),
};

export default movieApi;
