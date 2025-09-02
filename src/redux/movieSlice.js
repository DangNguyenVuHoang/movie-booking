// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import movieApi from "../api/movieApi";

// export const fetchMovies = createAsyncThunk("movie/fetchMovies", async () => {
//   const res = await movieApi.getMovies();
//   return res.content;
// });

// export const fetchBanner = createAsyncThunk("movie/fetchBanner", async () => {
//   const res = await movieApi.getBanner();
//   return res.content;
// });

// const movieSlice = createSlice({
//   name: "movie",
//   initialState: {
//     movies: [],
//     banners: [],
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder.addCase(fetchMovies.fulfilled, (state, action) => {
//       state.movies = action.payload;
//     });
//     builder.addCase(fetchBanner.fulfilled, (state, action) => {
//       state.banners = action.payload;
//     });
//   },
// });

// export default movieSlice.reducer;
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import movieApi from "../api/movieApi";

// ✅ Lấy danh sách banner
export const fetchBanner = createAsyncThunk(
  "movie/fetchBanner",
  async (_, { rejectWithValue }) => {
    try {
      const res = await movieApi.getBanner();
      return res.content;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ✅ Lấy danh sách phim phân trang
export const fetchMoviesPaging = createAsyncThunk(
  "movie/fetchMoviesPaging",
  async ({ page = 1, size = 12 }, { rejectWithValue }) => {
    try {
      const res = await movieApi.getMoviesPaging(page, size);
      return res.content;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const movieSlice = createSlice({
  name: "movie",
  initialState: {
    banners: [],
    movies: [],
    totalCount: 0,
    loading: false,
    error: null,
    currentPage: 1,
    pageSize: 12,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Banner
      .addCase(fetchBanner.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBanner.fulfilled, (state, action) => {
        state.loading = false;
        state.banners = action.payload || [];
      })
      .addCase(fetchBanner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Movies
      .addCase(fetchMoviesPaging.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMoviesPaging.fulfilled, (state, action) => {
        state.loading = false;
        state.movies = action.payload.items || [];
        state.totalCount = action.payload.totalCount || 0;
      })
      .addCase(fetchMoviesPaging.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default movieSlice.reducer;
