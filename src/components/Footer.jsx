// src/components/Footer.jsx
import {
  FacebookFilled,
  TwitterSquareFilled,
  InstagramFilled,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";

export default function Footer() {
  const location = useLocation();

  // ❌ Không render Footer trong admin
  if (location.pathname.startsWith("/admin")) return null;

  return (
    <footer className="bg-gray-900 text-white pt-10 pb-5 mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Logo + giới thiệu */}
          <div>
            <h4 className="text-red-500 font-bold text-xl">🎬 Movie Booking</h4>
            <p className="text-gray-300 text-sm mt-3 leading-relaxed">
              Đặt vé xem phim nhanh chóng, tiện lợi và an toàn.
              <br />
              Trải nghiệm điện ảnh tuyệt vời cùng chúng tôi!
            </p>
          </div>

          {/* Liên kết nhanh */}
          <div>
            <h5 className="font-semibold text-white mb-3 text-lg">
              Liên kết nhanh
            </h5>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/user/home"
                  className="text-gray-300 hover:text-red-400 transition-colors"
                >
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link
                  to="/user/movies"
                  className="text-gray-300 hover:text-red-400 transition-colors"
                >
                  Phim
                </Link>
              </li>
              <li>
                <Link
                  to="/user/account"
                  className="text-gray-300 hover:text-red-400 transition-colors"
                >
                  Tài khoản
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-gray-300 hover:text-red-400 transition-colors"
                >
                  Giới thiệu
                </Link>
              </li>
            </ul>
          </div>

          {/* Liên hệ */}
          <div>
            <h5 className="font-semibold text-white mb-3 text-lg">Liên hệ</h5>
            <p className="text-sm text-gray-300 mb-2 flex items-center">
              <MailOutlined className="text-red-500 mr-2" />{" "}
              dangnguyenvuhoang8384@gmail.com
            </p>
            <p className="text-sm text-gray-300 mb-4 flex items-center">
              <PhoneOutlined className="text-red-500 mr-2" /> 0346 711 532
            </p>
            <div className="flex gap-4 text-2xl">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-blue-500 transition-colors"
              >
                <FacebookFilled />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-sky-400 transition-colors"
              >
                <TwitterSquareFilled />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-pink-500 transition-colors"
              >
                <InstagramFilled />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <hr className="border-gray-700 my-6" />
        <p className="text-center text-gray-400 text-sm">
          © {new Date().getFullYear()} Movie Booking. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
