// src/pages/admin/AddProduct.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addProduct } from '../../services/productService';
import { toast } from 'react-toastify';

const AddProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Cà phê truyền thống',
    featured: false,
    image: ''
  });

  const categories = [
    'Cà phê truyền thống',
    'Cà phê máy',
    'Trà',
    'Nước ép',
    'Bánh ngọt',
    'Khác'
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    setLoading(true);

    try {
      // Convert price to number
      const productData = {
        ...formData,
        price: parseFloat(formData.price)
      };

      await addProduct(productData, null); // No image file upload in this version
      toast.success('Thêm sản phẩm thành công!');
      navigate('/admin/products');
    } catch (error) {
      console.error('Lỗi thêm sản phẩm:', error);
      toast.error('Có lỗi xảy ra khi thêm sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Thêm sản phẩm mới</h1>
        <button
          className="btn btn-outline-secondary"
          onClick={() => navigate('/admin/products')}
        >
          Quay lại
        </button>
      </div>

      <div className="row">
        <div className="col-lg-8">
          <form onSubmit={handleSubmit}>
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title mb-4">Thông tin sản phẩm</h5>
                
                <div className="mb-3">
                  <label className="form-label">Tên sản phẩm *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Mô tả</label>
                  <textarea
                    className="form-control"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                  />
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Giá *</label>
                    <div className="input-group">
                      <input
                        type="number"
                        className="form-control"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        required
                        min="0"
                      />
                      <span className="input-group-text">VND</span>
                    </div>
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Danh mục</label>
                    <select
                      className="form-select"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mb-3 form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleChange}
                  />
                  <label className="form-check-label">
                    Sản phẩm nổi bật
                  </label>
                </div>
              </div>
            </div>

            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title mb-4">Hình ảnh sản phẩm</h5>
                
                <div className="mb-3">
                  <label className="form-label">URL hình ảnh</label>
                  <input
                    type="text"
                    className="form-control"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                  />
                  <div className="form-text">
                    Nhập URL hình ảnh hoặc upload file
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Hoặc upload hình ảnh</label>
                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </div>

                {imagePreview && (
                  <div className="mt-3">
                    <p className="form-label">Xem trước:</p>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="img-fluid rounded"
                      style={{ maxHeight: '200px' }}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="d-flex gap-3">
              <button
                type="submit"
                className="btn btn-primary btn-lg flex-fill"
                disabled={loading}
              >
                {loading ? 'Đang thêm...' : 'Thêm sản phẩm'}
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary btn-lg flex-fill"
                onClick={() => navigate('/admin/products')}
              >
                Hủy
              </button>
            </div>
          </form>
        </div>

        <div className="col-lg-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title mb-3">Hướng dẫn</h5>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <strong>Tên sản phẩm:</strong> Ngắn gọn, dễ hiểu
                </li>
                <li className="mb-2">
                  <strong>Mô tả:</strong> Chi tiết về sản phẩm
                </li>
                <li className="mb-2">
                  <strong>Giá:</strong> Nhập bằng số, đơn vị VND
                </li>
                <li className="mb-2">
                  <strong>Hình ảnh:</strong> Tỷ lệ 1:1, dung lượng dưới 2MB
                </li>
                <li className="mb-2">
                  <strong>Nổi bật:</strong> Sản phẩm sẽ hiển thị ở trang chủ
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;