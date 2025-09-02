import { Container, Row, Col } from "react-bootstrap";
import {
  FacebookFilled,
  TwitterSquareFilled,
  InstagramFilled,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-dark text-white pt-5 pb-3 mt-5">
      <Container>
        <Row className="gy-4">
          {/* Logo + giới thiệu */}
          <Col md={4}>
            <h4 className="text-danger fw-bold">🎬 Movie Booking</h4>
            <p className="text-light small mt-3">
              Đặt vé xem phim nhanh chóng, tiện lợi và an toàn.  
              Trải nghiệm điện ảnh tuyệt vời cùng chúng tôi!
            </p>
          </Col>

          {/* Liên kết nhanh */}
          <Col md={4}>
            <h5 className="fw-semibold text-white mb-3">Liên kết nhanh</h5>
            <ul className="list-unstyled">
              <li>
                <Link to="/" className="text-light text-decoration-none">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link to="/movies" className="text-light text-decoration-none">
                  Phim
                </Link>
              </li>
              <li>
                <Link to="/" className="text-light text-decoration-none">
                  Liên hệ
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-light text-decoration-none">
                  Giới thiệu
                </Link>
              </li>
            </ul>
          </Col>

          {/* Liên hệ */}
          <Col md={4}>
            <h5 className="fw-semibold text-white mb-3">Liên hệ</h5>
            <p className="small mb-2">
              <MailOutlined className="me-2 text-danger" /> support@moviebooking.com
            </p>
            <p className="small mb-3">
              <PhoneOutlined className="me-2 text-danger" /> 0123 456 789
            </p>
            <div className="d-flex gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-light fs-4"
              >
                <FacebookFilled />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-light fs-4"
              >
                <TwitterSquareFilled />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-light fs-4"
              >
                <InstagramFilled />
              </a>
            </div>
          </Col>
        </Row>

        {/* Copyright */}
        <hr className="border-secondary my-4" />
        <p className="text-center text-secondary small mb-0">
          © {new Date().getFullYear()} Movie Booking. All rights reserved.
        </p>
      </Container>
    </footer>
  );
}
