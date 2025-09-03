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
        const cumRap = res.content.heThongRapChieu[0]?.cumRapChieu || [];
        setShowtimes(cumRap);

        // Tự động chọn lịch chiếu đầu tiên nếu có
        const firstShowtime = cumRap[0]?.lichChieuPhim[0];
        if (firstShowtime) {
          setSelectedShowtime(firstShowtime);
        }
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
    if (selectedSeats.includes(seat.maGhe)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seat.maGhe));
    } else {
      setSelectedSeats([...selectedSeats, seat.maGhe]);
    }
  };

  const handleBookTickets = () => {
    if (selectedSeats.length === 0) return;

    message.success(`Đã chọn ${selectedSeats.length} ghế!`);
    // Thêm logic đặt vé ở đây
  };

  if (loading) {
    return (
      <div className="container py-10 mx-auto px-4 flex justify-center items-center h-64">
        <Spin tip="Đang tải chi tiết phim..." size="large" />
      </div>
    );
  }

  if (!movieDetail) {
    return (
      <div className="container py-10 mx-auto px-4">
        <Alert
          message="Không tìm thấy thông tin phim"
          description="Vui lòng thử lại sau hoặc chọn phim khác."
          type="error"
        />
      </div>
    );
  }

  return (
    <div className="container py-10 mx-auto px-4">
      {/* Thông tin phim */}
      <div className="flex flex-col md:flex-row gap-8 mb-8">
        <div className="w-full md:w-1/3">
          <Card
            cover={
              <img
                alt={movieDetail.tenPhim}
                src={movieDetail.hinhAnh}
                className="h-96 object-cover rounded-lg"
              />
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

        <div className="w-full md:w-2/3 flex flex-col justify-center">
          <h2 className="text-4xl font-bold mb-4">{movieDetail.tenPhim}</h2>
          <p className="text-gray-500 mb-3">Bí danh: {movieDetail.biDanh}</p>
          <p className="mb-3">
            <strong>Ngày khởi chiếu: </strong>
            {dayjs(movieDetail.ngayKhoiChieu).format("DD/MM/YYYY")}
          </p>
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
      <p className="text-justify mb-10 leading-relaxed">{movieDetail.moTa}</p>

      {/* Chọn lịch chiếu */}
      <Divider orientation="left">
        <h3 className="text-2xl font-semibold">📅 Chọn lịch chiếu</h3>
      </Divider>

      {showtimes.length === 0 ? (
        <Alert
          message="Không có lịch chiếu"
          description="Hiện tại không có lịch chiếu nào cho phim này."
          type="info"
        />
      ) : (
        showtimes.map((rap) => (
          <div key={rap.maCumRap} className="mb-4">
            <strong>{rap.tenCumRap}</strong> - {rap.diaChi}
            <div className="flex flex-wrap gap-2 mt-2">
              {rap.lichChieuPhim.map((lc) => (
                <Button
                  key={lc.maLichChieu}
                  type={
                    selectedShowtime?.maLichChieu === lc.maLichChieu
                      ? "primary"
                      : "default"
                  }
                  size="small"
                  onClick={() => setSelectedShowtime(lc)}
                >
                  {dayjs(lc.ngayChieuGioChieu).format("DD/MM/YYYY HH:mm")}
                </Button>
              ))}
            </div>
          </div>
        ))
      )}

      {/* Chọn ghế */}
      {selectedShowtime && (
        <>
          <Divider orientation="left">
            <h3 className="text-2xl font-semibold">🎟️ Chọn ghế</h3>
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
            maLichChieu={selectedShowtime?.maLichChieu} // truyền maLichChieu 
            setSelected={setSelectedSeats} // để reset sau khi book
          />

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
          src={movieDetail?.trailer?.replace("watch?v=", "embed/")}
          title="Trailer"
          frameBorder="0"
          allowFullScreen
        ></iframe>
      </Modal>
    </div>
  );
}
