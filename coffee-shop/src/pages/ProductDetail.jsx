import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById } from '../services/productService';
import { toast } from 'react-toastify';
import { 
  FaStar, 
  FaArrowLeft, 
  FaThumbsUp,
  FaUserCircle,
  FaRegStar,
  FaRegThumbsUp,
  FaShoppingCart,
  FaTag,
  FaLeaf,
  FaFire,
  FaShieldAlt,
  FaTruck,
  FaHeart,
  FaFilter,
  FaSort,
  FaPaperPlane,
  FaImage,
  FaSmile,
  FaCheckCircle,
  FaMedal,
  FaCamera,
  FaImages,
  FaExpand,
  FaShareAlt,
  FaBookmark
} from 'react-icons/fa';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [activeReviewImage, setActiveReviewImage] = useState(null);
  
  // State cho reviews
  const [reviews, setReviews] = useState([
    {
      id: 1,
      userName: "Nguyễn Văn A",
      rating: 5,
      comment: "Sản phẩm rất tốt, chất lượng đúng như mô tả. Hương vị thơm ngon đặc trưng của cà phê nguyên chất. Đóng gói cẩn thận, giao hàng nhanh chóng. Tôi rất hài lòng với trải nghiệm mua sắm này!",
      date: "2024-01-15",
      helpfulCount: 125,
      isVerified: true,
      userAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
      images: [
        "https://images.unsplash.com/photo-1511537190424-bbbab87ac5eb?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
      ]
    },
    {
      id: 2,
      userName: "Trần Thị B",
      rating: 4,
      comment: "Tốt nhưng giao hàng hơi chậm. Cà phê có mùi thơm rất đặc biệt, sẽ mua lại. Hương vị đậm đà, thích hợp cho những ai thích cà phê mạnh.",
      date: "2024-01-10",
      helpfulCount: 89,
      isVerified: true,
      userAvatar: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
      id: 3,
      userName: "Lê Văn C",
      rating: 5,
      comment: "Rất hài lòng, đóng gói cẩn thận, chất lượng tuyệt vời. Hương vị đậm đà khó quên. Đã giới thiệu cho nhiều bạn bè và họ đều phản hồi tích cực!",
      date: "2024-01-05",
      helpfulCount: 156,
      isVerified: false,
      userAvatar: "https://randomuser.me/api/portraits/men/67.jpg",
      images: ["https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"]
    },
    {
      id: 4,
      userName: "Phạm Thị D",
      rating: 4,
      comment: "Cà phê thơm ngon, giá cả hợp lý. Giao hàng đúng hẹn, nhân viên nhiệt tình. Sẽ tiếp tục ủng hộ cửa hàng trong thời gian tới.",
      date: "2024-01-02",
      helpfulCount: 45,
      isVerified: true,
      userAvatar: "https://randomuser.me/api/portraits/women/65.jpg"
    },
    {
      id: 5,
      userName: "Hoàng Văn E",
      rating: 5,
      comment: "Sản phẩm xuất sắc! Hương vị chuẩn phong cách cà phê Việt. Đã giới thiệu cho bạn bè và ai cũng khen ngợi.",
      date: "2023-12-28",
      helpfulCount: 210,
      isVerified: true,
      userAvatar: "https://randomuser.me/api/portraits/men/75.jpg",
      images: [
        "https://images.unsplash.com/photo-1510707577719-ae7c9b788690?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
      ]
    },
    {
      id: 6,
      userName: "Lê Thị F",
      rating: 3,
      comment: "Cà phê ổn, không quá đặc biệt. Giao hàng nhanh nhưng giá hơi cao so với chất lượng.",
      date: "2023-12-20",
      helpfulCount: 32,
      isVerified: true,
      userAvatar: "https://randomuser.me/api/portraits/women/22.jpg"
    }
  ]);
  
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: '',
    name: '',
    email: ''
  });
  
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewFilter, setReviewFilter] = useState('all');
  const [reviewSort, setReviewSort] = useState('newest');
  const [averageRating, setAverageRating] = useState(4.7);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedReviewImage, setSelectedReviewImage] = useState(null);

  const productImages = [
    product?.image || "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1511537190424-bbbab87ac5eb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1510707577719-ae7c9b788690?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  ];

  useEffect(() => {
    loadProduct();
    
    if (reviews.length > 0) {
      const avg = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
      setAverageRating(parseFloat(avg.toFixed(1)));
    }
  }, [id]);

  const loadProduct = async () => {
    try {
      const data = await getProductById(id);
      setProduct(data);
    } catch (error) {
      toast.error('Không tìm thấy sản phẩm');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItemIndex = cart.findIndex(item => item.id === product.id);
    
    if (existingItemIndex >= 0) {
      cart[existingItemIndex].quantity += quantity;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: quantity
      });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    toast.success('Đã thêm vào giỏ hàng!');
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const handleSubmitReview = () => {
    if (!newReview.name.trim() || !newReview.comment.trim()) {
      toast.error('Vui lòng nhập tên và nội dung đánh giá');
      return;
    }

    const review = {
      id: reviews.length + 1,
      userName: newReview.name,
      rating: newReview.rating,
      comment: newReview.comment,
      date: new Date().toISOString().split('T')[0],
      helpfulCount: 0,
      isVerified: false,
      userAvatar: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 100)}.jpg`
    };

    const updatedReviews = [review, ...reviews];
    setReviews(updatedReviews);
    
    const newAvg = updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length;
    setAverageRating(parseFloat(newAvg.toFixed(1)));
    
    setNewReview({
      rating: 5,
      comment: '',
      name: '',
      email: ''
    });
    setShowReviewForm(false);
    
    toast.success('Cảm ơn đánh giá của bạn!');
  };

  const handleHelpfulClick = (reviewId) => {
    setReviews(reviews.map(review => 
      review.id === reviewId 
        ? { ...review, helpfulCount: review.helpfulCount + 1 }
        : review
    ));
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const renderStars = (rating, size = 'sm') => {
    const starSize = size === 'lg' ? 24 : 16;
    const stars = [];
    
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(
          <FaStar 
            key={i}
            size={starSize}
            style={{ 
              color: '#FFD700',
              marginRight: '4px',
              filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.2))'
            }}
          />
        );
      } else if (i - 0.5 <= rating) {
        stars.push(
          <div key={i} style={{ position: 'relative', display: 'inline-block' }}>
            <FaRegStar 
              size={starSize}
              style={{ 
                color: '#CCCCCC',
                marginRight: '4px'
              }}
            />
            <div style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: '50%',
              height: '100%',
              overflow: 'hidden'
            }}>
              <FaStar 
                size={starSize}
                style={{ 
                  color: '#FFD700',
                  marginRight: '4px'
                }}
              />
            </div>
          </div>
        );
      } else {
        stars.push(
          <FaRegStar 
            key={i}
            size={starSize}
            style={{ 
              color: '#CCCCCC',
              marginRight: '4px'
            }}
          />
        );
      }
    }
    
    return <div style={{ display: 'flex', alignItems: 'center' }}>{stars}</div>;
  };

  // Lọc và sắp xếp reviews
  const filteredReviews = reviews.filter(review => {
    if (reviewFilter === 'all') return true;
    return Math.floor(review.rating) === parseInt(reviewFilter);
  });

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    switch(reviewSort) {
      case 'newest':
        return new Date(b.date) - new Date(a.date);
      case 'helpful':
        return b.helpfulCount - a.helpfulCount;
      case 'highest':
        return b.rating - a.rating;
      case 'lowest':
        return a.rating - b.rating;
      default:
        return new Date(b.date) - new Date(a.date);
    }
  });

  const displayedReviews = showAllReviews ? sortedReviews : sortedReviews.slice(0, 6);

  // Tính phân phối rating
  const ratingDistribution = [5, 4, 3, 2, 1].map(star => {
    const count = reviews.filter(r => Math.floor(r.rating) === star).length;
    const percentage = reviews.length > 0 ? (count / reviews.length * 100) : 0;
    return { star, count, percentage };
  });

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: '#FFFCF8',
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '4px solid #F5E8C7',
          borderTop: '4px solid #D4A76A',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: '#FFFCF8',
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
        padding: '20px'
      }}>
        <h1 style={{ color: '#3C2A21', marginBottom: '20px' }}>Sản phẩm không tồn tại</h1>
        <button 
          onClick={() => navigate('/products')}
          style={{
            background: '#D4A76A',
            color: 'white',
            border: 'none',
            borderRadius: '25px',
            padding: '12px 30px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          Quay lại trang sản phẩm
        </button>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#FFFCF8',
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          style={{
            background: 'white',
            border: '2px solid #D4A76A',
            color: '#D4A76A',
            borderRadius: '30px',
            padding: '10px 25px',
            fontWeight: '600',
            transition: 'all 0.3s ease',
            display: 'inline-flex',
            alignItems: 'center',
            marginBottom: '30px',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#D4A76A';
            e.currentTarget.style.color = 'white';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 5px 15px rgba(212, 167, 106, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'white';
            e.currentTarget.style.color = '#D4A76A';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <FaArrowLeft style={{ marginRight: '8px' }} />
          Quay lại
        </button>

        {/* ========== PHẦN SẢN PHẨM ========== */}
        <div style={{ 
          background: 'white',
          borderRadius: '20px',
          boxShadow: '0 10px 30px rgba(60, 42, 33, 0.1)',
          padding: '30px',
          marginBottom: '40px',
          border: '1px solid #F5E8C7'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
            {/* Product Images */}
            <div>
              <div style={{
                borderRadius: '15px',
                overflow: 'hidden',
                boxShadow: '0 10px 30px rgba(60, 42, 33, 0.2)',
                marginBottom: '20px',
                position: 'relative'
              }}>
                <img
                  src={productImages[selectedImageIndex]}
                  alt={product.name}
                  style={{ 
                    width: '100%',
                    height: '400px',
                    objectFit: 'cover',
                    transition: 'transform 0.4s ease'
                  }}
                />
                <button
                  onClick={() => window.open(productImages[selectedImageIndex], '_blank')}
                  style={{
                    position: 'absolute',
                    top: '15px',
                    right: '15px',
                    background: 'rgba(255, 255, 255, 0.9)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                  }}
                >
                  <FaExpand size={18} style={{ color: '#3C2A21' }} />
                </button>
              </div>
              
              {/* Thumbnail Gallery */}
              <div style={{ display: 'flex', gap: '12px' }}>
                {productImages.map((img, index) => (
                  <div
                    key={index}
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '10px',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      border: selectedImageIndex === index ? '3px solid #D4A76A' : '2px solid #F5E8C7',
                      transition: 'all 0.3s ease',
                      position: 'relative'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-5px)';
                      e.currentTarget.style.boxShadow = '0 5px 15px rgba(0,0,0,0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                    onClick={() => setSelectedImageIndex(index)}
                  >
                    <img
                      src={img}
                      alt={`${product.name} ${index + 1}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Product Features */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', marginTop: '25px' }}>
                {[
                  { icon: <FaLeaf />, color: '#198754', title: '100% tự nhiên' },
                  { icon: <FaFire />, color: '#fd7e14', title: 'Rang mới' },
                  { icon: <FaShieldAlt />, color: '#0d6efd', title: 'Chất lượng' },
                  { icon: <FaTruck />, color: '#6f42c1', title: 'Giao nhanh' }
                ].map((feature, index) => (
                  <div key={index} style={{
                    background: 'white',
                    border: '1px solid #F5E8C7',
                    borderRadius: '10px',
                    padding: '15px',
                    textAlign: 'center',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}>
                    <div style={{
                      width: '35px',
                      height: '35px',
                      background: `linear-gradient(135deg, ${feature.color}, ${feature.color}99)`,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 8px',
                      color: 'white',
                      fontSize: '16px'
                    }}>
                      {feature.icon}
                    </div>
                    <div style={{ fontSize: '12px', fontWeight: '600', color: '#3C2A21' }}>
                      {feature.title}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div style={{ flex: 1 }}>
                  <h1 style={{ 
                    color: '#3C2A21',
                    fontFamily: '"Georgia", serif',
                    marginBottom: '10px',
                    fontSize: '32px',
                    fontWeight: '700',
                    lineHeight: '1.3'
                  }}>
                    {product.name}
                  </h1>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <span style={{
                      background: '#28a745',
                      color: 'white',
                      padding: '6px 15px',
                      borderRadius: '20px',
                      fontSize: '14px',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      <FaTag style={{ marginRight: '6px', fontSize: '12px' }} />
                      {product.category}
                    </span>
                    <span style={{
                      background: '#dc3545',
                      color: 'white',
                      padding: '6px 15px',
                      borderRadius: '20px',
                      fontSize: '14px',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      <FaFire style={{ marginRight: '6px', fontSize: '12px' }} />
                      Bán chạy nhất
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => setIsFavorite(!isFavorite)}
                    style={{
                      background: isFavorite ? '#D4A76A' : 'white',
                      border: `2px solid ${isFavorite ? '#D4A76A' : '#F5E8C7'}`,
                      color: isFavorite ? 'white' : '#D4A76A',
                      borderRadius: '50%',
                      width: '45px',
                      height: '45px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      flexShrink: 0
                    }}
                    onMouseEnter={(e) => {
                      if (!isFavorite) {
                        e.currentTarget.style.transform = 'scale(1.1)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isFavorite) {
                        e.currentTarget.style.transform = 'scale(1)';
                      }
                    }}
                  >
                    <FaHeart size={18} />
                  </button>
                  <button
                    onClick={() => {/* Share functionality */}}
                    style={{
                      background: 'white',
                      border: '2px solid #F5E8C7',
                      color: '#3C2A21',
                      borderRadius: '50%',
                      width: '45px',
                      height: '45px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer'
                    }}
                  >
                    <FaShareAlt size={18} />
                  </button>
                </div>
              </div>

              {/* Rating and Price */}
              <div style={{ 
                paddingBottom: '20px',
                borderBottom: '1px solid #F5E8C7',
                marginBottom: '20px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginRight: '15px' }}>
                    {renderStars(averageRating, 'lg')}
                  </div>
                  <div>
                    <span style={{ 
                      fontSize: '28px', 
                      fontWeight: '700', 
                      color: '#D4A76A',
                      marginRight: '8px'
                    }}>
                      {averageRating.toFixed(1)}
                    </span>
                    <span style={{ 
                      fontSize: '16px', 
                      color: '#8B7355'
                    }}>
                      /5 ({reviews.length} đánh giá)
                    </span>
                  </div>
                </div>

                <div style={{ marginBottom: '10px' }}>
                  <span style={{
                    color: '#dc3545',
                    fontWeight: '700',
                    fontSize: '36px',
                    textShadow: '1px 1px 3px rgba(0,0,0,0.1)'
                  }}>
                    {formatPrice(product.price)}
                  </span>
                  <span style={{
                    background: '#dc3545',
                    color: 'white',
                    padding: '6px 12px',
                    borderRadius: '15px',
                    fontSize: '14px',
                    fontWeight: '600',
                    marginLeft: '15px'
                  }}>
                    -20%
                  </span>
                </div>
                <div style={{ 
                  color: '#8B7355', 
                  textDecoration: 'line-through', 
                  fontSize: '18px',
                  marginBottom: '5px'
                }}>
                  {formatPrice(product.price * 1.25)}
                </div>
                <div style={{ color: '#198754', fontSize: '14px', fontWeight: '600' }}>
                  ⚡ Còn hàng - Giao ngay trong 2 giờ
                </div>
              </div>

              {/* Description */}
              <div style={{ marginBottom: '30px' }}>
                <h5 style={{ 
                  color: '#3C2A21',
                  position: 'relative',
                  paddingBottom: '10px',
                  marginBottom: '15px',
                  fontSize: '20px',
                  fontWeight: '600'
                }}>
                  Mô tả sản phẩm
                  <span style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '50px',
                    height: '3px',
                    background: '#D4A76A',
                    borderRadius: '2px'
                  }}></span>
                </h5>
                <p style={{ 
                  color: '#5C4033', 
                  lineHeight: '1.8',
                  fontSize: '16px',
                  margin: 0
                }}>
                  {product.description}
                </p>
              </div>

              {/* Specifications */}
              <div style={{ marginBottom: '30px' }}>
                <h5 style={{ 
                  color: '#3C2A21',
                  position: 'relative',
                  paddingBottom: '10px',
                  marginBottom: '15px',
                  fontSize: '20px',
                  fontWeight: '600'
                }}>
                  Thông số kỹ thuật
                  <span style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '50px',
                    height: '3px',
                    background: '#D4A76A',
                    borderRadius: '2px'
                  }}></span>
                </h5>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                  {[
                    { label: 'Xuất xứ', value: 'Việt Nam' },
                    { label: 'Trọng lượng', value: '500g' },
                    { label: 'Hạn sử dụng', value: '12 tháng' },
                    { label: 'Độ ẩm', value: '< 12%' },
                    { label: 'Tỉ lệ tạp chất', value: '< 1%' },
                    { label: 'Đóng gói', value: 'Hút chân không' }
                  ].map((spec, index) => (
                    <div key={index} style={{
                      background: '#FFF8F0',
                      padding: '12px 15px',
                      borderRadius: '8px'
                    }}>
                      <span style={{ color: '#5C4033', fontWeight: '500' }}>
                        {spec.label}:
                      </span>
                      <span style={{ color: '#3C2A21', marginLeft: '10px', fontWeight: '600' }}>
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quantity and Actions */}
              <div>
                <div style={{ marginBottom: '25px' }}>
                  <div style={{ 
                    color: '#3C2A21', 
                    fontWeight: '600',
                    marginBottom: '12px',
                    fontSize: '16px'
                  }}>
                    Số lượng
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', maxWidth: '200px' }}>
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      style={{
                        background: 'white',
                        border: '2px solid #D4A76A',
                        color: '#D4A76A',
                        borderRadius: '10px 0 0 10px',
                        width: '50px',
                        height: '50px',
                        fontSize: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#D4A76A';
                        e.currentTarget.style.color = 'white';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'white';
                        e.currentTarget.style.color = '#D4A76A';
                      }}
                    >
                      -
                    </button>
                    <div style={{
                      flex: 1,
                      height: '50px',
                      background: '#FFF8F0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderTop: '2px solid #F5E8C7',
                      borderBottom: '2px solid #F5E8C7'
                    }}>
                      <span style={{ 
                        fontSize: '20px', 
                        fontWeight: '600', 
                        color: '#3C2A21'
                      }}>
                        {quantity}
                      </span>
                    </div>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      style={{
                        background: 'white',
                        border: '2px solid #D4A76A',
                        color: '#D4A76A',
                        borderRadius: '0 10px 10px 0',
                        width: '50px',
                        height: '50px',
                        fontSize: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#D4A76A';
                        e.currentTarget.style.color = 'white';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'white';
                        e.currentTarget.style.color = '#D4A76A';
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '15px' }}>
                  <button
                    onClick={handleAddToCart}
                    style={{
                      flex: 1,
                      background: 'linear-gradient(135deg, #D4A76A, #8B7355)',
                      border: 'none',
                      borderRadius: '30px',
                      padding: '18px',
                      color: 'white',
                      fontWeight: '600',
                      fontSize: '18px',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '10px',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-3px)';
                      e.currentTarget.style.boxShadow = '0 10px 25px rgba(212, 167, 106, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <FaShoppingCart />
                    Thêm vào giỏ hàng
                  </button>
                  <button
                    onClick={() => {
                      handleAddToCart();
                      navigate('/cart');
                    }}
                    style={{
                      flex: 1,
                      background: 'linear-gradient(135deg, #28a745, #20c997)',
                      border: 'none',
                      borderRadius: '30px',
                      padding: '18px',
                      color: 'white',
                      fontWeight: '600',
                      fontSize: '18px',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-3px)';
                      e.currentTarget.style.boxShadow = '0 10px 25px rgba(40, 167, 69, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    Mua ngay
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========== PHẦN ĐÁNH GIÁ (FULL WIDTH) ========== */}
        <div style={{ 
          background: 'white',
          borderRadius: '20px',
          boxShadow: '0 10px 30px rgba(60, 42, 33, 0.1)',
          padding: '40px',
          border: '1px solid #F5E8C7',
          marginBottom: '40px'
        }}>
          {/* Reviews Header */}
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', marginBottom: '20px' }}>
              <div style={{
                width: '60px',
                height: '60px',
                background: 'linear-gradient(135deg, #D4A76A, #8B7355)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '24px'
              }}>
                <FaStar />
              </div>
              <h2 style={{ 
                color: '#3C2A21',
                fontSize: '36px',
                fontWeight: '700',
                margin: 0
              }}>
                Đánh giá sản phẩm
              </h2>
            </div>
            <p style={{ 
              color: '#8B7355',
              fontSize: '18px',
              maxWidth: '600px',
              margin: '0 auto 30px'
            }}>
              {reviews.length} đánh giá từ khách hàng đã sử dụng {product.name}
            </p>
            
            <button 
              onClick={() => setShowReviewForm(!showReviewForm)}
              style={{
                background: showReviewForm ? '#6c757d' : '#D4A76A',
                border: 'none',
                borderRadius: '30px',
                padding: '16px 40px',
                color: 'white',
                fontWeight: '600',
                fontSize: '18px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                margin: '0 auto',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 5px 15px rgba(0,0,0,0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {showReviewForm ? '✕ Hủy viết đánh giá' : '✏️ Viết đánh giá của bạn'}
            </button>
          </div>

          {/* Review Form */}
          {showReviewForm && (
            <div style={{
              background: '#FFF8F0',
              borderRadius: '20px',
              border: '2px dashed #D4A76A',
              padding: '40px',
              marginBottom: '50px'
            }}>
              <h3 style={{ 
                color: '#3C2A21', 
                fontSize: '28px',
                fontWeight: '700',
                marginBottom: '30px',
                textAlign: 'center'
              }}>
                Chia sẻ trải nghiệm của bạn
              </h3>
              
              {/* Star Rating */}
              <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <div style={{ 
                  color: '#5C4033',
                  fontWeight: '600',
                  marginBottom: '20px',
                  fontSize: '20px'
                }}>
                  Bạn đánh giá bao nhiêu sao? *
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '15px' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setNewReview({...newReview, rating: star})}
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: 0,
                        cursor: 'pointer',
                        transition: 'transform 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    >
                      {star <= newReview.rating ? (
                        <FaStar size={48} style={{ color: '#FFD700' }} />
                      ) : (
                        <FaRegStar size={48} style={{ color: '#CCCCCC' }} />
                      )}
                    </button>
                  ))}
                </div>
                <div style={{ 
                  color: '#8B7355', 
                  fontSize: '18px'
                }}>
                  Đã chọn: <strong style={{ color: '#D4A76A', fontSize: '24px' }}>{newReview.rating}</strong> sao
                </div>
              </div>

              {/* Name and Email */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: '25px',
                marginBottom: '30px'
              }}>
                <div>
                  <label style={{ 
                    color: '#5C4033',
                    fontWeight: '600',
                    marginBottom: '12px',
                    display: 'block',
                    fontSize: '16px'
                  }}>
                    Tên của bạn *
                  </label>
                  <input
                    type="text"
                    value={newReview.name}
                    onChange={(e) => setNewReview({...newReview, name: e.target.value})}
                    required
                    placeholder="Nhập tên của bạn"
                    style={{
                      width: '100%',
                      border: '2px solid #F5E8C7',
                      borderRadius: '12px',
                      padding: '16px 20px',
                      background: 'white',
                      fontSize: '16px',
                      boxSizing: 'border-box',
                      transition: 'all 0.3s ease'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#D4A76A';
                      e.target.style.boxShadow = '0 0 0 3px rgba(212, 167, 106, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#F5E8C7';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
                <div>
                  <label style={{ 
                    color: '#5C4033',
                    fontWeight: '600',
                    marginBottom: '12px',
                    display: 'block',
                    fontSize: '16px'
                  }}>
                    Email (tuỳ chọn)
                  </label>
                  <input
                    type="email"
                    value={newReview.email}
                    onChange={(e) => setNewReview({...newReview, email: e.target.value})}
                    placeholder="email@example.com"
                    style={{
                      width: '100%',
                      border: '2px solid #F5E8C7',
                      borderRadius: '12px',
                      padding: '16px 20px',
                      background: 'white',
                      fontSize: '16px',
                      boxSizing: 'border-box',
                      transition: 'all 0.3s ease'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#D4A76A';
                      e.target.style.boxShadow = '0 0 0 3px rgba(212, 167, 106, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#F5E8C7';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
              </div>

              {/* Comment */}
              <div style={{ marginBottom: '30px' }}>
                <label style={{ 
                  color: '#5C4033',
                  fontWeight: '600',
                  marginBottom: '12px',
                  display: 'block',
                  fontSize: '16px'
                }}>
                  Nội dung đánh giá *
                </label>
                <textarea
                  value={newReview.comment}
                  onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                  required
                  placeholder="Chia sẻ chi tiết trải nghiệm của bạn về sản phẩm..."
                  rows="6"
                  style={{
                    width: '100%',
                    border: '2px solid #F5E8C7',
                    borderRadius: '12px',
                    padding: '20px',
                    background: 'white',
                    fontSize: '16px',
                    resize: 'vertical',
                    boxSizing: 'border-box',
                    transition: 'all 0.3s ease',
                    lineHeight: '1.6'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#D4A76A';
                    e.target.style.boxShadow = '0 0 0 3px rgba(212, 167, 106, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#F5E8C7';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '15px' }}>
                  <button
                    style={{
                      background: 'white',
                      border: '2px solid #F5E8C7',
                      borderRadius: '25px',
                      padding: '12px 25px',
                      color: '#5C4033',
                      fontWeight: '600',
                      fontSize: '15px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#D4A76A';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#F5E8C7';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <FaImage />
                    Thêm ảnh
                  </button>
                  <button
                    style={{
                      background: 'white',
                      border: '2px solid #F5E8C7',
                      borderRadius: '25px',
                      padding: '12px 25px',
                      color: '#5C4033',
                      fontWeight: '600',
                      fontSize: '15px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#D4A76A';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#F5E8C7';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <FaSmile />
                    Thêm biểu cảm
                  </button>
                </div>
                <button
                  onClick={handleSubmitReview}
                  style={{
                    background: 'linear-gradient(135deg, #D4A76A, #8B7355)',
                    border: 'none',
                    borderRadius: '30px',
                    padding: '16px 50px',
                    color: 'white',
                    fontWeight: '600',
                    fontSize: '18px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(212, 167, 106, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <FaPaperPlane />
                  Gửi đánh giá
                </button>
              </div>
            </div>
          )}

          {/* Rating Stats and Filters */}
          <div style={{
            background: '#FFF8F0',
            borderRadius: '20px',
            padding: '30px',
            marginBottom: '40px',
            border: '1px solid #F5E8C7'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '40px' }}>
              {/* Overall Rating */}
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  fontSize: '64px', 
                  fontWeight: '800', 
                  color: '#D4A76A',
                  lineHeight: '1',
                  marginBottom: '10px'
                }}>
                  {averageRating.toFixed(1)}
                </div>
                <div style={{ margin: '20px 0' }}>
                  {renderStars(averageRating, 'lg')}
                </div>
                <div style={{ 
                  color: '#8B7355',
                  fontSize: '16px',
                  marginBottom: '5px'
                }}>
                  {reviews.length} đánh giá
                </div>
                <div style={{ 
                  color: '#28a745',
                  fontSize: '14px',
                  fontWeight: '600'
                }}>
                  <FaMedal style={{ marginRight: '5px' }} />
                  4.8/5 - Rất tốt
                </div>
              </div>

              {/* Rating Distribution */}
              <div>
                <h3 style={{ 
                  color: '#3C2A21', 
                  marginBottom: '25px',
                  fontSize: '22px',
                  fontWeight: '700'
                }}>
                  Phân phối đánh giá
                </h3>
                {ratingDistribution.map(({ star, count, percentage }) => (
                  <div key={star} style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    marginBottom: '15px'
                  }}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      width: '80px',
                      fontSize: '16px',
                      color: '#5C4033',
                      fontWeight: '500'
                    }}>
                      <span style={{ marginRight: '8px' }}>{star} sao</span>
                      {renderStars(star, 'sm')}
                    </div>
                    <div style={{ flex: 1, margin: '0 20px' }}>
                      <div style={{ 
                        height: '12px',
                        background: '#F5E8C7',
                        borderRadius: '6px',
                        overflow: 'hidden',
                        position: 'relative'
                      }}>
                        <div 
                          style={{ 
                            height: '100%',
                            background: 'linear-gradient(135deg, #D4A76A, #8B7355)',
                            width: `${percentage}%`,
                            borderRadius: '6px',
                            transition: 'width 1s ease'
                          }}
                        ></div>
                      </div>
                    </div>
                    <div style={{ 
                      color: '#8B7355', 
                      width: '60px', 
                      textAlign: 'right',
                      fontWeight: '600',
                      fontSize: '16px'
                    }}>
                      {count}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Filters and Sort */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginTop: '30px',
              paddingTop: '20px',
              borderTop: '1px solid #F5E8C7'
            }}>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => setReviewFilter('all')}
                  style={{
                    background: reviewFilter === 'all' ? '#D4A76A' : 'white',
                    border: `2px solid ${reviewFilter === 'all' ? '#D4A76A' : '#F5E8C7'}`,
                    color: reviewFilter === 'all' ? 'white' : '#5C4033',
                    borderRadius: '25px',
                    padding: '10px 20px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (reviewFilter !== 'all') {
                      e.currentTarget.style.borderColor = '#D4A76A';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (reviewFilter !== 'all') {
                      e.currentTarget.style.borderColor = '#F5E8C7';
                    }
                  }}
                >
                  <FaFilter />
                  Tất cả ({reviews.length})
                </button>
                {[5, 4, 3, 2, 1].map(rating => (
                  <button
                    key={rating}
                    onClick={() => setReviewFilter(rating.toString())}
                    style={{
                      background: reviewFilter === rating.toString() ? '#D4A76A' : 'white',
                      border: `2px solid ${reviewFilter === rating.toString() ? '#D4A76A' : '#F5E8C7'}`,
                      color: reviewFilter === rating.toString() ? 'white' : '#5C4033',
                      borderRadius: '25px',
                      padding: '10px 20px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (reviewFilter !== rating.toString()) {
                        e.currentTarget.style.borderColor = '#D4A76A';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (reviewFilter !== rating.toString()) {
                        e.currentTarget.style.borderColor = '#F5E8C7';
                      }
                    }}
                  >
                    {renderStars(rating, 'sm')}
                    {rating} sao ({reviews.filter(r => Math.floor(r.rating) === rating).length})
                  </button>
                ))}
              </div>
              <div style={{ position: 'relative' }}>
                <select
                  value={reviewSort}
                  onChange={(e) => setReviewSort(e.target.value)}
                  style={{
                    padding: '12px 45px 12px 20px',
                    border: '2px solid #F5E8C7',
                    borderRadius: '25px',
                    background: 'white',
                    color: '#5C4033',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    appearance: 'none',
                    minWidth: '180px'
                  }}
                >
                  <option value="newest">Mới nhất</option>
                  <option value="helpful">Hữu ích nhất</option>
                  <option value="highest">Đánh giá cao nhất</option>
                  <option value="lowest">Đánh giá thấp nhất</option>
                </select>
                <FaSort style={{
                  position: 'absolute',
                  right: '20px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#8B7355',
                  pointerEvents: 'none'
                }} />
              </div>
            </div>
          </div>

          {/* Reviews Grid */}
          <div>
            <h3 style={{ 
              color: '#3C2A21',
              fontSize: '28px',
              fontWeight: '700',
              marginBottom: '30px',
              textAlign: 'center'
            }}>
              Đánh giá từ khách hàng ({filteredReviews.length})
            </h3>
            
            {filteredReviews.length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '60px 0',
                color: '#8B7355',
                background: '#FFF8F0',
                borderRadius: '15px',
                border: '2px dashed #F5E8C7'
              }}>
                <FaStar size={64} style={{ color: '#F5E8C7', marginBottom: '20px' }} />
                <p style={{ fontSize: '20px', marginBottom: '10px', fontWeight: '600' }}>
                  Chưa có đánh giá phù hợp
                </p>
                <p style={{ fontSize: '16px', margin: 0, maxWidth: '500px', margin: '0 auto' }}>
                  Hãy thử chọn bộ lọc khác hoặc trở thành người đầu tiên đánh giá sản phẩm này!
                </p>
              </div>
            ) : (
              <>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
                  gap: '25px',
                  marginBottom: '40px'
                }}>
                  {displayedReviews.map((review) => (
                    <div key={review.id} style={{
                      background: 'white',
                      borderRadius: '15px',
                      border: '1px solid #F5E8C7',
                      padding: '25px',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 15px rgba(60, 42, 33, 0.08)',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-8px)';
                      e.currentTarget.style.boxShadow = '0 15px 30px rgba(60, 42, 33, 0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 15px rgba(60, 42, 33, 0.08)';
                    }}>
                      {/* Verified Badge */}
                      {review.isVerified && (
                        <div style={{
                          position: 'absolute',
                          top: '20px',
                          right: '20px',
                          background: '#198754',
                          color: 'white',
                          padding: '5px 12px',
                          borderRadius: '15px',
                          fontSize: '12px',
                          fontWeight: '600',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                          zIndex: 2
                        }}>
                          <FaCheckCircle />
                          Đã mua hàng
                        </div>
                      )}

                      {/* User Info */}
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                        <img
                          src={review.userAvatar}
                          alt={review.userName}
                          style={{
                            width: '60px',
                            height: '60px',
                            borderRadius: '50%',
                            marginRight: '15px',
                            border: '3px solid #F5E8C7',
                            objectFit: 'cover'
                          }}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ 
                            color: '#3C2A21', 
                            fontWeight: '600',
                            fontSize: '18px',
                            marginBottom: '5px'
                          }}>
                            {review.userName}
                          </div>
                          <div style={{ marginBottom: '8px' }}>
                            {renderStars(review.rating)}
                          </div>
                          <div style={{ 
                            color: '#8B7355', 
                            fontSize: '14px'
                          }}>
                            {formatDate(review.date)}
                          </div>
                        </div>
                      </div>
                      
                      {/* Comment */}
                      <p style={{ 
                        color: '#5C4033', 
                        lineHeight: '1.6',
                        fontSize: '15px',
                        marginBottom: '20px',
                        minHeight: '80px'
                      }}>
                        {review.comment}
                      </p>
                      
                      {/* Review Images */}
                      {review.images && review.images.length > 0 && (
                        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
                          {review.images.map((img, index) => (
                            <div key={index} style={{ position: 'relative' }}>
                              <img
                                src={img}
                                alt={`Review ${index + 1}`}
                                style={{
                                  width: '80px',
                                  height: '80px',
                                  borderRadius: '8px',
                                  objectFit: 'cover',
                                  cursor: 'pointer',
                                  transition: 'transform 0.3s ease'
                                }}
                                onClick={() => {
                                  setSelectedReviewImage(img);
                                  setShowImageModal(true);
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.transform = 'scale(1.05)';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.transform = 'scale(1)';
                                }}
                              />
                              <button
                                onClick={() => window.open(img, '_blank')}
                                style={{
                                  position: 'absolute',
                                  top: '5px',
                                  right: '5px',
                                  background: 'rgba(255, 255, 255, 0.9)',
                                  border: 'none',
                                  borderRadius: '4px',
                                  width: '25px',
                                  height: '25px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  cursor: 'pointer',
                                  fontSize: '12px',
                                  color: '#3C2A21'
                                }}
                              >
                                <FaExpand />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {/* Helpful Button */}
                      <button
                        onClick={() => handleHelpfulClick(review.id)}
                        style={{
                          background: 'white',
                          border: '2px solid #D4A76A',
                          color: '#D4A76A',
                          borderRadius: '25px',
                          padding: '10px 20px',
                          fontWeight: '600',
                          transition: 'all 0.3s ease',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          cursor: 'pointer',
                          fontSize: '14px'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#D4A76A';
                          e.currentTarget.style.color = 'white';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'white';
                          e.currentTarget.style.color = '#D4A76A';
                        }}
                      >
                        <FaThumbsUp />
                        Hữu ích ({review.helpfulCount})
                      </button>
                    </div>
                  ))}
                </div>

                {/* Load More Button */}
                {sortedReviews.length > 6 && (
                  <div style={{ textAlign: 'center' }}>
                    <button 
                      onClick={() => setShowAllReviews(!showAllReviews)}
                      style={{
                        background: 'white',
                        border: '3px solid #D4A76A',
                        color: '#D4A76A',
                        borderRadius: '30px',
                        padding: '15px 50px',
                        fontWeight: '600',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                        fontSize: '18px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '12px'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#D4A76A';
                        e.currentTarget.style.color = 'white';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 5px 15px rgba(212, 167, 106, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'white';
                        e.currentTarget.style.color = '#D4A76A';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      {showAllReviews ? (
                        <>
                          <span>Ẩn bớt đánh giá</span>
                        </>
                      ) : (
                        <>
                          <span>Xem thêm {sortedReviews.length - 6} đánh giá</span>
                          <FaArrowLeft style={{ transform: 'rotate(-90deg)' }} />
                        </>
                      )}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {showImageModal && selectedReviewImage && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.9)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}
        onClick={() => setShowImageModal(false)}>
          <div style={{
            position: 'relative',
            maxWidth: '90%',
            maxHeight: '90%'
          }}
          onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedReviewImage}
              alt="Review"
              style={{
                maxWidth: '100%',
                maxHeight: '80vh',
                borderRadius: '10px'
              }}
            />
            <button
              onClick={() => setShowImageModal(false)}
              style={{
                position: 'absolute',
                top: '-40px',
                right: '0',
                background: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '35px',
                height: '35px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '20px',
                color: '#3C2A21'
              }}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Global Styles */}
      <style jsx="true">{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 1024px) {
          .product-container {
            grid-template-columns: 1fr !important;
            gap: 30px;
          }
          
          .review-stats {
            grid-template-columns: 1fr !important;
            gap: 30px;
          }
          
          .review-form-grid {
            grid-template-columns: 1fr !important;
            gap: 20px;
          }
          
          .reviews-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }

        @media (max-width: 768px) {
          .review-filters {
            flex-direction: column;
            gap: 15px;
          }
          
          .review-filters > div:first-child {
            width: 100%;
            overflow-x: auto;
            padding-bottom: 10px;
          }
          
          .review-actions {
            flex-direction: column;
            gap: 20px;
          }
          
          .review-actions > div {
            width: 100%;
          }
          
          .reviews-grid {
            grid-template-columns: 1fr !important;
          }
          
          .product-features {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          
          .product-specs {
            grid-template-columns: 1fr !important;
          }
        }

        @media (max-width: 480px) {
          h1 {
            font-size: 24px !important;
          }
          
          h2 {
            font-size: 28px !important;
          }
          
          h3 {
            font-size: 22px !important;
          }
          
          .product-info {
            padding: 20px !important;
          }
          
          .reviews-section {
            padding: 25px !important;
          }
          
          .rating-filter-buttons {
            flex-direction: column;
            align-items: stretch;
          }
          
          .rating-filter-buttons button {
            width: 100%;
            justify-content: center;
          }
          
          .thumbnail-gallery img {
            width: 60px;
            height: 60px;
          }
        }

        /* Custom Scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #F5E8C7;
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb {
          background: #D4A76A;
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #8B7355;
        }
      `}</style>
    </div>
  );
};

export default ProductDetail;