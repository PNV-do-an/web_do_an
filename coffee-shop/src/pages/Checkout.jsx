// src/pages/Checkout.jsx - ĐÃ FIX THÔNG BÁO
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../services/firebase';
import { createOrder } from '../services/orderService';
import { toast } from 'react-toastify';
import { FaCheckCircle, FaBell, FaUniversity, FaInfoCircle, FaCreditCard, FaMoneyBill, FaQrcode, FaMobileAlt } from 'react-icons/fa';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    district: '',
    ward: '',
    note: '',
    paymentMethod: 'cod' // cod, banking, qrcode
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Load cart
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(cart);

    // Load user
    const currentUser = auth.currentUser;
    if (!currentUser) {
      toast.error('Vui lòng đăng nhập để thanh toán');
      navigate('/login');
      return;
    }
    
    setUser(currentUser);
    setFormData(prev => ({
      ...prev,
      email: currentUser.email || '',
      fullName: currentUser.displayName || ''
    }));
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // HÀM TẠO THÔNG BÁO TRONG FIRESTORE
  const createNotification = async (orderId, orderData) => {
    try {
      // Tạo thông báo cho khách hàng
      const userNotification = {
        userId: orderData.userId,
        orderId: orderId,
        title: '🎉 Đặt hàng thành công!',
        message: `Đơn hàng ${orderData.orderNumber} đã được đặt thành công. Tổng tiền: ${formatPrice(orderData.total)}`,
        type: 'order_success',
        isRead: false,
        isDeleted: false,
        createdAt: serverTimestamp(),
        icon: '🎉',
        priority: 'high'
      };

      await addDoc(collection(db, 'notifications'), userNotification);
      
      // Tạo thông báo cho admin
      const adminNotification = {
        userId: 'admin', // hoặc 'admin@coffee.com'
        orderId: orderId,
        title: '🆕 Đơn hàng mới!',
        message: `Đơn hàng ${orderData.orderNumber} từ ${orderData.customerName || orderData.userEmail}`,
        type: 'new_order',
        isRead: false,
        isDeleted: false,
        createdAt: serverTimestamp(),
        icon: '🆕',
        priority: 'high',
        customerName: orderData.customerName,
        customerEmail: orderData.userEmail,
        totalAmount: orderData.total
      };
      
      await addDoc(collection(db, 'notifications'), adminNotification);
      
      console.log('✅ Đã tạo thông báo thành công');
    } catch (error) {
      console.error('❌ Lỗi tạo thông báo:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (cartItems.length === 0) {
      toast.error('Giỏ hàng trống');
      return;
    }

    if (!formData.fullName || !formData.phone || !formData.address) {
      toast.error('Vui lòng điền đầy đủ thông tin giao hàng');
      return;
    }

    setLoading(true);

    try {
      const shippingFee = formData.paymentMethod === 'cod' ? 20000 : 0;
      const totalAmount = calculateTotal() + shippingFee;
      const orderNumber = `ORD${Date.now().toString().slice(-8)}`;

      const orderData = {
        userId: user.uid,
        userEmail: user.email,
        items: cartItems,
        shippingInfo: formData,
        total: totalAmount,
        status: 'pending',
        createdAt: new Date().toISOString(),
        paymentMethod: formData.paymentMethod,
        paymentStatus: 'pending',
        // THÊM 2 TRƯỜNG QUAN TRỌNG
        orderNumber: orderNumber,
        customerName: formData.fullName
      };

      // 1. TẠO ĐƠN HÀNG TRONG FIRESTORE
      const orderId = await createOrder(orderData);
      
      // 2. TẠO THÔNG BÁO TRONG FIRESTORE (CHO CHUÔNG)
      await createNotification(orderId, orderData);
      
      // 3. CLEAR GIỎ HÀNG
      localStorage.removeItem('cart');
      window.dispatchEvent(new Event('cartUpdated'));
      
      // 4. GỬI SỰ KIỆN ĐỂ HEADER CẬP NHẬT
      window.dispatchEvent(new CustomEvent('notificationAdded', {
        detail: { 
          userId: user.uid,
          orderId: orderId,
          orderNumber: orderNumber
        }
      }));
      
      // 5. HIỂN THỊ THÔNG BÁO POPUP (TOASTIFY)
  console.log('✅ Đặt hàng thành công! Thông báo đã được lưu vào hệ thống.');
      
      // 6. CHUYỂN HƯỚNG
      if (formData.paymentMethod === 'qrcode') {
        navigate('/qr-payment', { 
          state: { 
            orderId, 
            total: totalAmount,
            shippingInfo: formData
          } 
        });
      } else if (formData.paymentMethod === 'banking') {
        navigate('/bank-transfer-confirmation', { 
          state: { 
            orderId, 
            total: totalAmount 
          } 
        });
      } else {
        navigate(`/order-confirmation/${orderId}`);
      }
      
    } catch (error) {
      console.error('Lỗi đặt hàng:', error);
      toast.error(
        <div>
          <FaBell className="me-2" />
          <strong>Đặt hàng thất bại!</strong>
          <div className="small mt-1">Vui lòng thử lại hoặc liên hệ hỗ trợ</div>
        </div>
      );
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  // Component hiển thị thông tin ngân hàng
  const BankTransferInfo = () => (
    <div className="card bg-light border-primary mt-3">
      <div className="card-body">
        <h6 className="card-title text-primary mb-3">
          <FaUniversity className="me-2" />
          Thông tin chuyển khoản
        </h6>
        
        <div className="row g-3">
          <div className="col-md-6">
            <div className="border rounded p-3 bg-white">
              <div className="d-flex align-items-center mb-2">
                <div className="bg-primary text-white rounded-circle p-2 me-2">
                  <FaUniversity />
                </div>
                <strong>Vietcombank</strong>
              </div>
              <div className="mt-2">
                <small className="text-muted">Số tài khoản:</small>
                <div className="fw-bold text-danger">0123 4567 890</div>
              </div>
              <div className="mt-1">
                <small className="text-muted">Chủ tài khoản:</small>
                <div className="fw-bold">COFFEE SHOP COMPANY</div>
              </div>
              <div className="mt-1">
                <small className="text-muted">Chi nhánh:</small>
                <div className="fw-bold">Hồ Chí Minh</div>
              </div>
            </div>
          </div>
          
          <div className="col-md-6">
            <div className="border rounded p-3 bg-white">
              <div className="d-flex align-items-center mb-2">
                <div className="bg-success text-white rounded-circle p-2 me-2">
                  <FaUniversity />
                </div>
                <strong>Techcombank</strong>
              </div>
              <div className="mt-2">
                <small className="text-muted">Số tài khoản:</small>
                <div className="fw-bold text-danger">0987 6543 210</div>
              </div>
              <div className="mt-1">
                <small className="text-muted">Chủ tài khoản:</small>
                <div className="fw-bold">COFFEE SHOP COMPANY</div>
              </div>
              <div className="mt-1">
                <small className="text-muted">Chi nhánh:</small>
                <div className="fw-bold">Hà Nội</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="alert alert-info mt-3 mb-0">
          <FaInfoCircle className="me-2" />
          <strong>Lưu ý quan trọng:</strong>
          <ul className="mb-0 mt-2 small">
            <li>Nội dung chuyển khoản: <code className="bg-light px-2 py-1 rounded">SĐT_TENKHACHHANG</code></li>
            <li>Ví dụ: <code className="bg-light px-2 py-1 rounded">0901234567_NGUYENVANA</code></li>
            <li>Sau khi chuyển khoản, vui lòng chụp ảnh biên lai và gửi cho chúng tôi</li>
            <li>Đơn hàng sẽ được giao sau 24h xác nhận thanh toán</li>
            <li>Miễn phí vận chuyển khi thanh toán chuyển khoản trước</li>
          </ul>
        </div>
      </div>
    </div>
  );

  // Component hiển thị thông tin QR Code
  const QRPaymentInfo = () => (
    <div className="card bg-light border-success mt-3">
      <div className="card-body">
        <h6 className="card-title text-success mb-3">
          <FaQrcode className="me-2" />
          Thanh toán bằng QR Code
        </h6>
        
        <div className="row g-3">
          <div className="col-md-6">
            <div className="border rounded p-3 bg-white">
              <div className="d-flex align-items-center mb-2">
                <div className="bg-success text-white rounded-circle p-2 me-2">
                  <FaQrcode />
                </div>
                <div>
                  <strong>Quét mã để thanh toán</strong>
                  <p className="text-muted small mb-0">Nhanh chóng và an toàn</p>
                </div>
              </div>
              <div className="mt-3">
                <FaMobileAlt className="me-2 text-primary" />
                <small>Hỗ trợ hơn 40 ngân hàng & ví điện tử</small>
              </div>
            </div>
          </div>
          
          <div className="col-md-6">
            <div className="border rounded p-3 bg-white">
              <h6 className="mb-2">Các bước thanh toán:</h6>
              <ol className="mb-0 small">
                <li>Mở app ngân hàng hoặc ví điện tử</li>
                <li>Chọn tính năng "Quét mã QR"</li>
                <li>Hướng camera vào mã QR</li>
                <li>Kiểm tra thông tin và xác nhận</li>
                <li>Hệ thống tự động xác nhận thanh toán</li>
              </ol>
            </div>
          </div>
        </div>
        
        <div className="alert alert-success mt-3 mb-0">
          <FaCheckCircle className="me-2" />
          <strong>Ưu điểm khi thanh toán QR Code:</strong>
          <ul className="mb-0 mt-2 small">
            <li>Thanh toán ngay lập tức</li>
            <li>Không cần nhập thông tin tài khoản</li>
            <li>Xác nhận thanh toán tự động</li>
            <li>Miễn phí vận chuyển</li>
            <li>Bảo mật tuyệt đối</li>
          </ul>
        </div>
      </div>
    </div>
  );

  if (cartItems.length === 0) {
    return (
      <div className="container py-5 text-center">
        <div className="card shadow-sm border-0">
          <div className="card-body py-5">
            <FaCreditCard size={60} className="text-muted mb-4" />
            <h2 className="mb-3">Giỏ hàng trống</h2>
            <p className="text-muted mb-4">
              Bạn chưa có sản phẩm nào trong giỏ hàng để thanh toán
            </p>
            <button 
              className="btn btn-primary btn-lg"
              onClick={() => navigate('/products')}
            >
              <FaMoneyBill className="me-2" />
              Tiếp tục mua sắm
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-lg-8">
          <h1 className="mb-4">
            <FaCreditCard className="me-2" />
            Thanh toán đơn hàng
          </h1>
          
          <form onSubmit={handleSubmit}>
            {/* Thông tin giao hàng */}
            <div className="card shadow-sm mb-4 border-0">
              <div className="card-header bg-white border-bottom">
                <h5 className="mb-0">📦 Thông tin giao hàng</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold">Họ và tên *</label>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      placeholder="Nhập họ và tên"
                    />
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold">Số điện thoại *</label>
                    <input
                      type="tel"
                      className="form-control form-control-lg"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      placeholder="Nhập số điện thoại"
                    />
                  </div>
                  
                  <div className="col-12 mb-3">
                    <label className="form-label fw-bold">Email</label>
                    <input
                      type="email"
                      className="form-control form-control-lg"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="email@example.com"
                    />
                  </div>
                  
                  <div className="col-12 mb-3">
                    <label className="form-label fw-bold">Địa chỉ nhận hàng *</label>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      placeholder="Số nhà, tên đường"
                    />
                  </div>
                  
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Tỉnh/Thành phố</label>
                    <select
                      className="form-select form-select-lg"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                    >
                      <option value="">Chọn tỉnh/thành phố</option>
                      <option value="Hồ Chí Minh">Hồ Chí Minh</option>
                      <option value="Hà Nội">Hà Nội</option>
                      <option value="Đà Nẵng">Đà Nẵng</option>
                      <option value="Cần Thơ">Cần Thơ</option>
                      <option value="Hải Phòng">Hải Phòng</option>
                    </select>
                  </div>
                  
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Quận/Huyện</label>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      name="district"
                      value={formData.district}
                      onChange={handleChange}
                      placeholder="Nhập quận/huyện"
                    />
                  </div>
                  
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Phường/Xã</label>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      name="ward"
                      value={formData.ward}
                      onChange={handleChange}
                      placeholder="Nhập phường/xã"
                    />
                  </div>
                  
                  <div className="col-12 mb-3">
                    <label className="form-label">Ghi chú đơn hàng</label>
                    <textarea
                      className="form-control"
                      name="note"
                      value={formData.note}
                      onChange={handleChange}
                      rows="3"
                      placeholder="Ghi chú về đơn hàng, thời gian giao hàng..."
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Phương thức thanh toán */}
            <div className="card shadow-sm mb-4 border-0">
              <div className="card-header bg-white border-bottom">
                <h5 className="mb-0">💳 Phương thức thanh toán</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  {/* COD */}
                  <div className="col-md-4 mb-3">
                    <div className={`card h-100 cursor-pointer ${formData.paymentMethod === 'cod' ? 'border-primary border-2' : 'border'}`}
                         onClick={() => setFormData({...formData, paymentMethod: 'cod'})}>
                      <div className="card-body text-center">
                        <div className="form-check d-flex justify-content-center mb-3">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="paymentMethod"
                            id="cod"
                            value="cod"
                            checked={formData.paymentMethod === 'cod'}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="mb-3">
                          <FaMoneyBill size={40} className={`${formData.paymentMethod === 'cod' ? 'text-success' : 'text-secondary'}`} />
                        </div>
                        <strong className="d-block">COD</strong>
                        <p className="text-muted small mb-0">
                          Thanh toán khi nhận hàng
                        </p>
                        {formData.paymentMethod === 'cod' && (
                          <div className="mt-2">
                            <small className="text-muted">+{formatPrice(20000)} phí ship</small>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Banking */}
                  <div className="col-md-4 mb-3">
                    <div className={`card h-100 cursor-pointer ${formData.paymentMethod === 'banking' ? 'border-primary border-2' : 'border'}`}
                         onClick={() => setFormData({...formData, paymentMethod: 'banking'})}>
                      <div className="card-body text-center">
                        <div className="form-check d-flex justify-content-center mb-3">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="paymentMethod"
                            id="banking"
                            value="banking"
                            checked={formData.paymentMethod === 'banking'}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="mb-3">
                          <FaUniversity size={40} className={`${formData.paymentMethod === 'banking' ? 'text-primary' : 'text-secondary'}`} />
                        </div>
                        <strong className="d-block">Chuyển khoản</strong>
                        <p className="text-muted small mb-0">
                          Ngân hàng/Ví điện tử
                        </p>
                        {formData.paymentMethod === 'banking' && (
                          <div className="mt-2">
                            <small className="text-success">✓ Miễn phí ship</small>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* QR Code */}
                  <div className="col-md-4 mb-3">
                    <div className={`card h-100 cursor-pointer ${formData.paymentMethod === 'qrcode' ? 'border-primary border-2' : 'border'}`}
                         onClick={() => setFormData({...formData, paymentMethod: 'qrcode'})}>
                      <div className="card-body text-center">
                        <div className="form-check d-flex justify-content-center mb-3">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="paymentMethod"
                            id="qrcode"
                            value="qrcode"
                            checked={formData.paymentMethod === 'qrcode'}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="mb-3">
                          <FaQrcode size={40} className={`${formData.paymentMethod === 'qrcode' ? 'text-success' : 'text-secondary'}`} />
                        </div>
                        <strong className="d-block">QR Code</strong>
                        <p className="text-muted small mb-0">
                          Quét mã thanh toán
                        </p>
                        {formData.paymentMethod === 'qrcode' && (
                          <div className="mt-2">
                            <small className="text-success">✓ Miễn phí ship</small>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Hiển thị thông tin tương ứng */}
                {formData.paymentMethod === 'banking' && <BankTransferInfo />}
                {formData.paymentMethod === 'qrcode' && <QRPaymentInfo />}
              </div>
            </div>
            
            {/* Nút đặt hàng */}
            <div className="d-grid">
              <button
                type="submit"
                className="btn btn-success btn-lg py-3"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Đang xử lý đơn hàng...
                  </>
                ) : (
                  <>
                    <FaCheckCircle className="me-2" />
                    {formData.paymentMethod === 'qrcode' ? 'TIẾP TỤC ĐẾN QR CODE' : 'HOÀN TẤT ĐẶT HÀNG'}
                  </>
                )}
              </button>
              
              <div className="text-center mt-3">
                <small className="text-muted">
                  Bằng cách nhấn "Hoàn tất đặt hàng", bạn đồng ý với 
                  <a href="#" className="text-decoration-none ms-1">Điều khoản dịch vụ</a> của chúng tôi
                </small>
              </div>
            </div>
          </form>
        </div>
        
        {/* Tóm tắt đơn hàng */}
        <div className="col-lg-4">
          <div className="card shadow-sm sticky-top" style={{ top: '20px' }}>
            <div className="card-header bg-white border-bottom">
              <h5 className="mb-0">🛒 Tóm tắt đơn hàng</h5>
            </div>
            <div className="card-body">
              {/* Danh sách sản phẩm */}
              <div className="mb-3">
                {cartItems.map(item => (
                  <div key={item.id} className="d-flex align-items-center mb-3 pb-3 border-bottom">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="rounded me-3"
                      style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                    />
                    <div className="flex-fill">
                      <div className="d-flex justify-content-between">
                        <div>
                          <h6 className="mb-1">{item.name}</h6>
                          <small className="text-muted">Số lượng: {item.quantity}</small>
                        </div>
                        <div className="text-end">
                          <strong className="text-danger">{formatPrice(item.price * item.quantity)}</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Tổng tiền */}
              <div className="mb-2">
                <div className="d-flex justify-content-between mb-2">
                  <span>Tạm tính:</span>
                  <span>{formatPrice(calculateTotal())}</span>
                </div>
                
                <div className="d-flex justify-content-between mb-2">
                  <span>Phí vận chuyển:</span>
                  <span>
                    {formData.paymentMethod === 'cod' ? (
                      formatPrice(20000)
                    ) : (
                      <span className="text-success">MIỄN PHÍ</span>
                    )}
                  </span>
                </div>
                
                <hr />
                
                <div className="d-flex justify-content-between">
                  <strong>Tổng cộng:</strong>
                  <strong className="text-danger fs-4">
                    {formatPrice(
                      calculateTotal() + (formData.paymentMethod === 'cod' ? 20000 : 0)
                    )}
                  </strong>
                </div>
                
                {(formData.paymentMethod === 'banking' || formData.paymentMethod === 'qrcode') && (
                  <div className="alert alert-success mt-3 mb-0 p-2 text-center">
                    <small>
                      <FaCheckCircle className="me-1" />
                      <strong>Ưu đãi:</strong> Miễn phí vận chuyển khi thanh toán trước
                    </small>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Thông tin hỗ trợ */}
          <div className="card shadow-sm mt-3 border-0">
            <div className="card-body">
              <h6 className="mb-3">📞 Cần hỗ trợ?</h6>
              <div className="d-flex align-items-center mb-2">
                <div className="bg-primary text-white rounded-circle p-2 me-3">
                  <FaBell />
                </div>
                <div>
                  <small className="text-muted d-block">Hotline hỗ trợ</small>
                  <strong className="text-primary">1900 1234</strong>
                </div>
              </div>
              <div className="d-flex align-items-center">
                <div className="bg-success text-white rounded-circle p-2 me-3">
                  <FaInfoCircle />
                </div>
                <div>
                  <small className="text-muted d-block">Thời gian làm việc</small>
                  <strong>8:00 - 22:00 (T2 - CN)</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;