// src/services/notificationService.js
import { collection, addDoc } from 'firebase/firestore';
import { db } from './firebase';

export const createOrderNotification = async (userId, orderId, orderData) => {
  try {
    const notification = {
      userId,
      orderId,
      title: '🎉 Đặt hàng thành công!',
      message: `Đơn hàng #${orderId.slice(-6)} của bạn đã được đặt thành công. Tổng tiền: ${orderData.total.toLocaleString('vi-VN')}₫`,
      type: 'order_success',
      isRead: false,
      isDeleted: false,
      createdAt: new Date(),
      icon: '🎉'
    };

    await addDoc(collection(db, 'notifications'), notification);
    return true;
  } catch (error) {
    console.error('Lỗi tạo thông báo:', error);
    return false;
  }
};

export const createOrderStatusNotification = async (userId, orderId, status) => {
  try {
    const statusMessages = {
      'processing': '⏳ Đang xử lý',
      'confirmed': '✅ Đã xác nhận',
      'shipping': '🚚 Đang giao hàng',
      'delivered': '🎊 Đã giao hàng',
      'cancelled': '❌ Đã hủy'
    };

    const notification = {
      userId,
      orderId,
      title: '📦 Cập nhật đơn hàng',
      message: `Đơn hàng #${orderId.slice(-6)}: ${statusMessages[status] || 'Cập nhật trạng thái'}`,
      type: 'order_update',
      isRead: false,
      isDeleted: false,
      createdAt: new Date(),
      icon: '📦'
    };

    await addDoc(collection(db, 'notifications'), notification);
    return true;
  } catch (error) {
    console.error('Lỗi tạo thông báo:', error);
    return false;
  }
};