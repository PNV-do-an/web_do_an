import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { getProducts } from '../services/productService';
import { toast } from 'react-toastify';
import { 
  FaFilter, 
  FaSearch,
  FaTimes,
  FaFire,
  FaStar,
  FaTag,
  FaLeaf,
  FaTruck,
  FaShieldAlt,
  FaChevronDown,
  FaChevronRight,
  FaSlidersH,
  FaWindowClose,
  FaSortAmountDown,
  FaSortAmountUp,
  FaBolt,
  FaPercent,
  FaGem
} from 'react-icons/fa';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([
    'Tất cả', 'Cà phê truyền thống', 'Cà phê máy', 'Trà', 'Nước ép'
  ]);
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  
  // State mới cho filter nâng cao
  const [priceRange, setPriceRange] = useState({ min: 0, max: 500000 });
  const [sortBy, setSortBy] = useState('default');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [selectedCategory, products, priceRange, sortBy, searchTerm]);

  const loadProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
      setFilteredProducts(data);
      
      // Extract categories từ products
      const extractedCategories = ['Tất cả'];
      data.forEach(product => {
        if (!extractedCategories.includes(product.category)) {
          extractedCategories.push(product.category);
        }
      });
      setCategories(extractedCategories);
      
    } catch (error) {
      toast.error('Lỗi tải sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = [...products];

    // Filter by category
    if (selectedCategory !== 'Tất cả') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Filter by price range
    filtered = filtered.filter(product => 
      product.price >= priceRange.min && product.price <= priceRange.max
    );

    // Filter by search term
    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort products
    switch(sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default:
        // Keep original order or featured first
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    setFilteredProducts(filtered);
  };

  const handleAddToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItemIndex = cart.findIndex(item => item.id === product.id);
    
    if (existingItemIndex >= 0) {
      cart[existingItemIndex].quantity += 1;
    } else {
      cart.push({
        ...product,
        quantity: 1
      });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    toast.success('Đã thêm vào giỏ hàng!');
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const resetFilters = () => {
    setSelectedCategory('Tất cả');
    setPriceRange({ min: 0, max: 500000 });
    setSortBy('default');
    setSearchTerm('');
    toast.info('Đã đặt lại bộ lọc');
  };

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'Cà phê truyền thống':
        return <FaFire style={{ marginRight: '8px', color: '#fd7e14' }} />;
      case 'Cà phê máy':
        return <FaBolt style={{ marginRight: '8px', color: '#FFD700' }} />;
      case 'Trà':
        return <FaLeaf style={{ marginRight: '8px', color: '#198754' }} />;
      case 'Nước ép':
        return <FaPercent style={{ marginRight: '8px', color: '#dc3545' }} />;
      default:
        return <FaTag style={{ marginRight: '8px', color: '#0d6efd' }} />;
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '80vh',
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

  return (
    <div style={{
      minHeight: '100vh',
      background: '#FFFCF8',
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif'
    }}>
      {/* Hero Header */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(60, 42, 33, 0.9) 0%, rgba(139, 115, 85, 0.8) 100%), url(https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'white',
        padding: '80px 20px',
        textAlign: 'center',
        marginBottom: '40px'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ 
            fontSize: '48px',
            fontWeight: '700',
            marginBottom: '20px',
            fontFamily: '"Georgia", serif',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
          }}>
            Danh mục sản phẩm
          </h1>
          <p style={{ 
            fontSize: '18px',
            opacity: '0.9',
            marginBottom: '30px',
            lineHeight: '1.6'
          }}>
            Khám phá bộ sưu tập cà phê đặc biệt, trà thơm ngon và nước ép tươi mát. 
            Chất lượng hàng đầu, giá cả hợp lý.
          </p>
          
          {/* Search Bar */}
          <div style={{
            maxWidth: '600px',
            margin: '0 auto',
            position: 'relative'
          }}>
            <div style={{
              display: 'flex',
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '50px',
              overflow: 'hidden',
              boxShadow: '0 5px 20px rgba(0,0,0,0.2)'
            }}>
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  flex: 1,
                  border: 'none',
                  padding: '18px 25px',
                  fontSize: '16px',
                  outline: 'none',
                  background: 'transparent'
                }}
              />
              <button
                onClick={() => filterProducts()}
                style={{
                  background: '#D4A76A',
                  border: 'none',
                  padding: '0 30px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <FaSearch size={20} style={{ color: 'white' }} />
              </button>
            </div>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                style={{
                  position: 'absolute',
                  right: '70px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#999',
                  cursor: 'pointer'
                }}
              >
                <FaTimes />
              </button>
            )}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 20px 40px' }}>
        {/* Main Content */}
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '30px' }}>
          {/* Sidebar Filters */}
          <div style={{
            background: 'white',
            borderRadius: '15px',
            border: '1px solid #F5E8C7',
            padding: '25px',
            boxShadow: '0 5px 20px rgba(60, 42, 33, 0.08)',
            height: 'fit-content',
            position: 'sticky',
            top: '20px'
          }}>
            {/* Filters Header */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '25px',
              paddingBottom: '15px',
              borderBottom: '2px solid #F5E8C7'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FaFilter style={{ color: '#D4A76A' }} />
                <h3 style={{ 
                  fontSize: '20px', 
                  fontWeight: '600', 
                  color: '#3C2A21',
                  margin: 0
                }}>
                  Bộ lọc
                </h3>
              </div>
              <button
                onClick={resetFilters}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#D4A76A',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  padding: '5px 10px',
                  borderRadius: '5px',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#FFF8F0';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'none';
                }}
              >
                Đặt lại
              </button>
            </div>

            {/* Category Filter */}
            <div style={{ marginBottom: '25px' }}>
              <h4 style={{ 
                fontSize: '16px', 
                fontWeight: '600', 
                color: '#3C2A21',
                marginBottom: '15px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <FaTag style={{ color: '#8B7355', fontSize: '14px' }} />
                Danh mục
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {categories.map(category => {
                  const isSelected = selectedCategory === category;
                  const productCount = category === 'Tất cả' 
                    ? products.length 
                    : products.filter(p => p.category === category).length;
                  
                  return (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      style={{
                        background: isSelected ? '#FFF8F0' : 'white',
                        border: `2px solid ${isSelected ? '#D4A76A' : '#F5E8C7'}`,
                        borderRadius: '10px',
                        padding: '12px 15px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.borderColor = '#D4A76A';
                          e.currentTarget.style.transform = 'translateX(5px)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.borderColor = '#F5E8C7';
                          e.currentTarget.style.transform = 'translateX(0)';
                        }
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        {category !== 'Tất cả' && getCategoryIcon(category)}
                        <span style={{ 
                          color: isSelected ? '#3C2A21' : '#5C4033',
                          fontWeight: isSelected ? '600' : '400',
                          fontSize: '14px'
                        }}>
                          {category}
                        </span>
                      </div>
                      <span style={{
                        background: isSelected ? '#D4A76A' : '#F5E8C7',
                        color: isSelected ? 'white' : '#8B7355',
                        padding: '4px 10px',
                        borderRadius: '15px',
                        fontSize: '12px',
                        fontWeight: '600',
                        minWidth: '30px',
                        textAlign: 'center'
                      }}>
                        {productCount}
                      </span>
                      
                      {isSelected && (
                        <div style={{
                          position: 'absolute',
                          left: 0,
                          top: 0,
                          bottom: 0,
                          width: '4px',
                          background: '#D4A76A',
                          borderRadius: '2px'
                        }}></div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price Range Filter */}
            <div style={{ marginBottom: '25px' }}>
              <h4 style={{ 
                fontSize: '16px', 
                fontWeight: '600', 
                color: '#3C2A21',
                marginBottom: '15px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <FaGem style={{ color: '#8B7355', fontSize: '14px' }} />
                Khoảng giá
              </h4>
              <div style={{ padding: '0 10px' }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  marginBottom: '15px'
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ 
                      fontSize: '12px', 
                      color: '#8B7355',
                      marginBottom: '5px'
                    }}>
                      Từ
                    </div>
                    <div style={{ 
                      background: '#FFF8F0',
                      padding: '8px 15px',
                      borderRadius: '8px',
                      fontWeight: '600',
                      color: '#3C2A21',
                      fontSize: '14px'
                    }}>
                      {formatPrice(priceRange.min)}
                    </div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ 
                      fontSize: '12px', 
                      color: '#8B7355',
                      marginBottom: '5px'
                    }}>
                      Đến
                    </div>
                    <div style={{ 
                      background: '#FFF8F0',
                      padding: '8px 15px',
                      borderRadius: '8px',
                      fontWeight: '600',
                      color: '#3C2A21',
                      fontSize: '14px'
                    }}>
                      {formatPrice(priceRange.max)}
                    </div>
                  </div>
                </div>
                
                <input
                  type="range"
                  min="0"
                  max="500000"
                  step="10000"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({...priceRange, min: parseInt(e.target.value)})}
                  style={{
                    width: '100%',
                    height: '6px',
                    background: '#F5E8C7',
                    borderRadius: '3px',
                    outline: 'none',
                    marginBottom: '15px',
                    WebkitAppearance: 'none'
                  }}
                />
                <input
                  type="range"
                  min="0"
                  max="500000"
                  step="10000"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({...priceRange, max: parseInt(e.target.value)})}
                  style={{
                    width: '100%',
                    height: '6px',
                    background: '#F5E8C7',
                    borderRadius: '3px',
                    outline: 'none',
                    WebkitAppearance: 'none'
                  }}
                />
                
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  marginTop: '10px',
                  fontSize: '12px',
                  color: '#8B7355'
                }}>
                  <span>0đ</span>
                  <span>500,000đ</span>
                </div>
              </div>
            </div>

            {/* Sort Options */}
            <div style={{ marginBottom: '25px' }}>
              <h4 style={{ 
                fontSize: '16px', 
                fontWeight: '600', 
                color: '#3C2A21',
                marginBottom: '15px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <FaSortAmountDown style={{ color: '#8B7355', fontSize: '14px' }} />
                Sắp xếp theo
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { id: 'default', label: 'Mặc định', icon: <FaStar /> },
                  { id: 'price-asc', label: 'Giá: Thấp đến cao', icon: <FaSortAmountUp /> },
                  { id: 'price-desc', label: 'Giá: Cao đến thấp', icon: <FaSortAmountDown /> },
                  { id: 'name-asc', label: 'Tên: A-Z', icon: <FaSortAmountUp /> },
                  { id: 'name-desc', label: 'Tên: Z-A', icon: <FaSortAmountDown /> },
                  { id: 'rating', label: 'Đánh giá cao nhất', icon: <FaStar /> }
                ].map(option => (
                  <button
                    key={option.id}
                    onClick={() => setSortBy(option.id)}
                    style={{
                      background: sortBy === option.id ? '#FFF8F0' : 'white',
                      border: `2px solid ${sortBy === option.id ? '#D4A76A' : '#F5E8C7'}`,
                      borderRadius: '10px',
                      padding: '10px 15px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (sortBy !== option.id) {
                        e.currentTarget.style.borderColor = '#D4A76A';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (sortBy !== option.id) {
                        e.currentTarget.style.borderColor = '#F5E8C7';
                      }
                    }}
                  >
                    <div style={{
                      color: sortBy === option.id ? '#D4A76A' : '#8B7355',
                      fontSize: '14px'
                    }}>
                      {option.icon}
                    </div>
                    <span style={{ 
                      fontSize: '14px',
                      color: sortBy === option.id ? '#3C2A21' : '#5C4033',
                      fontWeight: sortBy === option.id ? '600' : '400',
                      textAlign: 'left',
                      flex: 1
                    }}>
                      {option.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Product Stats */}
            <div style={{
              background: '#FFF8F0',
              borderRadius: '12px',
              padding: '20px',
              border: '1px solid #F5E8C7',
              marginTop: '20px'
            }}>
              <div style={{ 
                fontSize: '14px', 
                fontWeight: '600',
                color: '#3C2A21',
                marginBottom: '10px'
              }}>
                Thống kê
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', color: '#8B7355' }}>Tổng sản phẩm:</span>
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#3C2A21' }}>
                  {products.length}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', color: '#8B7355' }}>Đang hiển thị:</span>
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#D4A76A' }}>
                  {filteredProducts.length}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13px', color: '#8B7355' }}>Danh mục:</span>
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#3C2A21' }}>
                  {categories.length - 1}
                </span>
              </div>
            </div>
          </div>

          {/* Products Section */}
          <div>
            {/* Products Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '30px',
              flexWrap: 'wrap',
              gap: '15px'
            }}>
              <div>
                <h2 style={{ 
                  fontSize: '28px', 
                  fontWeight: '700', 
                  color: '#3C2A21',
                  marginBottom: '5px'
                }}>
                  {selectedCategory === 'Tất cả' ? 'Tất cả sản phẩm' : selectedCategory}
                </h2>
                <p style={{ 
                  fontSize: '15px', 
                  color: '#8B7355',
                  margin: 0
                }}>
                  Hiển thị <strong style={{ color: '#D4A76A' }}>{filteredProducts.length}</strong> trong tổng số <strong>{products.length}</strong> sản phẩm
                </p>
              </div>
              
              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                style={{
                  display: 'none',
                  background: '#D4A76A',
                  border: 'none',
                  borderRadius: '30px',
                  padding: '12px 25px',
                  color: 'white',
                  fontWeight: '600',
                  fontSize: '15px',
                  cursor: 'pointer',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                <FaSlidersH />
                Bộ lọc
              </button>
            </div>

            {/* Active Filters */}
            {(selectedCategory !== 'Tất cả' || priceRange.min > 0 || priceRange.max < 500000 || searchTerm || sortBy !== 'default') && (
              <div style={{
                background: '#FFF8F0',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '30px',
                border: '1px solid #F5E8C7',
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '10px'
              }}>
                <div style={{ 
                  fontSize: '14px', 
                  fontWeight: '600',
                  color: '#3C2A21',
                  marginRight: '10px'
                }}>
                  Bộ lọc đang áp dụng:
                </div>
                
                {selectedCategory !== 'Tất cả' && (
                  <div style={{
                    background: 'white',
                    border: '1px solid #D4A76A',
                    borderRadius: '20px',
                    padding: '8px 15px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '14px'
                  }}>
                    <FaTag size={12} style={{ color: '#D4A76A' }} />
                    <span style={{ color: '#3C2A21' }}>{selectedCategory}</span>
                    <button
                      onClick={() => setSelectedCategory('Tất cả')}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#8B7355',
                        cursor: 'pointer',
                        padding: '0',
                        marginLeft: '5px'
                      }}
                    >
                      <FaTimes size={12} />
                    </button>
                  </div>
                )}
                
                {(priceRange.min > 0 || priceRange.max < 500000) && (
                  <div style={{
                    background: 'white',
                    border: '1px solid #D4A76A',
                    borderRadius: '20px',
                    padding: '8px 15px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '14px'
                  }}>
                    <FaGem size={12} style={{ color: '#D4A76A' }} />
                    <span style={{ color: '#3C2A21' }}>
                      {formatPrice(priceRange.min)} - {formatPrice(priceRange.max)}
                    </span>
                    <button
                      onClick={() => setPriceRange({ min: 0, max: 500000 })}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#8B7355',
                        cursor: 'pointer',
                        padding: '0',
                        marginLeft: '5px'
                      }}
                    >
                      <FaTimes size={12} />
                    </button>
                  </div>
                )}
                
                {searchTerm && (
                  <div style={{
                    background: 'white',
                    border: '1px solid #D4A76A',
                    borderRadius: '20px',
                    padding: '8px 15px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '14px'
                  }}>
                    <FaSearch size={12} style={{ color: '#D4A76A' }} />
                    <span style={{ color: '#3C2A21' }}>"{searchTerm}"</span>
                    <button
                      onClick={() => setSearchTerm('')}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#8B7355',
                        cursor: 'pointer',
                        padding: '0',
                        marginLeft: '5px'
                      }}
                    >
                      <FaTimes size={12} />
                    </button>
                  </div>
                )}
                
                <button
                  onClick={resetFilters}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#D4A76A',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    marginLeft: 'auto',
                    padding: '8px 15px',
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(212, 167, 106, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'none';
                  }}
                >
                  <FaWindowClose />
                  Xóa tất cả
                </button>
              </div>
            )}

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
                gap: '25px'
              }}>
                {filteredProducts.map(product => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onAddToCart={handleAddToCart}
                    style={{
                      animation: 'fadeIn 0.5s ease forwards',
                      animationDelay: `${Math.random() * 0.3}s`
                    }}
                  />
                ))}
              </div>
            ) : (
              <div style={{
                background: 'white',
                borderRadius: '20px',
                border: '2px dashed #F5E8C7',
                padding: '60px 40px',
                textAlign: 'center',
                marginTop: '20px'
              }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  background: '#FFF8F0',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 25px',
                  color: '#D4A76A',
                  fontSize: '32px'
                }}>
                  <FaSearch />
                </div>
                <h3 style={{ 
                  fontSize: '24px', 
                  fontWeight: '600', 
                  color: '#3C2A21',
                  marginBottom: '15px'
                }}>
                  Không tìm thấy sản phẩm phù hợp
                </h3>
                <p style={{ 
                  fontSize: '16px', 
                  color: '#8B7355',
                  marginBottom: '30px',
                  maxWidth: '500px',
                  margin: '0 auto'
                }}>
                  Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm để tìm thấy sản phẩm bạn cần.
                </p>
                <button
                  onClick={resetFilters}
                  style={{
                    background: '#D4A76A',
                    border: 'none',
                    borderRadius: '30px',
                    padding: '15px 40px',
                    color: 'white',
                    fontWeight: '600',
                    fontSize: '16px',
                    cursor: 'pointer',
                    display: 'inline-flex',
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
                  <FaTimes style={{ transform: 'rotate(45deg)' }} />
                  Xóa bộ lọc và xem tất cả
                </button>
              </div>
            )}

            {/* Pagination (Optional) */}
            {filteredProducts.length > 0 && (
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: '50px',
                gap: '10px'
              }}>
                <button
                  style={{
                    background: 'white',
                    border: '2px solid #F5E8C7',
                    borderRadius: '10px',
                    padding: '12px 20px',
                    color: '#5C4033',
                    fontWeight: '600',
                    fontSize: '15px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#D4A76A';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#F5E8C7';
                  }}
                >
                  <FaChevronRight style={{ transform: 'rotate(180deg)' }} />
                  Trang trước
                </button>
                
                <div style={{ display: 'flex', gap: '5px' }}>
                  {[1, 2, 3].map(page => (
                    <button
                      key={page}
                      style={{
                        background: page === 1 ? '#D4A76A' : 'white',
                        border: `2px solid ${page === 1 ? '#D4A76A' : '#F5E8C7'}`,
                        borderRadius: '10px',
                        width: '45px',
                        height: '45px',
                        color: page === 1 ? 'white' : '#5C4033',
                        fontWeight: '600',
                        fontSize: '15px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        if (page !== 1) {
                          e.currentTarget.style.borderColor = '#D4A76A';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (page !== 1) {
                          e.currentTarget.style.borderColor = '#F5E8C7';
                        }
                      }}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                
                <button
                  style={{
                    background: 'white',
                    border: '2px solid #F5E8C7',
                    borderRadius: '10px',
                    padding: '12px 20px',
                    color: '#5C4033',
                    fontWeight: '600',
                    fontSize: '15px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#D4A76A';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#F5E8C7';
                  }}
                >
                  Trang sau
                  <FaChevronRight />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Modal */}
      {showMobileFilters && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '400px',
            maxHeight: '90vh',
            overflow: 'auto',
            position: 'relative'
          }}>
            {/* Mobile Filters Content */}
            <div style={{ padding: '30px' }}>
              {/* Copy sidebar filters here for mobile */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '25px'
              }}>
                <h3 style={{ fontSize: '22px', fontWeight: '600', color: '#3C2A21', margin: 0 }}>
                  Bộ lọc
                </h3>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '24px',
                    color: '#8B7355',
                    cursor: 'pointer'
                  }}
                >
                  <FaTimes />
                </button>
              </div>
              {/* Include all filter sections from sidebar */}
            </div>
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

        /* Custom range slider */
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 20px;
          height: 20px;
          background: #D4A76A;
          border-radius: 50%;
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }

        input[type="range"]::-moz-range-thumb {
          width: 20px;
          height: 20px;
          background: #D4A76A;
          border-radius: 50%;
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }

        @media (max-width: 1024px) {
          .main-container {
            grid-template-columns: 1fr !important;
          }
          
          .sidebar-filters {
            display: none;
          }
          
          .mobile-filter-btn {
            display: flex !important;
          }
          
          .products-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: 36px !important;
          }
          
          .products-header {
            flex-direction: column;
            align-items: flex-start !important;
          }
          
          .products-grid {
            grid-template-columns: 1fr !important;
          }
          
          .active-filters {
            flex-direction: column;
            align-items: flex-start !important;
          }
          
          .active-filters > div:last-child {
            margin-left: 0 !important;
            margin-top: 15px;
          }
        }

        @media (max-width: 480px) {
          .hero-title {
            font-size: 28px !important;
          }
          
          .search-bar {
            flex-direction: column;
          }
          
          .search-bar input {
            border-radius: 25px 25px 0 0 !important;
          }
          
          .search-bar button {
            border-radius: 0 0 25px 25px !important;
            width: 100%;
          }
          
          .pagination {
            flex-wrap: wrap;
          }
        }
      `}</style>
    </div>
  );
};

export default Products;