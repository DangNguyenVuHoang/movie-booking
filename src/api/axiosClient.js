import axios from "axios";

const axiosClient = axios.create({
  baseURL: "https://movienew.cybersoft.edu.vn/api",
  headers: {
    TokenCybersoft:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJCb290Y2FtcCA4NSIsIkhldEhhblN0cmluZyI6IjExLzAyLzIwMjYiLCJIZXRIYW5UaW1lIjoiMTc3MDc2ODAwMDAwMCIsIm5iZiI6MTc0MzAxMjAwMCwiZXhwIjoxNzcwOTE5MjAwfQ._5a1o_PuNL8CuHuGdsi1TABKYJwuMsnG5uSKAILfaY8",
  },
});

// ✅ Thêm interceptor để gắn Authorization: Bearer token
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Xử lý response
axiosClient.interceptors.response.use(
  (res) => res.data,
  (err) => {
    // Nếu token hết hạn => logout
    if (err.response?.status === 401) {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      window.location.href = "/login"; // ép login lại
    }
    return Promise.reject(err);
  }
);

export default axiosClient;
