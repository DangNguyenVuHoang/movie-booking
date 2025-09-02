import { Card, Button } from "antd";
import { Link } from "react-router-dom";

export default function MovieCard({ movie, large }) {
  return (
    <Card
      hoverable
      className={`rounded-xl shadow-md transition-transform hover:scale-105 ${
        large ? "w-72" : "w-60"
      }`}
      cover={
        <img
          alt={movie.tenPhim}
          src={movie.hinhAnh}
          className={`object-cover ${large ? "h-96" : "h-80"} w-full`}
        />
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
      <Link to={`/movies/${movie.maPhim}`}>
        <Button
          type="primary"
          className="mt-4 w-full bg-red-600 hover:bg-red-700"
        >
          Đặt vé
        </Button>
      </Link>
    </Card>
  );
}
