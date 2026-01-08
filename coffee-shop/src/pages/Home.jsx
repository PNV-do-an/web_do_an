// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCoffee, FaStar, FaTruck, FaShieldAlt, FaTag, FaShoppingCart } from 'react-icons/fa';
import ProductCard from '../components/ProductCard';
import { getProducts, getTopProducts } from '../services/productService';
import { toast } from 'react-toastify';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newProducts, setNewProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      // Load tất cả sản phẩm
      const allProducts = await getProducts();
      
      // Lấy 4 sản phẩm nổi bật (featured)
      const featured = allProducts.filter(product => product.featured).slice(0, 4);
      setFeaturedProducts(featured);
      
      // Lấy 8 sản phẩm mới nhất (sắp xếp theo ngày tạo)
      const sortedProducts = [...allProducts].sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      setNewProducts(sortedProducts.slice(0, 8));
      
    } catch (error) {
      console.error('Lỗi tải sản phẩm:', error);
      toast.error('Lỗi tải sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItemIndex = cart.findIndex(item => item.id === product.id);
    
    if (existingItemIndex >= 0) {
      cart[existingItemIndex].quantity += 1;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1
      });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    toast.success('Đã thêm vào giỏ hàng!');
    
    // Dispatch event để Header cập nhật số lượng
    window.dispatchEvent(new Event('cartUpdated'));
  };

  // Hiển thị loading
  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section py-5 mb-5" 
        style={{
          background: 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'white',
          borderRadius: '10px'
        }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold mb-4">
                <FaCoffee className="me-3" />
                Coffee Shop
              </h1>
              <p className="lead mb-4">
                Khám phá hương vị cà phê đặc biệt từ những hạt cà phê rang xay mỗi ngày. 
                Thưởng thức sự khác biệt trong từng giọt cà phê.
              </p>
              <div className="d-flex gap-3">
                <Link to="/products" className="btn btn-light btn-lg">
                  <FaShoppingCart className="me-2" />
                  Mua ngay
                </Link>
                <Link to="/products" className="btn btn-outline-light btn-lg">
                  Xem sản phẩm
                </Link>
              </div>
            </div>
            <div className="col-lg-6 text-center mt-4 mt-lg-0">
              <img 
                src="https://images.unsplash.com/photo-1511537190424-bbbab87ac5eb?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
                alt="Coffee"
                className="img-fluid rounded shadow"
                style={{ maxHeight: '400px' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section mb-5">
        <div className="container">
          <div className="row text-center">
            <div className="col-md-3 col-6 mb-4">
              <div className="p-4 bg-light rounded">
                <FaTruck size={40} className="text-primary mb-3" />
                <h5>Giao hàng nhanh</h5>
                <p className="text-muted">Giao trong 2 giờ</p>
              </div>
            </div>
            <div className="col-md-3 col-6 mb-4">
              <div className="p-4 bg-light rounded">
                <FaShieldAlt size={40} className="text-success mb-3" />
                <h5>Chất lượng đảm bảo</h5>
                <p className="text-muted">100% nguyên chất</p>
              </div>
            </div>
            <div className="col-md-3 col-6 mb-4">
              <div className="p-4 bg-light rounded">
                <FaStar size={40} className="text-warning mb-3" />
                <h5>Đánh giá 5 sao</h5>
                <p className="text-muted">Khách hàng hài lòng</p>
              </div>
            </div>
            <div className="col-md-3 col-6 mb-4">
              <div className="p-4 bg-light rounded">
                <FaTag size={40} className="text-danger mb-3" />
                <h5>Giá tốt nhất</h5>
                <p className="text-muted">Cam kết giá tốt</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-products mb-5">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold">Sản phẩm nổi bật</h2>
            <Link to="/products" className="btn btn-outline-primary">
              Xem tất cả
            </Link>
          </div>
          
          {featuredProducts.length > 0 ? (
            <div className="row g-4">
              {featuredProducts.map(product => (
                <div key={product.id} className="col-md-3 col-sm-6">
                  <ProductCard 
                    product={product} 
                    onAddToCart={handleAddToCart}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-muted">Chưa có sản phẩm nổi bật</p>
            </div>
          )}
        </div>
      </section>

      {/* New Arrivals */}
      <section className="new-arrivals mb-5">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold">Sản phẩm mới</h2>
            <Link to="/products" className="btn btn-outline-primary">
              Xem tất cả
            </Link>
          </div>
          
          {newProducts.length > 0 ? (
            <div className="row g-4">
              {newProducts.map(product => (
                <div key={product.id} className="col-md-3 col-sm-6">
                  <ProductCard 
                    product={product} 
                    onAddToCart={handleAddToCart}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-muted">Chưa có sản phẩm mới</p>
            </div>
          )}
        </div>
      </section>

      {/* About Section */}
      <section className="about-section py-5 mb-5 bg-light rounded">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <img 
                src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                alt="About Coffee Shop"
                className="img-fluid rounded shadow"
              />
            </div>
            <div className="col-lg-6">
              <h2 className="mb-4">Về chúng tôi</h2>
              <p className="mb-4">
                Coffee Shop được thành lập với mong muốn mang đến cho khách hàng những 
                trải nghiệm cà phê tuyệt vời nhất. Chúng tôi lựa chọn những hạt cà phê 
                chất lượng nhất từ các vùng trồng nổi tiếng trên thế giới.
              </p>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <div className="d-flex align-items-center">
                    <div className="bg-primary text-white rounded-circle p-2 me-3">
                      <FaStar />
                    </div>
                    <div>
                      <h5 className="mb-0">Chất lượng hàng đầu</h5>
                      <small className="text-muted">100% nguyên chất</small>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 mb-3">
                  <div className="d-flex align-items-center">
                    <div className="bg-success text-white rounded-circle p-2 me-3">
                      <FaTruck />
                    </div>
                    <div>
                      <h5 className="mb-0">Giao hàng tận nơi</h5>
                      <small className="text-muted">Miễn phí với đơn 200K+</small>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 mb-3">
                  <div className="d-flex align-items-center">
                    <div className="bg-warning text-white rounded-circle p-2 me-3">
                      <FaShieldAlt />
                    </div>
                    <div>
                      <h5 className="mb-0">Đảm bảo hài lòng</h5>
                      <small className="text-muted">Hoàn tiền nếu không hài lòng</small>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 mb-3">
                  <div className="d-flex align-items-center">
                    <div className="bg-info text-white rounded-circle p-2 me-3">
                      <FaTag />
                    </div>
                    <div>
                      <h5 className="mb-0">Giá cả hợp lý</h5>
                      <small className="text-muted">Cam kết giá tốt nhất</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section mb-5">
        <div className="container">
          <h2 className="text-center mb-5">Danh mục sản phẩm</h2>
          <div className="row g-4">
            <div className="col-md-3 col-6">
              <Link to="/products?category=Cà phê truyền thống" className="text-decoration-none">
                <div className="card text-center border-0 shadow-sm hover-lift">
                  <img 
                    src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
                    className="card-img-top"
                    alt="Cà phê truyền thống"
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                  <div className="card-body">
                    <h5 className="card-title">Cà phê truyền thống</h5>
                  </div>
                </div>
              </Link>
            </div>
            <div className="col-md-3 col-6">
              <Link to="/products?category=Cà phê máy" className="text-decoration-none">
                <div className="card text-center border-0 shadow-sm hover-lift">
                  <img 
                    src="https://images.unsplash.com/photo-1510707577719-ae7c9b788690?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
                    className="card-img-top"
                    alt="Cà phê máy"
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                  <div className="card-body">
                    <h5 className="card-title">Cà phê máy</h5>
                  </div>
                </div>
              </Link>
            </div>
            <div className="col-md-3 col-6">
              <Link to="/products?category=Trà" className="text-decoration-none">
                <div className="card text-center border-0 shadow-sm hover-lift">
                  <img 
                    src="https://images.unsplash.com/photo-1561034928-f076f61f32c9?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
                    className="card-img-top"
                    alt="Trà"
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                  <div className="card-body">
                    <h5 className="card-title">Trà các loại</h5>
                  </div>
                </div>
              </Link>
            </div>
            <div className="col-md-3 col-6">
              <Link to="/products?category=Nước ép" className="text-decoration-none">
                <div className="card text-center border-0 shadow-sm hover-lift">
                  <img 
                    src="https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
                    className="card-img-top"
                    alt="Nước ép"
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                  <div className="card-body">
                    <h5 className="card-title">Nước ép trái cây</h5>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials mb-5">
        <div className="container">
          <h2 className="text-center mb-5">Khách hàng nói gì về chúng tôi</h2>
          <div className="row">
            <div className="col-md-4 mb-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <img 
                      src="https://randomuser.me/api/portraits/women/32.jpg"
                      alt="Customer"
                      className="rounded-circle me-3"
                      width="50"
                      height="50"
                    />
                    <div>
                      <h5 className="mb-0">Nguyễn Thị Minh</h5>
                      <div className="text-warning">
                        <FaStar />
                        <FaStar />
                        <FaStar />
                        <FaStar />
                        <FaStar />
                      </div>
                    </div>
                  </div>
                  <p className="card-text">
                    "Cà phê rất thơm ngon, giao hàng nhanh chóng. 
                    Tôi sẽ tiếp tục ủng hộ Coffee Shop!"
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <img 
                      src="https://randomuser.me/api/portraits/men/54.jpg"
                      alt="Customer"
                      className="rounded-circle me-3"
                      width="50"
                      height="50"
                    />
                    <div>
                      <h5 className="mb-0">Trần Văn Hùng</h5>
                      <div className="text-warning">
                        <FaStar />
                        <FaStar />
                        <FaStar />
                        <FaStar />
                        <FaStar />
                      </div>
                    </div>
                  </div>
                  <p className="card-text">
                    "Chất lượng cà phê tuyệt vời! 
                    Đóng gói cẩn thận, hương vị đậm đà. Rất hài lòng!"
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <img 
                      src="https://randomuser.me/api/portraits/women/68.jpg"
                      alt="Customer"
                      className="rounded-circle me-3"
                      width="50"
                      height="50"
                    />
                    <div>
                      <h5 className="mb-0">Lê Thị Hương</h5>
                      <div className="text-warning">
                        <FaStar />
                        <FaStar />
                        <FaStar />
                        <FaStar />
                        <FaStar />
                      </div>
                    </div>
                  </div>
                  <p className="card-text">
                    "Dịch vụ tốt, nhân viên nhiệt tình. 
                    Cà phê luôn tươi mới, rang xay đúng độ."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section py-5 mb-5 text-white rounded"
        style={{
          background: 'linear-gradient(135deg, #6F4E37 0%, #C19A6B 100%)'
        }}>
        <div className="container text-center">
          <h2 className="mb-4">Sẵn sàng thưởng thức cà phê ngon?</h2>
          <p className="lead mb-4">
            Đăng ký ngay để nhận ưu đãi đặc biệt và cập nhật sản phẩm mới
          </p>
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="input-group mb-3">
                <input 
                  type="email" 
                  className="form-control" 
                  placeholder="Nhập email của bạn"
                />
                <button className="btn btn-light" type="button">
                  Đăng ký
                </button>
              </div>
              <small className="text-white-50">
                Chúng tôi cam kết không spam. Bạn có thể hủy đăng ký bất cứ lúc nào.
              </small>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;