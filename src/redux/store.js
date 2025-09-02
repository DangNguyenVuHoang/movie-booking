import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import movieReducer from "./movieSlice";
import bookingReducer from "./bookingSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    movie: movieReducer,
    booking: bookingReducer,
  },
});

export default store;
