// src/pages/Products.jsx
import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { getProducts, getProductsByCategory } from '../services/productService';
import { toast } from 'react-toastify';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([
    'Tất cả', 'Cà phê truyền thống', 'Cà phê máy', 'Trà', 'Nước ép'
  ]);
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [selectedCategory, products]);

  const loadProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      toast.error('Lỗi tải sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    if (selectedCategory === 'Tất cả') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(
        product => product.category === selectedCategory
      );
      setFilteredProducts(filtered);
    }
  };

  const handleAddToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItemIndex = cart.findIndex(item => item.id === product.id);
    
    if (existingItemIndex >= 0) {
      cart[existingItemIndex].quantity += 1;
    } else {
      cart.push(product);
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    toast.success('Đã thêm vào giỏ hàng!');
    window.dispatchEvent(new Event('cartUpdated'));
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
    <div className="container py-5">
      <h1 className="mb-4">Tất cả sản phẩm</h1>
      
      {/* Category Filter */}
      <div className="mb-4">
        <div className="d-flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category}
              className={`btn ${
                selectedCategory === category ? 'btn-primary' : 'btn-outline-primary'
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="row g-4">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <div key={product.id} className="col-md-4 col-lg-3">
              <ProductCard 
                product={product} 
                onAddToCart={handleAddToCart}
              />
            </div>
          ))
        ) : (
          <div className="col-12 text-center py-5">
            <p className="text-muted">Không có sản phẩm nào trong danh mục này</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;