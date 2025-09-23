import { Carousel } from "antd";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBanner } from "../redux/movieSlice";

export default function Banner() {
  const dispatch = useDispatch();
  const { banners } = useSelector((state) => state.movie);

  useEffect(() => {
    dispatch(fetchBanner());
  }, []);

  return (
    <Carousel autoplay className="overflow-hidden">
      {banners.map((b) => (
        <div
          key={b.maBanner}
          className="relative w-full aspect-[16/9] bg-black"
        >
          <img
            src={b.hinhAnh}
            alt="banner"
            className="absolute top-0 left-0 w-full h-full object-cover"
          />
        </div>
      ))}
    </Carousel>
  );
}
