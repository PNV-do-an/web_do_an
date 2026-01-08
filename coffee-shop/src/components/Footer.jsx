// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaTwitter, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-dark text-white mt-5">
      <div className="container py-5">
        <div className="row">
          {/* Company Info */}
          <div className="col-lg-4 mb-4">
            <h3 className="mb-3">Coffee Shop</h3>
            <p className="text-muted">
              Chúng tôi mang đến những ly cà phê chất lượng nhất, 
              được pha chế từ những hạt cà phê rang xay mỗi ngày.
            </p>
            <div className="d-flex gap-3 mt-4">
              <a href="#" className="text-white">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="text-white">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="text-white">
                <FaTwitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6 mb-4">
            <h5 className="mb-3">Liên kết nhanh</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/" className="text-decoration-none text-muted">
                  Trang chủ
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/products" className="text-decoration-none text-muted">
                  Sản phẩm
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/cart" className="text-decoration-none text-muted">
                  Giỏ hàng
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/orders" className="text-decoration-none text-muted">
                  Đơn hàng
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="col-lg-2 col-md-6 mb-4">
            <h5 className="mb-3">Danh mục</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="#" className="text-decoration-none text-muted">
                  Cà phê truyền thống
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-decoration-none text-muted">
                  Cà phê máy
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-decoration-none text-muted">
                  Trà
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-decoration-none text-muted">
                  Nước ép
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-lg-4 mb-4">
            <h5 className="mb-3">Thông tin liên hệ</h5>
            <ul className="list-unstyled">
              <li className="mb-3 d-flex align-items-start">
                <FaMapMarkerAlt className="me-3 mt-1" />
                <span className="text-muted">
                  123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh
                </span>
              </li>
              <li className="mb-3 d-flex align-items-center">
                <FaPhone className="me-3" />
                <span className="text-muted">+84 123 456 789</span>
              </li>
              <li className="mb-3 d-flex align-items-center">
                <FaEnvelope className="me-3" />
                <span className="text-muted">info@coffeeshop.com</span>
              </li>
            </ul>
          </div>
        </div>

        <hr className="text-muted" />

        {/* Copyright */}
        <div className="row">
          <div className="col-md-6">
            <p className="text-muted mb-0">
              © 2024 Coffee Shop. Tất cả các quyền được bảo lưu.
            </p>
          </div>
          <div className="col-md-6 text-md-end">
            <p className="text-muted mb-0">
              <a href="#" className="text-decoration-none text-muted me-3">
                Chính sách bảo mật
              </a>
              <a href="#" className="text-decoration-none text-muted">
                Điều khoản dịch vụ
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;