// src/services/orderService.jsx
import {
  collection,
  query,
  orderBy,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  where,
  serverTimestamp,
  Timestamp,
  limit
} from 'firebase/firestore';
import { db } from './firebase';

// Tạo đơn hàng mới
export const createOrder = async (orderData) => {
  try {
    const orderWithTimestamp = {
      ...orderData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, 'orders'), orderWithTimestamp);
    return docRef.id;
  } catch (error) {
    console.error('Lỗi tạo đơn hàng:', error);
    throw error;
  }
};

// Lấy đơn hàng theo user ID
export const getUserOrders = async (userId) => {
  try {
    const ordersRef = collection(db, 'orders');
    const q = query(
      ordersRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const orders = [];
    
    querySnapshot.forEach((doc) => {
      orders.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return orders;
  } catch (error) {
    console.error('Lỗi lấy đơn hàng:', error);
    throw error;
  }
};

// Lấy tất cả đơn hàng (admin)
export const getAllOrders = async () => {
  try {
    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, orderBy('createdAt', 'desc'));
    
    const querySnapshot = await getDocs(q);
    const orders = [];
    
    querySnapshot.forEach((doc) => {
      orders.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return orders;
  } catch (error) {
    console.error('Lỗi lấy tất cả đơn hàng:', error);
    throw error;
  }
};

// Lấy đơn hàng theo ID
export const getOrderById = async (orderId) => {
  try {
    const docRef = doc(db, 'orders', orderId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      };
    } else {
      throw new Error('Không tìm thấy đơn hàng');
    }
  } catch (error) {
    console.error('Lỗi lấy đơn hàng:', error);
    throw error;
  }
};

// Cập nhật trạng thái đơn hàng
export const updateOrderStatus = async (orderId, status) => {
  try {
    const updateData = {
      status: status,
      updatedAt: serverTimestamp()
    };
    
    if (status === 'shipping') {
      updateData.shippedAt = serverTimestamp();
    } else if (status === 'delivered') {
      updateData.deliveredAt = serverTimestamp();
    } else if (status === 'cancelled') {
      updateData.cancelledAt = serverTimestamp();
    }
    
    const docRef = doc(db, 'orders', orderId);
    await updateDoc(docRef, updateData);
    
    return true;
  } catch (error) {
    console.error('Lỗi cập nhật đơn hàng:', error);
    throw error;
  }
};

// Lấy thống kê đơn hàng
export const getOrderStats = async () => {
  try {
    const ordersRef = collection(db, 'orders');
    const ordersSnapshot = await getDocs(ordersRef);
    
    let totalOrders = 0;
    let totalRevenue = 0;
    let pendingOrders = 0;
    
    ordersSnapshot.forEach((doc) => {
      const order = doc.data();
      totalOrders++;
      totalRevenue += order.total || 0;
      
      if (order.status === 'pending') {
        pendingOrders++;
      }
    });
    
    // Lấy tổng số user (đơn giản - đếm số user trong orders)
    const usersSet = new Set();
    ordersSnapshot.forEach((doc) => {
      const order = doc.data();
      if (order.userId) {
        usersSet.add(order.userId);
      }
    });
    
    return {
      totalOrders,
      totalRevenue,
      totalUsers: usersSet.size,
      pendingOrders
    };
  } catch (error) {
    console.error('Lỗi lấy thống kê:', error);
    throw error;
  }
};

// Lấy đơn hàng gần đây
export const getRecentOrders = async (limit = 10) => {
  try {
    const ordersRef = collection(db, 'orders');
    const q = query(
      ordersRef,
      orderBy('createdAt', 'desc'),
      limit(limit)
    );
    
    const querySnapshot = await getDocs(q);
    const orders = [];
    
    querySnapshot.forEach((doc) => {
      orders.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return orders;
  } catch (error) {
    console.error('Lỗi lấy đơn hàng gần đây:', error);
    throw error;
  }
};
// src/services/orderService.js
// THÊM HÀM NÀY VÀO CUỐI FILE

export const getTopProducts = async (limit = 5) => {
  try {
    // Mock data tạm thời
    const mockProducts = [
      { id: 1, name: 'Áo thun nam cao cấp', totalSold: 150 },
      { id: 2, name: 'Quần jean nữ slim fit', totalSold: 120 },
      { id: 3, name: 'Giày thể thao chạy bộ', totalSold: 95 },
      { id: 4, name: 'Túi xách da thật', totalSold: 80 },
      { id: 5, name: 'Đồng hồ thông minh', totalSold: 65 }
    ];
    
    return mockProducts.slice(0, limit);
  } catch (error) {
    console.error('Error getting top products:', error);
    throw error;
  }
};
export const deleteOrder = async (orderId) => {
  try {
    await deleteDoc(doc(db, 'orders', orderId));
    return true;
  } catch (error) {
    console.error('Lỗi xóa đơn hàng:', error);
    throw error;
  }
};

export default {
  getOrderStats,
  getRecentOrders,
  getTopProducts,
  createOrder,
  getUserOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder
};