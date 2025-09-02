import Banner from "../components/Banner";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMoviesPaging } from "../redux/movieSlice";
import { Row, Col, Typography, Pagination, Spin, Tabs } from "antd";
import MovieCard from "../components/MovieCard";

const { Title } = Typography;

export default function LandingPage() {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.movie || {});

  const [activeKey, setActiveKey] = useState("1");

  // pagination riêng cho từng tab
  const [pageNowShowing, setPageNowShowing] = useState(1);
  const [pageComingSoon, setPageComingSoon] = useState(1);

  const PAGE_SIZE = 8;

  // data cache cho từng tab
  const [nowShowingData, setNowShowingData] = useState({
    movies: [],
    total: 0,
  });
  const [comingSoonData, setComingSoonData] = useState({
    movies: [],
    total: 0,
  });

  // Fetch cho tab Đang chiếu
  useEffect(() => {
    if (activeKey === "1") {
      dispatch(
        fetchMoviesPaging({
          page: pageNowShowing,
          size: PAGE_SIZE,
          dangChieu: true,
        })
      )
        .unwrap()
        .then((res) => {
          setNowShowingData({
            movies: res.items?.filter((m) => m.dangChieu === true) || [],
            total: res.totalCount || 0,
          });
        });
    }
  }, [dispatch, activeKey, pageNowShowing]);

  // Fetch cho tab Sắp chiếu
  useEffect(() => {
    if (activeKey === "2") {
      dispatch(
        fetchMoviesPaging({
          page: pageComingSoon,
          size: PAGE_SIZE,
          sapChieu: true,
        })
      )
        .unwrap()
        .then((res) => {
          setComingSoonData({
            movies: res.items?.filter((m) => m.sapChieu === true) || [],
            total: res.totalCount || 0,
          });
        });
    }
  }, [dispatch, activeKey, pageComingSoon]);

  const renderMovies = (list) => (
    <Row gutter={[32, 32]} justify="center">
      {list.map((movie) => (
        <Col
          key={movie.maPhim}
          xs={24}
          sm={12}
          md={8}
          lg={6}
          xl={6}
          className="flex justify-center"
        >
          <MovieCard movie={movie} large />
        </Col>
      ))}
    </Row>
  );

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Banner */}
      <div className="w-full h-[180px] sm:h-[250px] md:h-[350px] lg:h-[400px] overflow-hidden mb-6">
        <Banner />
      </div>

      {/* Section Phim */}
      <section className="max-w-7xl mx-auto px-6 sm:px-10 py-12 bg-white shadow-lg rounded-lg">
        <div className="text-center mb-10">
          <Title level={2} className="uppercase tracking-wide text-red-600">
            Đặt Vé Xem Phim
          </Title>
          <p className="text-gray-600">Chọn phim yêu thích và đặt vé ngay</p>
        </div>

        <Tabs
          activeKey={activeKey}
          onChange={setActiveKey}
          centered
          destroyOnHidden
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
                    {renderMovies(nowShowingData.movies)}
                    <div className="flex justify-center mt-10 w-full">
                      <Pagination
                        current={pageNowShowing}
                        pageSize={PAGE_SIZE}
                        total={nowShowingData.total}
                        onChange={setPageNowShowing}
                        showSizeChanger={false}
                        style={{ display: "flex", justifyContent: "center" }}
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
                    {renderMovies(comingSoonData.movies)}
                    <div className="flex justify-center mt-10 w-full">
                      <Pagination
                        current={pageComingSoon}
                        pageSize={PAGE_SIZE}
                        total={comingSoonData.total}
                        onChange={setPageComingSoon}
                        showSizeChanger={false}
                        style={{ display: "flex", justifyContent: "center" }}
                      />
                    </div>
                  </>
                ),
            },
          ]}
        />
      </section>
    </div>
  );
}
