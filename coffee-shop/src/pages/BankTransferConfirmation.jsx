// src/pages/BankTransferConfirmation.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaUniversity, FaUpload, FaCheckCircle, FaReceipt, FaPrint, FaWhatsapp } from 'react-icons/fa';
import { toast } from 'react-toastify';

const BankTransferConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [uploadedImage, setUploadedImage] = useState(null);
  const [transferInfo, setTransferInfo] = useState({
    bankName: 'Vietcombank',
    accountNumber: '0123 4567 890',
    transferAmount: location.state?.total || 0,
    transferDate: new Date().toISOString().split('T')[0],
    reference: `COFFEE_${Date.now().toString().slice(-6)}`,
    customerPhone: ''
  });

  const banks = [
    { 
      name: 'Vietcombank', 
      account: '0123 4567 890', 
      holder: 'COFFEE SHOP COMPANY', 
      branch: 'HCM',
      color: 'primary'
    },
    { 
      name: 'Techcombank', 
      account: '0987 6543 210', 
      holder: 'COFFEE SHOP COMPANY', 
      branch: 'HN',
      color: 'success'
    },
    { 
      name: 'BIDV', 
      account: '1234 5678 901', 
      holder: 'COFFEE SHOP COMPANY', 
      branch: 'HCM',
      color: 'warning'
    },
    { 
      name: 'MB Bank', 
      account: '0987 1234 567', 
      holder: 'COFFEE SHOP COMPANY', 
      branch: 'HN',
      color: 'info'
    }
  ];

  const selectedBank = banks.find(bank => bank.name === transferInfo.bankName) || banks[0];

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Ảnh không được vượt quá 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!uploadedImage) {
      toast.error('Vui lòng upload ảnh biên lai chuyển khoản');
      return;
    }

    // Lưu thông tin chuyển khoản
    const transferData = {
      ...transferInfo,
      receiptImage: uploadedImage,
      submittedAt: new Date().toISOString(),
      orderId: location.state?.orderId
    };
    
    localStorage.setItem('bankTransferInfo', JSON.stringify(transferData));

    // Hiển thị thông báo thành công
    toast.success(
      <div className="p-3">
        <div className="d-flex align-items-center mb-3">
          <FaCheckCircle className="text-success me-3" size={32} />
          <div>
            <h5 className="mb-1 fw-bold">✅ Đã gửi xác nhận!</h5>
            <p className="mb-0">Ảnh biên lai đã được gửi thành công</p>
          </div>
        </div>
        <div className="bg-light p-3 rounded">
          <small className="text-muted d-block">
            Chúng tôi sẽ xác nhận thanh toán trong vòng 24h
          </small>
          <small className="text-muted d-block mt-1">
            Bạn có thể theo dõi đơn hàng trong mục "Đơn hàng của tôi"
          </small>
        </div>
      </div>,
      {
        position: "top-center",
        autoClose: 5000
      }
    );

    // Chuyển về trang orders sau 2 giây
    setTimeout(() => {
      navigate('/orders');
    }, 2000);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="card shadow-lg border-0">
            <div className="card-header bg-primary text-white py-4">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h3 className="mb-0">
                    <FaUniversity className="me-3" />
                    Xác nhận chuyển khoản ngân hàng
                  </h3>
                  <small className="opacity-75">
                    Vui lòng hoàn thành các bước dưới đây để xác nhận thanh toán
                  </small>
                </div>
                <button 
                  className="btn btn-light"
                  onClick={() => navigate(-1)}
                >
                  Quay lại
                </button>
              </div>
            </div>
            
            <div className="card-body p-4 p-md-5">
              {/* Bước 1: Thông tin ngân hàng */}
              <div className="mb-5">
                <div className="d-flex align-items-center mb-4">
                  <div className="bg-primary text-white rounded-circle p-3 me-3">
                    <span className="fw-bold">1</span>
                  </div>
                  <div>
                    <h4 className="mb-0">Chọn ngân hàng chuyển khoản</h4>
                    <p className="text-muted mb-0">Vui lòng chuyển khoản vào một trong các tài khoản sau</p>
                  </div>
                </div>
                
                <div className="row g-4">
                  {banks.map((bank, index) => (
                    <div key={index} className="col-md-6">
                      <div 
                        className={`card h-100 cursor-pointer ${transferInfo.bankName === bank.name ? 'border-primary border-3' : 'border'}`}
                        onClick={() => setTransferInfo({...transferInfo, bankName: bank.name})}
                      >
                        <div className="card-body">
                          <div className="d-flex align-items-start">
                            <div className={`bg-${bank.color} text-white rounded-circle p-3 me-3`}>
                              <FaUniversity />
                            </div>
                            <div className="flex-fill">
                              <div className="form-check mb-2">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  name="bankName"
                                  id={`bank-${index}`}
                                  value={bank.name}
                                  checked={transferInfo.bankName === bank.name}
                                  onChange={(e) => setTransferInfo({...transferInfo, bankName: e.target.value})}
                                />
                                <label className="form-check-label fw-bold" htmlFor={`bank-${index}`}>
                                  {bank.name}
                                </label>
                              </div>
                              
                              <div className="row">
                                <div className="col-6">
                                  <small className="text-muted d-block">Số tài khoản</small>
                                  <div className="fw-bold h5 text-danger">{bank.account}</div>
                                </div>
                                <div className="col-6">
                                  <small className="text-muted d-block">Chủ tài khoản</small>
                                  <div className="fw-bold">{bank.holder}</div>
                                </div>
                              </div>
                              
                              <div className="mt-2">
                                <small className="text-muted d-block">Chi nhánh</small>
                                <div className="fw-bold">{bank.branch}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bước 2: Thông tin chuyển khoản */}
              <div className="mb-5">
                <div className="d-flex align-items-center mb-4">
                  <div className="bg-primary text-white rounded-circle p-3 me-3">
                    <span className="fw-bold">2</span>
                  </div>
                  <div>
                    <h4 className="mb-0">Thông tin chuyển khoản của bạn</h4>
                    <p className="text-muted mb-0">Vui lòng cung cấp thông tin chuyển khoản chính xác</p>
                  </div>
                </div>
                
                <div className="row g-4">
                  <div className="col-md-6">
                    <div className="card h-100">
                      <div className="card-header bg-light">
                        <strong>Thông tin cần chuyển</strong>
                      </div>
                      <div className="card-body">
                        <div className="mb-3">
                          <label className="form-label fw-bold">Số tiền cần chuyển</label>
                          <div className="input-group input-group-lg">
                            <span className="input-group-text">₫</span>
                            <input
                              type="number"
                              className="form-control"
                              value={transferInfo.transferAmount}
                              onChange={(e) => setTransferInfo({...transferInfo, transferAmount: e.target.value})}
                            />
                          </div>
                          <div className="mt-3 text-center">
                            <div className="display-6 text-danger fw-bold">
                              {formatPrice(transferInfo.transferAmount)}
                            </div>
                            <small className="text-muted">Số tiền chính xác cần chuyển</small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="card h-100">
                      <div className="card-header bg-light">
                        <strong>Thông tin khác</strong>
                      </div>
                      <div className="card-body">
                        <div className="mb-3">
                          <label className="form-label">Ngày chuyển khoản</label>
                          <input
                            type="date"
                            className="form-control form-control-lg"
                            value={transferInfo.transferDate}
                            onChange={(e) => setTransferInfo({...transferInfo, transferDate: e.target.value})}
                          />
                        </div>
                        
                        <div className="mb-3">
                          <label className="form-label">Nội dung chuyển khoản</label>
                          <input
                            type="text"
                            className="form-control form-control-lg"
                            value={transferInfo.reference}
                            onChange={(e) => setTransferInfo({...transferInfo, reference: e.target.value})}
                            placeholder="VD: 0901234567_NGUYENVANA"
                          />
                          <small className="text-muted">
                            Vui lòng ghi đúng nội dung để dễ dàng xác nhận
                          </small>
                        </div>
                        
                        <div className="mb-3">
                          <label className="form-label">Số điện thoại của bạn</label>
                          <input
                            type="tel"
                            className="form-control form-control-lg"
                            value={transferInfo.customerPhone}
                            onChange={(e) => setTransferInfo({...transferInfo, customerPhone: e.target.value})}
                            placeholder="0901234567"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bước 3: Upload biên lai */}
              <div className="mb-5">
                <div className="d-flex align-items-center mb-4">
                  <div className="bg-primary text-white rounded-circle p-3 me-3">
                    <span className="fw-bold">3</span>
                  </div>
                  <div>
                    <h4 className="mb-0">Upload biên lai chuyển khoản</h4>
                    <p className="text-muted mb-0">Chụp ảnh biên lai và upload lên hệ thống</p>
                  </div>
                </div>
                
                <div className="card">
                  <div className="card-body">
                    <div className="text-center p-4">
                      {uploadedImage ? (
                        <div>
                          <img
                            src={uploadedImage}
                            alt="Biên lai"
                            className="img-fluid rounded shadow mb-4"
                            style={{ maxHeight: '400px' }}
                          />
                          <div className="d-flex justify-content-center gap-3">
                            <button
                              className="btn btn-outline-danger"
                              onClick={() => setUploadedImage(null)}
                            >
                              Xóa ảnh
                            </button>
                            <button
                              className="btn btn-outline-primary"
                              onClick={() => document.getElementById('receiptUpload').click()}
                            >
                              Chọn ảnh khác
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="py-5">
                          <FaReceipt size={80} className="text-muted mb-4" />
                          <h5 className="mb-3">Chưa có ảnh biên lai</h5>
                          <p className="text-muted mb-4">
                            Vui lòng chụp ảnh biên lai chuyển khoản từ app ngân hàng
                          </p>
                          <label htmlFor="receiptUpload" className="btn btn-primary btn-lg">
                            <FaUpload className="me-2" />
                            Chọn ảnh biên lai
                          </label>
                          <input
                            id="receiptUpload"
                            type="file"
                            className="d-none"
                            accept="image/*"
                            onChange={handleImageUpload}
                          />
                          <div className="mt-3">
                            <small className="text-muted">
                              Chấp nhận: JPG, PNG, GIF • Tối đa: 5MB
                            </small>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Thông tin quan trọng */}
              <div className="alert alert-warning">
                <div className="d-flex">
                  <FaCheckCircle className="me-3 mt-1" size={24} />
                  <div>
                    <h5 className="alert-heading">Thông tin quan trọng cần lưu ý:</h5>
                    <ol className="mb-0">
                      <li>Vui lòng chuyển khoản <strong>chính xác số tiền</strong> {formatPrice(transferInfo.transferAmount)}</li>
                      <li>Ghi đúng nội dung chuyển khoản: <code className="bg-light px-2 py-1 rounded">{transferInfo.reference}</code></li>
                      <li>Chụp ảnh biên lai <strong>rõ ràng, đầy đủ thông tin</strong></li>
                      <li>Đơn hàng sẽ được xử lý sau <strong>24-48 giờ</strong> kể từ khi xác nhận thanh toán</li>
                      <li>Liên hệ hỗ trợ qua Zalo/WhatsApp: <strong>0909 123 456</strong> nếu cần hỗ trợ</li>
                    </ol>
                  </div>
                </div>
              </div>

              {/* Nút hành động */}
              <div className="d-flex justify-content-between mt-5">
                <div className="d-flex gap-3">
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => navigate(-1)}
                  >
                    Quay lại
                  </button>
                  <button
                    className="btn btn-outline-primary"
                    onClick={handlePrint}
                  >
                    <FaPrint className="me-2" />
                    In hướng dẫn
                  </button>
                </div>
                
                <div className="d-flex gap-3">
                  <a 
                    href={`https://wa.me/84909123456?text=Tôi cần hỗ trợ chuyển khoản đơn hàng ${location.state?.orderId}`}
                    className="btn btn-success"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaWhatsapp className="me-2" />
                    Chat hỗ trợ
                  </a>
                  <button
                    className="btn btn-primary btn-lg px-5"
                    onClick={handleSubmit}
                    disabled={!uploadedImage}
                  >
                    <FaCheckCircle className="me-2" />
                    {!uploadedImage ? 'Vui lòng upload biên lai' : 'Gửi xác nhận'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankTransferConfirmation;