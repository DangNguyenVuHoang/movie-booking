import { Card, Button, Tag, Rate } from "antd";
import { Link } from "react-router-dom";

export default function MovieCard({ movie }) {
  // ✅ Lấy điểm gốc từ API (0–5)
  const score5 = typeof movie.danhGia === "number" ? movie.danhGia : 0;

  return (
    <Card
      hoverable
      className="w-full rounded-xl shadow-md transition-transform hover:scale-105 flex flex-col"
      cover={
        <div className="relative w-full aspect-[2/3] overflow-hidden">
          <img
            alt={movie.tenPhim}
            src={movie.hinhAnh}
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* ✅ Trạng thái phim */}
          <div className="absolute top-2 left-2">
            {movie.dangChieu && <Tag color="green">Đang chiếu</Tag>}
            {movie.sapChieu && <Tag color="blue">Sắp chiếu</Tag>}
            {!movie.dangChieu && !movie.sapChieu && (
              <Tag color="red">Ngừng chiếu</Tag>
            )}
          </div>
        </div>
      }
    >
      <Card.Meta
        title={
          <span className="font-bold text-gray-800 line-clamp-2">
            {movie.tenPhim}
          </span>
        }
        description={
          <span className="text-gray-600 text-sm line-clamp-3">
            {(movie.moTa || "").slice(0, 80) + "..."}
          </span>
        }
      />

      {/* ⭐ Đánh giá sao (0–5) */}
      <div className="mt-3 flex items-center">
        <Rate
          allowHalf
          disabled
          value={score5}
          className="
            shrink-0 whitespace-nowrap
            !text-[12px] sm:!text-[14px] lg:!text-[18px]
            [&_.ant-rate-star]:mr-0.5 sm:[&_.ant-rate-star]:mr-1
          "
        />
        <span className="ml-2 sm:ml-3 md:ml-4 text-gray-700 font-medium text-xs sm:text-sm md:text-base whitespace-nowrap">
          {score5.toFixed(1)}/5
        </span>
      </div>

      {/* ✅ Nút đặt vé */}
      <Link to={`/movies/${movie.maPhim}`} className="block mt-4">
        <Button type="primary" className="w-full bg-red-600 hover:bg-red-700">
          Đặt vé
        </Button>
      </Link>
    </Card>
  );
}
