import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchRoom } from "../redux/bookingSlice";
import SeatMap from "../components/SeatMap";
import { Button, Spin, Card, Tag, Modal, Divider } from "antd";
import movieApi from "../api/movieApi";
import dayjs from "dayjs";

export default function ListMovieDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { room } = useSelector((state) => state.booking);
  const [selected, setSelected] = useState([]);
  const [movieDetail, setMovieDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);

  // Fetch room info
  useEffect(() => {
    dispatch(fetchRoom(id));
  }, [dispatch, id]);

  // Fetch movie detail
  useEffect(() => {
    setLoading(true);
    movieApi
      .getMovieDetail(id)
      .then((res) => {
        setMovieDetail(res.content);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleSelect = (seat) => {
    if (selected.includes(seat.maGhe)) {
      setSelected(selected.filter((s) => s !== seat.maGhe));
    } else {
      setSelected([...selected, seat.maGhe]);
    }
  };

  if (loading) return <Spin className="mt-10" tip="Đang tải chi tiết phim..." />;

  return (
    <div className="container py-10">
      {movieDetail && (
        <>
          {/* Phần thông tin phim */}
          <div className="row mb-8">
            {/* Poster */}
            <div className="col-md-4">
              <Card
                cover={
                  <img
                    alt={movieDetail.tenPhim}
                    src={movieDetail.hinhAnh}
                    style={{
                      height: "550px",
                      objectFit: "cover",
                      borderRadius: "10px",
                    }}
                  />
                }
              >
                <Button
                  type="primary"
                  block
                  size="large"
                  onClick={() => setShowTrailer(true)}
                >
                  🎬 Xem Trailer
                </Button>
              </Card>
            </div>

            {/* Thông tin chi tiết */}
            <div className="col-md-8 d-flex flex-column justify-content-center">
              <h2 className="text-4xl font-bold mb-4">{movieDetail.tenPhim}</h2>
              <p className="text-muted mb-3">Bí danh: {movieDetail.biDanh}</p>
              <p className="mb-3">
                <strong>Ngày khởi chiếu: </strong>
                {dayjs(movieDetail.ngayKhoiChieu).format("DD/MM/YYYY")}
              </p>

              {/* Trạng thái */}
              <div className="mb-4">
                {movieDetail.dangChieu && <Tag color="green">Đang chiếu</Tag>}
                {movieDetail.sapChieu && <Tag color="blue">Sắp chiếu</Tag>}
                {!movieDetail.dangChieu && !movieDetail.sapChieu && (
                  <Tag color="red">Ngừng chiếu</Tag>
                )}
              </div>
            </div>
          </div>

          {/* Mô tả phim */}
          <Divider orientation="left">
            <h3 className="text-2xl font-semibold">📖 Nội dung phim</h3>
          </Divider>
          <p className="text-justify mb-10" style={{ lineHeight: "1.8" }}>
            {movieDetail.moTa}
          </p>

          {/* Chọn ghế */}
          <Divider orientation="left">
            <h3 className="text-2xl font-semibold">🎟️ Chọn ghế</h3>
          </Divider>
          {room && (
            <>
              <SeatMap
                seats={room.danhSachGhe}
                onSelect={handleSelect}
                selected={selected}
              />
              <div className="text-center">
                <Button
                  type="primary"
                  size="large"
                  className="mt-6 px-10"
                  disabled={selected.length === 0}
                >
                  Đặt vé ({selected.length})
                </Button>
              </div>
            </>
          )}
        </>
      )}

      {/* Modal Trailer */}
      <Modal
        open={showTrailer}
        footer={null}
        width={800}
        onCancel={() => setShowTrailer(false)}
      >
        <iframe
          width="100%"
          height="450"
          src={movieDetail?.trailer.replace("watch?v=", "embed/")}
          title="Trailer"
          frameBorder="0"
          allowFullScreen
        ></iframe>
      </Modal>
    </div>
  );
}
