import { useEffect, useState } from "react";
import movieApi from "../api/movieApi";
import MovieCard from "../components/MovieCard";
import { Pagination, Spin, Typography } from "antd";

const { Title } = Typography;

export default function ListMoviePage() {
  const [movies, setMovies] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const pageSize = 12; // 4x3 trên laptop

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const res = await movieApi.getMoviesPaging(page, pageSize);
        setMovies(res.content.items || []);
        setTotal(res.content.totalCount || 0);
      } catch (err) {
        console.error("Lỗi load phim:", err);
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [page]);

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Hero Section - nhỏ gọn */}
      <div className="mt-3 sm:mt-8 md:mt-10 px-4">
        <div className="max-w-5xl mx-auto bg-gradient-to-r from-red-600 to-orange-500 py-10 sm:py-14 text-center text-white shadow-md rounded-xl">
          <Title
            level={2}
            className="!text-white uppercase tracking-wide drop-shadow-md !text-xl sm:!text-2xl md:!text-3xl"
          >
            🎬 Danh Sách Phim
          </Title>
          <p className="mt-2 text-sm sm:text-base md:text-lg opacity-90">
            Chọn phim yêu thích và đặt vé ngay hôm nay
          </p>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 w-full py-8 sm:py-12">
        {loading ? (
          <div className="flex justify-center items-center h-[300px] sm:h-[400px]">
            <Spin size="large" />
          </div>
        ) : movies.length === 0 ? (
          <div className="flex justify-center items-center h-[250px] sm:h-[300px]">
            <p className="text-gray-600 text-base sm:text-lg">
              Hiện chưa có phim nào để hiển thị 🎬
            </p>
          </div>
        ) : (
          <>
            {/* ✅ Grid phim full width */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 md:gap-8 w-full">
              {movies.map((movie) => (
                <div key={movie.maPhim} className="flex justify-center">
                  <MovieCard movie={movie} />
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-10 sm:mt-12">
              <Pagination
                current={page}
                total={total}
                pageSize={pageSize}
                onChange={(p) => setPage(p)}
                showSizeChanger={false}
              />
            </div>
          </>
        )}
      </main>
    </div>
  );
}
