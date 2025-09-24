import { Card, Button } from "antd";
import { Link } from "react-router-dom";

export default function MovieCard({ movie }) {
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
            {movie.moTa?.slice(0, 80) + "..."}
          </span>
        }
      />
      <Link to={`/movies/${movie.maPhim}`} className="block mt-4">
        <Button
          type="primary"
          className="w-full bg-red-600 hover:bg-red-700"
        >
          Đặt vé
        </Button>
      </Link>
    </Card>
  );
}
