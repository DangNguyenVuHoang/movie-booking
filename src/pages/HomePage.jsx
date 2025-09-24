import Banner from "../components/Banner";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMoviesPaging } from "../redux/movieSlice";
import { Typography, Pagination, Spin, Tabs } from "antd";
import MovieCard from "../components/MovieCard";

const { Title } = Typography;

export default function LandingPage() {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.movie || {});
  const [activeKey, setActiveKey] = useState("1");

  // pagination riêng cho từng tab
  const [pageNowShowing, setPageNowShowing] = useState(1);
  const [pageComingSoon, setPageComingSoon] = useState(1);

  const PAGE_SIZE = 8; // 2 hàng * 4 cột

  // data cache cho từng tab
  const [nowShowingData, setNowShowingData] = useState({ movies: [], total: 0 });
  const [comingSoonData, setComingSoonData] = useState({ movies: [], total: 0 });

  // Fetch Đang chiếu
  useEffect(() => {
    if (activeKey === "1") {
      dispatch(fetchMoviesPaging({ page: pageNowShowing, size: PAGE_SIZE, dangChieu: true }))
        .unwrap()
        .then((res) => {
          setNowShowingData({
            movies: res.items?.filter((m) => m.dangChieu) || [],
            total: res.totalCount || 0,
          });
        });
    }
  }, [dispatch, activeKey, pageNowShowing]);

  // Fetch Sắp chiếu
  useEffect(() => {
    if (activeKey === "2") {
      dispatch(fetchMoviesPaging({ page: pageComingSoon, size: PAGE_SIZE, sapChieu: true }))
        .unwrap()
        .then((res) => {
          setComingSoonData({
            movies: res.items?.filter((m) => m.sapChieu) || [],
            total: res.totalCount || 0,
          });
        });
    }
  }, [dispatch, activeKey, pageComingSoon]);

  // Grid phim: full-bleed (không padding 2 bên), mobile 2c, tablet 3c, laptop 4c
  const renderMovies = (list) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {list.map((movie) => (
        <div key={movie.maPhim} className="w-full">
          <MovieCard movie={movie} />
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Banner full width */}
      <div className="w-full h-[180px] sm:h-[240px] md:h-[340px] lg:h-[420px] overflow-hidden mb-6">
        <Banner />
      </div>

      {/* Tiêu đề + Tabs cũng full-bleed: KHÔNG dùng container, KHÔNG padding ngang */}
      <div className="w-full">
        {/* Tiêu đề */}
        <div className="text-center mb-6">
          <Title level={2} className="!text-xl sm:!text-2xl md:!text-3xl font-bold uppercase tracking-wide text-red-600">
            Đặt Vé Xem Phim
          </Title>
          <p className="text-gray-600 text-sm md:text-base">Chọn phim yêu thích và đặt vé ngay hôm nay 🎟️</p>
        </div>

        {/* Tabs + content full width */}
        <Tabs
          activeKey={activeKey}
          onChange={setActiveKey}
          centered
          destroyInactiveTabPane
          className="px-0"
          items={[
            {
              key: "1",
              label: "Phim Đang Chiếu",
              children:
                loading && activeKey === "1" ? (
                  <div className="flex justify-center items-center min-h-[300px]">
                    <Spin size="large" />
                  </div>
                ) : (
                  <>
                    {/* Lưới phim sát hai mép */}
                    <div className="w-full px-0">{renderMovies(nowShowingData.movies)}</div>
                    <div className="flex justify-center mt-8">
                      <Pagination
                        current={pageNowShowing}
                        pageSize={PAGE_SIZE}
                        total={nowShowingData.total}
                        onChange={setPageNowShowing}
                        showSizeChanger={false}
                      />
                    </div>
                  </>
                ),
            },
            {
              key: "2",
              label: "Phim Sắp Chiếu",
              children:
                loading && activeKey === "2" ? (
                  <div className="flex justify-center items-center min-h-[300px]">
                    <Spin size="large" />
                  </div>
                ) : (
                  <>
                    <div className="w-full px-0">{renderMovies(comingSoonData.movies)}</div>
                    <div className="flex justify-center mt-8">
                      <Pagination
                        current={pageComingSoon}
                        pageSize={PAGE_SIZE}
                        total={comingSoonData.total}
                        onChange={setPageComingSoon}
                        showSizeChanger={false}
                      />
                    </div>
                  </>
                ),
            },
          ]}
        />
      </div>
    </div>
  );
}
