// src/pages/admin/AdminProducts.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, deleteProduct } from '../../services/productService';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Lỗi tải sản phẩm:', error);
      toast.error('Lỗi tải sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Bạn có chắc muốn xóa sản phẩm "${name}"?`)) {
      return;
    }

    try {
      await deleteProduct(id);
      setProducts(products.filter(product => product.id !== id));
      toast.success('Đã xóa sản phẩm thành công');
    } catch (error) {
      console.error('Lỗi xóa sản phẩm:', error);
      toast.error('Lỗi xóa sản phẩm');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Quản lý sản phẩm</h1>
        <Link to="/admin/products/add" className="btn btn-primary">
          <FaPlus className="me-2" />
          Thêm sản phẩm
        </Link>
      </div>

      {/* Search Bar */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="btn btn-outline-secondary" type="button">
              Tìm kiếm
            </button>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Hình ảnh</th>
                  <th>Tên sản phẩm</th>
                  <th>Danh mục</th>
                  <th>Giá</th>
                  <th>Trạng thái</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-4">
                      <p className="text-muted mb-0">Không có sản phẩm nào</p>
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map(product => (
                    <tr key={product.id}>
                      <td>
                        <img
                          src={product.image}
                          alt={product.name}
                          style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                          className="rounded"
                        />
                      </td>
                      <td>
                        <div>
                          <strong>{product.name}</strong>
                          <p className="text-muted mb-0 small" style={{ maxWidth: '300px' }}>
                            {product.description?.substring(0, 100)}...
                          </p>
                        </div>
                      </td>
                      <td>
                        <span className="badge bg-secondary">
                          {product.category || 'Chưa phân loại'}
                        </span>
                      </td>
                      <td>
                        <strong className="text-danger">{formatPrice(product.price)}</strong>
                      </td>
                      <td>
                        <span className={`badge ${product.featured ? 'bg-success' : 'bg-secondary'}`}>
                          {product.featured ? 'Nổi bật' : 'Bình thường'}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <Link
                            to={`/admin/products/edit/${product.id}`}
                            className="btn btn-sm btn-outline-primary"
                          >
                            <FaEdit />
                          </Link>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(product.id, product.name)}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="row mt-4">
        <div className="col-md-3">
          <div className="card bg-light">
            <div className="card-body text-center">
              <h5 className="card-title">Tổng sản phẩm</h5>
              <h2 className="text-primary">{products.length}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-light">
            <div className="card-body text-center">
              <h5 className="card-title">Sản phẩm nổi bật</h5>
              <h2 className="text-success">
                {products.filter(p => p.featured).length}
              </h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-light">
            <div className="card-body text-center">
              <h5 className="card-title">Danh mục</h5>
              <h2 className="text-info">
                {[...new Set(products.map(p => p.category))].length}
              </h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-light">
            <div className="card-body text-center">
              <h5 className="card-title">Giá trung bình</h5>
              <h2 className="text-warning">
                {formatPrice(
                  products.reduce((sum, p) => sum + p.price, 0) / products.length || 0
                )}
              </h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;