import { useEffect, useState } from "react";
import movieApi from "../api/movieApi";
import MovieCard from "../components/MovieCard";
import { Pagination, Spin, Row, Col, Typography } from "antd";

const { Title } = Typography;

export default function ListMoviePage() {
  const [movies, setMovies] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const pageSize = 9; // ✅ hiển thị 3x3 = 9 phim mỗi trang

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
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-600 to-orange-500 py-16 text-center text-white shadow-md">
        <Title level={2} className="!text-white uppercase tracking-wide drop-shadow-md">
          🎬 Danh Sách Phim
        </Title>
        <p className="mt-2 text-lg opacity-90">
          Chọn phim yêu thích và đặt vé ngay hôm nay
        </p>
      </div>

      {/* Content */}
      <main className="flex-1 max-w-7xl mx-auto px-6 py-12 w-full">
        {loading ? (
          <div className="flex justify-center items-center h-[400px]">
            <Spin size="large" />
          </div>
        ) : movies.length === 0 ? (
          <div className="flex justify-center items-center h-[300px]">
            <p className="text-gray-600 text-lg">
              Hiện chưa có phim nào để hiển thị 🎬
            </p>
          </div>
        ) : (
          <>
            {/* Movie Grid dùng Row & Col */}
            <Row gutter={[32, 32]} justify="center">
              {movies.map((movie) => (
                <Col
                  key={movie.maPhim}
                  xs={24}   // mobile: 1 phim / hàng
                  sm={12}   // tablet: 2 phim / hàng
                  md={8}    // desktop: 3 phim / hàng
                  lg={8}
                  xl={8}
                  className="flex justify-center"
                >
                  <MovieCard movie={movie} large />
                </Col>
              ))}
            </Row>

            {/* Pagination */}
            <div className="flex justify-center mt-12">
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
