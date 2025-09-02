import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authApi from "../api/authApi";

// Thunk login
export const login = createAsyncThunk("auth/login", async (payload) => {
  const res = await authApi.login(payload);

  // Lưu user + token vào localStorage
  localStorage.setItem("user", JSON.stringify(res.content));
  localStorage.setItem("token", res.content.accessToken);

  return res.content;
});

// Thunk register
export const register = createAsyncThunk("auth/register", async (payload) => {
  const res = await authApi.register(payload);
  return res.content;
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: JSON.parse(localStorage.getItem("user")) || null,
    token: localStorage.getItem("token") || null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state, action) => {
      state.user = action.payload;
      state.token = action.payload.accessToken;
    });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
