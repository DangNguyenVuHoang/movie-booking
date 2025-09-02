import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMoviesPaging } from "../redux/movieSlice";
import { Row, Col, Pagination, Spin, Typography } from "antd";
import MovieCard from "../components/MovieCard";

const { Title } = Typography;

export default function HomePage() {
  const dispatch = useDispatch();
  const { movies, totalCount, loading } = useSelector((state) => state.movie);

  const [page, setPage] = useState(1);
  const pageSize = 12;

  useEffect(() => {
    dispatch(fetchMoviesPaging({ page, size: pageSize }));
  }, [dispatch, page]);

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-600 to-orange-500 py-16 text-center text-white shadow-md">
        <Title level={2} className="!text-white uppercase tracking-wide">
          🎬 Danh Sách Phim
        </Title>
        <p className="mt-2 text-lg opacity-90">
          Chọn phim yêu thích và đặt vé ngay hôm nay
        </p>
      </div>

      {/* Content */}
      <main className="flex-1 max-w-7xl mx-auto px-6 py-12 w-full">
        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <Spin size="large" tip="Đang tải phim..." />
          </div>
        ) : (movies ?? []).length === 0 ? (
          <div className="flex justify-center items-center min-h-[300px]">
            <p className="text-gray-600 text-lg">
              Hiện chưa có phim nào để hiển thị 🎥
            </p>
          </div>
        ) : (
          <>
            {/* Movie Grid */}
            <Row gutter={[24, 32]} justify="center">
              {movies.map((m) => (
                <Col
                  key={m.maPhim}
                  xs={24}
                  sm={12}
                  md={8}
                  lg={6}
                  className="flex justify-center"
                >
                  <MovieCard movie={m} />
                </Col>
              ))}
            </Row>

            {/* Pagination */}
            <div className="w-full flex justify-center mt-12 pb-6">
              <Pagination
                current={page}
                pageSize={pageSize}
                total={totalCount}
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
