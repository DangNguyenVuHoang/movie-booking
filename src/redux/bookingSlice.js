import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import bookingApi from "../api/bookingApi";

export const fetchRoom = createAsyncThunk("booking/fetchRoom", async (id) => {
  const res = await bookingApi.getRoom(id);
  return res.content;
});

const bookingSlice = createSlice({
  name: "booking",
  initialState: {
    room: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchRoom.fulfilled, (state, action) => {
      state.room = action.payload;
    });
  },
});

export default bookingSlice.reducer;
