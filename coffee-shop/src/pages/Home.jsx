// src/pages/Home.jsx - VỚI CSS INLINE LAYOUT NGANG
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCoffee, FaStar, FaTruck, FaShieldAlt, FaTag, FaShoppingCart, FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import ProductCard from '../components/ProductCard';
import { getProducts } from '../services/productService';
import { toast } from 'react-toastify';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newProducts, setNewProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [featuredScroll, setFeaturedScroll] = useState(0);
  const [newScroll, setNewScroll] = useState(0);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const allProducts = await getProducts();
      
      const featured = allProducts.filter(product => product.featured).slice(0, 6);
      setFeaturedProducts(featured);
      
      const sortedProducts = [...allProducts].sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      setNewProducts(sortedProducts.slice(0, 6));
      
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
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const scrollFeatured = (direction) => {
    const container = document.querySelector('.featured-products-scroll');
    if (container) {
      const scrollAmount = 300;
      container.scrollLeft += direction === 'left' ? -scrollAmount : scrollAmount;
      setFeaturedScroll(container.scrollLeft);
    }
  };

  const scrollNewArrivals = (direction) => {
    const container = document.querySelector('.new-arrivals-scroll');
    if (container) {
      const scrollAmount = 300;
      container.scrollLeft += direction === 'left' ? -scrollAmount : scrollAmount;
      setNewScroll(container.scrollLeft);
    }
  };

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
      {/* ===== HERO SECTION ===== */}
      <section className="hero-section py-5 mb-5" 
        style={{
          background: 'linear-gradient(135deg, rgba(60, 42, 33, 0.9) 0%, rgba(139, 115, 85, 0.8) 100%), url(https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'white',
          borderRadius: '15px',
          position: 'relative',
          overflow: 'hidden'
        }}>
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                background: 'rgba(212, 167, 106, 0.2)',
                backdropFilter: 'blur(10px)',
                border: '1px solid #D4A76A',
                color: '#D4A76A',
                padding: '10px 20px',
                borderRadius: '30px',
                fontSize: '14px',
                fontWeight: '600',
                marginBottom: '30px',
                animation: 'float 3s ease-in-out infinite'
              }}>
                <FaCoffee className="me-2" />
                <span>Premium Coffee Experience</span>
              </div>
              <h1 className="display-4 fw-bold mb-4" style={{
                fontFamily: "'Georgia', serif",
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                position: 'relative'
              }}>
                <span style={{
                  position: 'relative',
                  display: 'inline-block'
                }}>
                  Coffee Shop
                  <span style={{
                    position: 'absolute',
                    bottom: '5px',
                    left: 0,
                    width: '100%',
                    height: '8px',
                    background: 'rgba(212, 167, 106, 0.3)',
                    zIndex: -1,
                    borderRadius: '4px'
                  }}></span>
                </span>
              </h1>
              <p className="lead mb-4" style={{
                fontSize: '1.1rem',
                lineHeight: '1.8',
                opacity: '0.9',
                maxWidth: '500px'
              }}>
                Khám phá hương vị cà phê đặc biệt từ những hạt cà phê rang xay mỗi ngày. 
                Thưởng thức sự khác biệt trong từng giọt cà phê.
              </p>
              <div className="d-flex gap-3">
                <Link to="/products" className="btn btn-light btn-lg" style={{
                  background: 'linear-gradient(135deg, #D4A76A, #8B7355)',
                  border: 'none',
                  borderRadius: '30px',
                  padding: '15px 30px',
                  fontWeight: '600',
                  transition: 'all 0.3s ease'
                }}>
                  <FaShoppingCart className="me-2" />
                  Mua ngay
                </Link>
                <Link to="/products" className="btn btn-outline-light btn-lg" style={{
                  borderRadius: '30px',
                  padding: '15px 30px',
                  fontWeight: '600',
                  transition: 'all 0.3s ease'
                }}>
                  Xem sản phẩm
                </Link>
              </div>
            </div>
            <div className="col-lg-6 text-center mt-4 mt-lg-0">
              <div style={{
                borderRadius: '15px',
                overflow: 'hidden',
                boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                transform: 'perspective(1000px) rotateY(-10deg)',
                transition: 'transform 0.4s ease'
              }}>
                <img 
                  src="https://images.unsplash.com/photo-1511537190424-bbbab87ac5eb?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
                  alt="Coffee"
                  className="img-fluid"
                  style={{ 
                    maxHeight: '400px',
                    width: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.4s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.parentElement.style.transform = 'perspective(1000px) rotateY(0deg)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.parentElement.style.transform = 'perspective(1000px) rotateY(-10deg)';
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURES SECTION ===== */}
      <section className="features-section mb-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold" style={{
              fontSize: '2.5rem',
              color: '#3C2A21',
              position: 'relative',
              display: 'inline-block'
            }}>
              Tại sao chọn chúng tôi
              <span style={{
                position: 'absolute',
                bottom: '-10px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '80px',
                height: '3px',
                background: '#D4A76A',
                borderRadius: '2px'
              }}></span>
            </h2>
            <p className="text-muted" style={{ maxWidth: '600px', margin: '15px auto 0' }}>
              Những lý do khiến Coffee House trở thành lựa chọn hàng đầu
            </p>
          </div>
          <div className="row text-center">
            {[
              { icon: <FaTruck />, color: '#0d6efd', title: 'Giao hàng nhanh', desc: 'Giao trong 2 giờ' },
              { icon: <FaShieldAlt />, color: '#198754', title: 'Chất lượng đảm bảo', desc: '100% nguyên chất' },
              { icon: <FaStar />, color: '#ffc107', title: 'Đánh giá 5 sao', desc: 'Khách hàng hài lòng' },
              { icon: <FaTag />, color: '#dc3545', title: 'Giá tốt nhất', desc: 'Cam kết giá tốt' }
            ].map((feature, index) => (
              <div key={index} className="col-md-3 col-6 mb-4">
                <div className="p-4 rounded" style={{
                  background: 'white',
                  border: '1px solid #F5E8C7',
                  borderRadius: '15px',
                  boxShadow: '0 4px 20px rgba(60, 42, 33, 0.1)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-10px)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(60, 42, 33, 0.2)';
                  e.currentTarget.style.borderColor = '#D4A76A';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(60, 42, 33, 0.1)';
                  e.currentTarget.style.borderColor = '#F5E8C7';
                }}>
                  <div style={{
                    width: '70px',
                    height: '70px',
                    background: `linear-gradient(135deg, ${feature.color}, ${feature.color}99)`,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px',
                    color: 'white',
                    fontSize: '28px',
                    transition: 'transform 0.3s ease'
                  }}>
                    {feature.icon}
                  </div>
                  <h5 style={{ color: '#3C2A21', marginBottom: '10px' }}>{feature.title}</h5>
                  <p className="text-muted" style={{ fontSize: '0.9rem', margin: 0 }}>{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURED PRODUCTS - LAYOUT NGANG ===== */}
      <section className="featured-products mb-5">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold" style={{ color: '#3C2A21' }}>Sản phẩm nổi bật</h2>
            <Link to="/products" className="btn btn-outline-primary" style={{
              borderColor: '#D4A76A',
              color: '#D4A76A',
              borderRadius: '20px',
              padding: '8px 20px',
              fontWeight: '600',
              transition: 'all 0.3s ease'
            }}>
              Xem tất cả
            </Link>
          </div>
          
          {featuredProducts.length > 0 ? (
            <div style={{ position: 'relative' }}>
              {featuredScroll > 0 && (
                <button
                  className="btn"
                  onClick={() => scrollFeatured('left')}
                  style={{
                    position: 'absolute',
                    left: '-20px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '40px',
                    height: '40px',
                    background: 'white',
                    border: '2px solid #D4A76A',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#D4A76A',
                    cursor: 'pointer',
                    zIndex: 10,
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#D4A76A';
                    e.currentTarget.style.color = 'white';
                    e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'white';
                    e.currentTarget.style.color = '#D4A76A';
                    e.currentTarget.style.transform = 'translateY(-50%)';
                  }}
                >
                  <FaArrowLeft />
                </button>
              )}
              
              <div 
                className="featured-products-scroll"
                style={{
                  display: 'flex',
                  gap: '25px',
                  padding: '20px 10px',
                  overflowX: 'auto',
                  scrollBehavior: 'smooth',
                  WebkitOverflowScrolling: 'touch',
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#D4A76A #F5E8C7'
                }}
              >
                {featuredProducts.map(product => (
                  <div key={product.id} style={{ minWidth: '280px' }}>
                    <ProductCard 
                      product={product} 
                      onAddToCart={handleAddToCart}
                    />
                  </div>
                ))}
              </div>
              
              <button
                className="btn"
                onClick={() => scrollFeatured('right')}
                style={{
                  position: 'absolute',
                  right: '-20px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '40px',
                  height: '40px',
                  background: 'white',
                  border: '2px solid #D4A76A',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#D4A76A',
                  cursor: 'pointer',
                  zIndex: 10,
                  boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#D4A76A';
                  e.currentTarget.style.color = 'white';
                  e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'white';
                  e.currentTarget.style.color = '#D4A76A';
                  e.currentTarget.style.transform = 'translateY(-50%)';
                }}
              >
                <FaArrowRight />
              </button>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-muted">Chưa có sản phẩm nổi bật</p>
            </div>
          )}
        </div>
      </section>

      {/* ===== NEW ARRIVALS - LAYOUT NGANG ===== */}
      <section className="new-arrivals mb-5">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold" style={{ color: '#3C2A21' }}>Sản phẩm mới</h2>
            <Link to="/products" className="btn btn-outline-primary" style={{
              borderColor: '#D4A76A',
              color: '#D4A76A',
              borderRadius: '20px',
              padding: '8px 20px',
              fontWeight: '600',
              transition: 'all 0.3s ease'
            }}>
              Xem tất cả
            </Link>
          </div>
          
          {newProducts.length > 0 ? (
            <div style={{ position: 'relative' }}>
              {newScroll > 0 && (
                <button
                  className="btn"
                  onClick={() => scrollNewArrivals('left')}
                  style={{
                    position: 'absolute',
                    left: '-20px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '40px',
                    height: '40px',
                    background: 'white',
                    border: '2px solid #D4A76A',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#D4A76A',
                    cursor: 'pointer',
                    zIndex: 10,
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#D4A76A';
                    e.currentTarget.style.color = 'white';
                    e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'white';
                    e.currentTarget.style.color = '#D4A76A';
                    e.currentTarget.style.transform = 'translateY(-50%)';
                  }}
                >
                  <FaArrowLeft />
                </button>
              )}
              
              <div 
                className="new-arrivals-scroll"
                style={{
                  display: 'flex',
                  gap: '25px',
                  padding: '20px 10px',
                  overflowX: 'auto',
                  scrollBehavior: 'smooth',
                  WebkitOverflowScrolling: 'touch',
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#D4A76A #F5E8C7'
                }}
              >
                {newProducts.map(product => (
                  <div key={product.id} style={{ minWidth: '280px' }}>
                    <ProductCard 
                      product={product} 
                      onAddToCart={handleAddToCart}
                    />
                  </div>
                ))}
              </div>
              
              <button
                className="btn"
                onClick={() => scrollNewArrivals('right')}
                style={{
                  position: 'absolute',
                  right: '-20px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '40px',
                  height: '40px',
                  background: 'white',
                  border: '2px solid #D4A76A',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#D4A76A',
                  cursor: 'pointer',
                  zIndex: 10,
                  boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#D4A76A';
                  e.currentTarget.style.color = 'white';
                  e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'white';
                  e.currentTarget.style.color = '#D4A76A';
                  e.currentTarget.style.transform = 'translateY(-50%)';
                }}
              >
                <FaArrowRight />
              </button>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-muted">Chưa có sản phẩm mới</p>
            </div>
          )}
        </div>
      </section>

      {/* ===== ABOUT SECTION ===== */}
      <section className="about-section py-5 mb-5" style={{
        background: 'linear-gradient(135deg, #FFF8F0 0%, #F5E8C7 100%)',
        borderRadius: '15px'
      }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <div style={{
                borderRadius: '15px',
                overflow: 'hidden',
                boxShadow: '0 10px 30px rgba(60, 42, 33, 0.2)'
              }}>
                <img 
                  src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                  alt="About Coffee Shop"
                  className="img-fluid"
                  style={{ 
                    width: '100%',
                    height: '400px',
                    objectFit: 'cover',
                    transition: 'transform 0.4s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                />
              </div>
            </div>
            <div className="col-lg-6">
              <h2 className="mb-4" style={{ color: '#3C2A21', fontFamily: "'Georgia', serif" }}>Về chúng tôi</h2>
              <p className="mb-4" style={{ color: '#5C4033', lineHeight: '1.8' }}>
                Coffee Shop được thành lập với mong muốn mang đến cho khách hàng những 
                trải nghiệm cà phê tuyệt vời nhất. Chúng tôi lựa chọn những hạt cà phê 
                chất lượng nhất từ các vùng trồng nổi tiếng trên thế giới.
              </p>
              <div className="row">
                {[
                  { icon: <FaStar />, bg: '#0d6efd', title: 'Chất lượng hàng đầu', desc: '100% nguyên chất' },
                  { icon: <FaTruck />, bg: '#198754', title: 'Giao hàng tận nơi', desc: 'Miễn phí với đơn 200K+' },
                  { icon: <FaShieldAlt />, bg: '#ffc107', title: 'Đảm bảo hài lòng', desc: 'Hoàn tiền nếu không hài lòng' },
                  { icon: <FaTag />, bg: '#0dcaf0', title: 'Giá cả hợp lý', desc: 'Cam kết giá tốt nhất' }
                ].map((item, index) => (
                  <div key={index} className="col-md-6 mb-3">
                    <div className="d-flex align-items-center">
                      <div style={{
                        background: item.bg,
                        color: 'white',
                        borderRadius: '50%',
                        padding: '12px',
                        marginRight: '15px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minWidth: '45px',
                        height: '45px',
                        transition: 'transform 0.3s ease'
                      }}>
                        {item.icon}
                      </div>
                      <div>
                        <h5 className="mb-0" style={{ color: '#3C2A21', fontSize: '1rem' }}>{item.title}</h5>
                        <small className="text-muted">{item.desc}</small>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CATEGORIES SECTION ===== */}
      <section className="categories-section mb-5">
        <div className="container">
          <h2 className="text-center mb-5" style={{ color: '#3C2A21' }}>Danh mục sản phẩm</h2>
          <div className="row g-4">
            {[
              { 
                image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
                title: 'Cà phê truyền thống',
                category: 'Cà phê truyền thống'
              },
              { 
                image: 'https://vinbarista.com/uploads/editer/images/blogs/ca-phe-pha-may-la-gi.jpg',
                title: 'Cà phê máy',
                category: 'Cà phê máy'
              },
              { 
                image: 'https://huongtraviet.com/wp-content/uploads/2019/04/6-loai-tra-co-ban.jpg',
                title: 'Trà các loại',
                category: 'Trà'
              },
              { 
                image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
                title: 'Nước ép trái cây',
                category: 'Nước ép'
              }
            ].map((cat, index) => (
              <div key={index} className="col-md-3 col-6">
                <Link to={`/products?category=${cat.category}`} className="text-decoration-none">
                  <div style={{
                    borderRadius: '15px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    transition: 'all 0.3s ease',
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-10px)';
                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
                  }}>
                    <div style={{
                      height: '200px',
                      position: 'relative',
                      overflow: 'hidden'
                    }}>
                      <img 
                        src={cat.image}
                        alt={cat.title}
                        style={{ 
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transition: 'transform 0.4s ease'
                        }}
                      />
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent 50%)',
                        display: 'flex',
                        alignItems: 'flex-end',
                        padding: '20px'
                      }}>
                        <h5 className="card-title" style={{ color: 'white', margin: 0 }}>{cat.title}</h5>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="testimonials mb-5">
        <div className="container">
          <h2 className="text-center mb-5" style={{ color: '#3C2A21' }}>Khách hàng nói gì về chúng tôi</h2>
          <div className="row">
            {[
              { 
                avatar: 'https://randomuser.me/api/portraits/women/32.jpg',
                name: 'Nguyễn Thị Minh',
                text: '"Cà phê rất thơm ngon, giao hàng nhanh chóng. Tôi sẽ tiếp tục ủng hộ Coffee Shop!"'
              },
              { 
                avatar: 'https://randomuser.me/api/portraits/men/54.jpg',
                name: 'Trần Văn Hùng',
                text: '"Chất lượng cà phê tuyệt vời! Đóng gói cẩn thận, hương vị đậm đà. Rất hài lòng!"'
              },
              { 
                avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
                name: 'Lê Thị Hương',
                text: '"Dịch vụ tốt, nhân viên nhiệt tình. Cà phê luôn tươi mới, rang xay đúng độ."'
              }
            ].map((testimonial, index) => (
              <div key={index} className="col-md-4 mb-4">
                <div style={{
                  background: 'white',
                  borderRadius: '15px',
                  padding: '30px',
                  boxShadow: '0 4px 20px rgba(60, 42, 33, 0.1)',
                  height: '100%',
                  border: '1px solid transparent',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-10px)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(60, 42, 33, 0.2)';
                  e.currentTarget.style.borderColor = '#D4A76A';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(60, 42, 33, 0.1)';
                  e.currentTarget.style.borderColor = 'transparent';
                }}>
                  <div className="d-flex align-items-center mb-3">
                    <img 
                      src={testimonial.avatar}
                      alt="Customer"
                      style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        marginRight: '15px',
                        border: '3px solid #D4A76A'
                      }}
                    />
                    <div>
                      <h5 className="mb-0" style={{ color: '#3C2A21' }}>{testimonial.name}</h5>
                      <div style={{ color: '#D4A76A', display: 'flex', gap: '2px' }}>
                        {[...Array(5)].map((_, i) => <FaStar key={i} size={14} />)}
                      </div>
                    </div>
                  </div>
                  <p style={{ color: '#5C4033', fontStyle: 'italic', lineHeight: '1.6', margin: 0 }}>
                    {testimonial.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="cta-section py-5 mb-5" style={{
        background: 'linear-gradient(135deg, #6F4E37 0%, #C19A6B 100%)',
        borderRadius: '15px',
        color: 'white'
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
                  style={{
                    border: 'none',
                    borderRadius: '25px 0 0 25px',
                    padding: '15px 20px',
                    fontSize: '16px'
                  }}
                />
                <button className="btn btn-light" type="button" style={{
                  borderRadius: '0 25px 25px 0',
                  padding: '15px 30px',
                  fontWeight: '600',
                  background: '#D4A76A',
                  border: 'none',
                  color: 'white',
                  transition: 'all 0.3s ease'
                }}>
                  Đăng ký
                </button>
              </div>
              <small style={{ opacity: '0.8', display: 'block' }}>
                Chúng tôi cam kết không spam. Bạn có thể hủy đăng ký bất cứ lúc nào.
              </small>
            </div>
          </div>
        </div>
      </section>

      {/* ===== STYLESHEET ===== */}
      <style jsx="true">{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        /* Custom scrollbar */
        .featured-products-scroll::-webkit-scrollbar,
        .new-arrivals-scroll::-webkit-scrollbar {
          height: 8px;
        }
        
        .featured-products-scroll::-webkit-scrollbar-track,
        .new-arrivals-scroll::-webkit-scrollbar-track {
          background: #F5E8C7;
          border-radius: 4px;
        }
        
        .featured-products-scroll::-webkit-scrollbar-thumb,
        .new-arrivals-scroll::-webkit-scrollbar-thumb {
          background: #D4A76A;
          border-radius: 4px;
        }
        
        .featured-products-scroll::-webkit-scrollbar-thumb:hover,
        .new-arrivals-scroll::-webkit-scrollbar-thumb:hover {
          background: #8B7355;
        }
        
        /* Hide scrollbar when not scrolling */
        .featured-products-scroll,
        .new-arrivals-scroll {
          scrollbar-width: thin;
          scrollbar-color: transparent transparent;
          transition: scrollbar-color 0.3s ease;
        }
        
        .featured-products-scroll:hover,
        .new-arrivals-scroll:hover {
          scrollbar-color: #D4A76A #F5E8C7;
        }
        
        /* Mobile responsive */
        @media (max-width: 768px) {
          .hero-section .btn {
            width: 100%;
            margin-bottom: 10px;
          }
          
          .featured-products-scroll,
          .new-arrivals-scroll {
            gap: 15px;
            padding: 10px 5px;
          }
          
          .featured-products-scroll > div,
          .new-arrivals-scroll > div {
            min-width: 240px;
          }
          
          .btn[style*="position: absolute"] {
            display: none;
          }
        }
        
        @media (max-width: 576px) {
          .categories-section .col-6 {
            width: 50%;
          }
          
          .testimonials .col-md-4 {
            margin-bottom: 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;