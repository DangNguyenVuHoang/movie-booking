import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Spin, Card, Tag, Modal, Divider, message, Alert } from "antd";
import movieApi from "../api/movieApi";
import bookingApi from "../api/bookingApi";
import SeatMap from "./SeatMap";
import dayjs from "dayjs";

export default function ListMovieDetail() {
  const { id } = useParams();
  const [movieDetail, setMovieDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);

  const [showtimes, setShowtimes] = useState([]);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [roomSeats, setRoomSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [seatsLoading, setSeatsLoading] = useState(false);
  const [seatsError, setSeatsError] = useState(null);

  // Fetch movie detail
  useEffect(() => {
    setLoading(true);
    movieApi
      .getMovieDetail(id)
      .then((res) => setMovieDetail(res.content))
      .catch((err) => {
        console.error("Error fetching movie details:", err);
        message.error("Không thể tải thông tin phim");
      })
      .finally(() => setLoading(false));
  }, [id]);

  // Fetch showtimes theo MaPhim
  useEffect(() => {
    if (!id) return;

    const fetchShowtimes = async () => {
      try {
        const res = await bookingApi.getShowtimes(id);
        const cumRap = res.content.heThongRapChieu?.[0]?.cumRapChieu || [];
        setShowtimes(cumRap);

        // Tự động chọn lịch chiếu đầu tiên nếu có
        const firstShowtime = cumRap?.[0]?.lichChieuPhim?.[0];
        if (firstShowtime) setSelectedShowtime(firstShowtime);
      } catch (err) {
        console.error("Error fetching showtimes:", err);
        message.error("Không thể tải lịch chiếu");
      }
    };

    fetchShowtimes();
  }, [id]);

  // Fetch roomSeats khi lịch chiếu thay đổi
  useEffect(() => {
    if (!selectedShowtime) return;

    const fetchSeats = async () => {
      setSeatsLoading(true);
      setSeatsError(null);
      try {
        const res = await bookingApi.getRoom(selectedShowtime.maLichChieu);
        setRoomSeats(res.content.danhSachGhe);
        setSelectedSeats([]);
      } catch (err) {
        console.error("Error fetching seats:", err);
        setSeatsError("Không thể tải thông tin ghế. Vui lòng thử lại.");
        message.error("Không thể tải thông tin ghế");
      } finally {
        setSeatsLoading(false);
      }
    };

    fetchSeats();
  }, [selectedShowtime]);

  const handleSelect = (seat) => {
    setSelectedSeats((prev) =>
      prev.includes(seat.maGhe)
        ? prev.filter((s) => s !== seat.maGhe)
        : [...prev, seat.maGhe]
    );
  };

  const handleBookTickets = () => {
    if (selectedSeats.length === 0) return;
    message.success(`Đã chọn ${selectedSeats.length} ghế!`);
    // Thêm logic đặt vé ở đây
  };

  if (loading) {
    return (
      <div className="py-10 mx-auto px-4 flex justify-center items-center h-64">
        <Spin tip="Đang tải chi tiết phim..." size="large" />
      </div>
    );
  }

  if (!movieDetail) {
    return (
      <div className="py-10 mx-auto px-4">
        <Alert
          message="Không tìm thấy thông tin phim"
          description="Vui lòng thử lại sau hoặc chọn phim khác."
          type="error"
        />
      </div>
    );
  }

  return (
    <div className="py-8 sm:py-10 mx-auto px-4 sm:px-6 md:px-10 max-w-full lg:max-w-6xl">
      {/* Thông tin phim */}
      <div className="flex flex-col md:flex-row gap-6 md:gap-8 mb-8">
        {/* Poster */}
        <div className="w-full md:w-1/3">
          <Card
            className="h-full"
            cover={
              <div className="relative w-full aspect-[2/3] overflow-hidden rounded-lg">
                <img
                  alt={movieDetail.tenPhim}
                  src={movieDetail.hinhAnh}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            }
          >
            <Button
              type="primary"
              block
              size="large"
              onClick={() => setShowTrailer(true)}
              className="flex items-center justify-center"
            >
              🎬 Xem Trailer
            </Button>
          </Card>
        </div>

        {/* Info */}
        <div className="w-full md:w-2/3 flex flex-col justify-center">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3">
            {movieDetail.tenPhim}
          </h1>
          <p className="text-gray-500 mb-2 text-sm sm:text-base">
            <span className="font-semibold text-gray-700">Bí danh:</span> {movieDetail.biDanh}
          </p>
          <p className="mb-3 text-sm sm:text-base">
            <strong>Ngày khởi chiếu: </strong>
            {dayjs(movieDetail.ngayKhoiChieu).format("DD/MM/YYYY")}
          </p>
          <div className="flex flex-wrap gap-2 mb-2">
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
        <h3 className="text-xl sm:text-2xl font-semibold">📖 Nội dung phim</h3>
      </Divider>
      <p className="text-justify mb-10 leading-relaxed text-sm sm:text-base">
        {movieDetail.moTa}
      </p>

      {/* Chọn lịch chiếu */}
      <Divider orientation="left">
        <h3 className="text-xl sm:text-2xl font-semibold">📅 Chọn lịch chiếu</h3>
      </Divider>

      {showtimes.length === 0 ? (
        <Alert
          message="Không có lịch chiếu"
          description="Hiện tại không có lịch chiếu nào cho phim này."
          type="info"
          className="mb-6"
        />
      ) : (
        <div className="space-y-5 mb-4">
          {showtimes.map((rap) => (
            <div key={rap.maCumRap}>
              <div className="font-semibold">{rap.tenCumRap}</div>
              <div className="text-gray-600 text-sm">{rap.diaChi}</div>

              {/* Nút lịch chiếu: cuộn ngang trên mobile, grid trên rộng hơn */}
              <div className="mt-3">
                {/* Mobile: scroll ngang */}
                <div className="flex gap-2 overflow-x-auto sm:hidden [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {rap.lichChieuPhim.map((lc) => (
                    <Button
                      key={lc.maLichChieu}
                      type={
                        selectedShowtime?.maLichChieu === lc.maLichChieu ? "primary" : "default"
                      }
                      size="small"
                      onClick={() => setSelectedShowtime(lc)}
                    >
                      {dayjs(lc.ngayChieuGioChieu).format("DD/MM HH:mm")}
                    </Button>
                  ))}
                </div>

                {/* Tablet/Laptop: grid đều */}
                <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {rap.lichChieuPhim.map((lc) => (
                    <Button
                      key={lc.maLichChieu}
                      type={
                        selectedShowtime?.maLichChieu === lc.maLichChieu ? "primary" : "default"
                      }
                      size="small"
                      onClick={() => setSelectedShowtime(lc)}
                      className="justify-self-start"
                    >
                      {dayjs(lc.ngayChieuGioChieu).format("DD/MM/YYYY HH:mm")}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Chọn ghế */}
      {selectedShowtime && (
        <>
          <Divider orientation="left">
            <h3 className="text-xl sm:text-2xl font-semibold">🎟️ Chọn ghế</h3>
          </Divider>

          {seatsError && (
            <Alert
              message="Lỗi tải ghế"
              description={seatsError}
              type="error"
              className="mb-4"
            />
          )}

          <SeatMap
            seats={roomSeats}
            selected={selectedSeats}
            onSelect={handleSelect}
            loading={seatsLoading}
            maLichChieu={selectedShowtime?.maLichChieu}
            setSelected={setSelectedSeats}
          />

          {/* Nút đặt vé (tuỳ chọn) */}
          {/* <div className="text-center mt-6">
            <Button
              type="primary"
              size="large"
              disabled={selectedSeats.length === 0}
              className="px-8 py-4 text-lg"
              onClick={handleBookTickets}
            >
              Đặt vé ({selectedSeats.length})
            </Button>
          </div> */}
        </>
      )}

      {/* Modal Trailer (responsive width + aspect-video) */}
      <Modal
        open={showTrailer}
        footer={null}
        onCancel={() => setShowTrailer(false)}
        style={{ top: 24 }}
        width="min(900px, 92vw)"
        bodyStyle={{ padding: 0 }}
        destroyOnClose
      >
        <div className="w-full aspect-video">
          <iframe
            className="w-full h-full"
            src={movieDetail?.trailer?.replace("watch?v=", "embed/")}
            title="Trailer"
            allowFullScreen
          />
        </div>
      </Modal>
    </div>
  );
}
