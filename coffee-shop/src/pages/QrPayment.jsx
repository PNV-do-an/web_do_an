// src/pages/QrPayment.jsx - PHIÊN BẢN ĐƠN GIẢN
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaQrcode, FaCheckCircle, FaMobileAlt, FaSync, FaArrowLeft, FaPrint, FaWhatsapp } from 'react-icons/fa';
import { toast } from 'react-toastify';

const QrPayment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [paymentStatus, setPaymentStatus] = useState('pending'); // pending, completed
  const [countdown, setCountdown] = useState(300); // 5 phút
  const [isChecking, setIsChecking] = useState(false);

  const orderInfo = location.state || {
    orderId: 'ORDER_' + Date.now().toString().slice(-8),
    total: 0
  };

  // Tạo QR Code URL cho VietQR
  const generateVietQR = () => {
    const bankAccount = '0123456789';
    const amount = orderInfo.total;
    const content = `COFFEE_${orderInfo.orderId?.substring(0, 8)}`;
    return `https://img.vietqr.io/image/vietcombank-${bankAccount}-compact.png?amount=${amount}&addInfo=${content}&accountName=COFFEE%20SHOP`;
  };

  // Countdown timer
  useEffect(() => {
    if (countdown > 0 && paymentStatus === 'pending') {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown, paymentStatus]);

  // Auto-check payment simulation
  const checkPayment = () => {
    setIsChecking(true);
    
    // Simulate API call
    setTimeout(() => {
      // For demo: 70% success rate
      const isSuccess = Math.random() > 0.3;
      
      if (isSuccess) {
        setPaymentStatus('completed');
        
        toast.success(
          <div className="p-3">
            <div className="d-flex align-items-center mb-2">
              <FaCheckCircle className="text-success me-3" size={32} />
              <div>
                <h5 className="mb-1 fw-bold">✅ Thanh toán thành công!</h5>
                <p className="mb-0">Đơn hàng đã được xác nhận</p>
              </div>
            </div>
          </div>,
          { position: "top-center", autoClose: 5000 }
        );

        // Redirect after 3 seconds
        setTimeout(() => {
          navigate(`/order-confirmation/${orderInfo.orderId}`);
        }, 3000);
      } else {
        toast.info('⏳ Chưa nhận được thanh toán. Vui lòng thử lại!');
      }
      
      setIsChecking(false);
    }, 2000);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleManualConfirm = () => {
    setPaymentStatus('completed');
    toast.success('Đã xác nhận thanh toán!');
    setTimeout(() => {
      navigate(`/order-confirmation/${orderInfo.orderId}`);
    }, 2000);
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-lg">
            <div className="card-header bg-success text-white">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h3 className="mb-0">
                    <FaQrcode className="me-3" />
                    Thanh toán QR Code
                  </h3>
                  <small>Quét mã để thanh toán nhanh chóng</small>
                </div>
                <button 
                  className="btn btn-light"
                  onClick={() => navigate(-1)}
                >
                  <FaArrowLeft className="me-2" />
                  Quay lại
                </button>
              </div>
            </div>
            
            <div className="card-body p-4 p-md-5">
              {/* Thông tin đơn hàng */}
              <div className="row mb-5">
                <div className="col-md-6 mb-4">
                  <div className="card">
                    <div className="card-body">
                      <h6>Thông tin đơn hàng</h6>
                      <div className="mb-3">
                        <small className="text-muted d-block">Mã đơn hàng</small>
                        <strong className="text-primary">#{orderInfo.orderId?.substring(0, 8)}</strong>
                      </div>
                      <div className="mb-3">
                        <small className="text-muted d-block">Số tiền thanh toán</small>
                        <h3 className="text-danger">{formatPrice(orderInfo.total)}</h3>
                      </div>
                      <div>
                        <small className="text-muted d-block">Nội dung chuyển khoản</small>
                        <code className="bg-light px-2 py-1 rounded d-block">
                          COFFEE_{orderInfo.orderId?.substring(0, 8)}
                        </code>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="col-md-6 mb-4">
                  <div className="card">
                    <div className="card-body">
                      <h6>Hướng dẫn thanh toán</h6>
                      <ol className="mb-0 small">
                        <li className="mb-2">Mở app ngân hàng hoặc ví điện tử</li>
                        <li className="mb-2">Chọn tính năng "Quét mã QR"</li>
                        <li className="mb-2">Hướng camera vào mã QR bên cạnh</li>
                        <li className="mb-2">Kiểm tra thông tin và xác nhận</li>
                        <li>Nhấn "Kiểm tra thanh toán" sau khi hoàn tất</li>
                      </ol>
                    </div>
                  </div>
                </div>
              </div>

              {/* QR Code Display */}
              <div className="text-center mb-5">
                <div className="card border-0">
                  <div className="card-body p-4">
                    <div className="mb-4">
                      <FaQrcode size={60} className="text-success mb-3" />
                      <h4>Mã QR thanh toán</h4>
                      <p className="text-muted">Quét mã bằng app ngân hàng của bạn</p>
                    </div>
                    
                    {/* QR Code Image */}
                    <div className="mb-4">
                      <div className="border rounded p-3 d-inline-block bg-white shadow">
                        <img 
                          src={generateVietQR()} 
                          alt="QR Code" 
                          style={{ width: '250px', height: '250px' }}
                          className="img-fluid"
                        />
                      </div>
                    </div>
                    
                    <div className="text-muted small">
                      <FaMobileAlt className="me-2" />
                      Hỗ trợ: Vietcombank, Techcombank, BIDV, MB Bank, Momo, ZaloPay,...
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Status */}
              <div className="card mb-4">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="mb-1">Trạng thái thanh toán</h6>
                      <small className="text-muted">
                        {paymentStatus === 'completed' 
                          ? '✅ Đã thanh toán thành công' 
                          : `⏳ Đang chờ thanh toán (${formatTime(countdown)})`}
                      </small>
                    </div>
                    
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-outline-primary"
                        onClick={checkPayment}
                        disabled={isChecking || paymentStatus === 'completed'}
                      >
                        <FaSync className={`me-2 ${isChecking ? 'fa-spin' : ''}`} />
                        {isChecking ? 'Đang kiểm tra...' : 'Kiểm tra thanh toán'}
                      </button>
                      
                      <button
                        className="btn btn-success"
                        onClick={handleManualConfirm}
                        disabled={paymentStatus === 'completed'}
                      >
                        <FaCheckCircle className="me-2" />
                        Đã thanh toán xong
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="d-flex justify-content-between mt-4">
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => navigate(-1)}
                  >
                    <FaArrowLeft className="me-2" />
                    Quay lại
                  </button>
                  <button
                    className="btn btn-outline-primary"
                    onClick={() => window.print()}
                  >
                    <FaPrint className="me-2" />
                    In hướng dẫn
                  </button>
                </div>
                
                <div className="d-flex gap-2">
                  <a 
                    href={`https://wa.me/84909123456?text=Tôi cần hỗ trợ thanh toán QR đơn hàng ${orderInfo.orderId}`}
                    className="btn btn-success"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaWhatsapp className="me-2" />
                    Chat hỗ trợ
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QrPayment;