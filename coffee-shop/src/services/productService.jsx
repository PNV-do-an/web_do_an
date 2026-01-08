// src/services/productService.jsx
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
  serverTimestamp
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebase';

// Lấy tất cả sản phẩm
export const getProducts = async () => {
  try {
    const productsRef = collection(db, 'products');
    const q = query(productsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const products = [];
    querySnapshot.forEach((doc) => {
      products.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return products;
  } catch (error) {
    console.error('Lỗi lấy sản phẩm:', error);
    throw error;
  }
};

// Lấy sản phẩm theo ID
export const getProductById = async (id) => {
  try {
    const docRef = doc(db, 'products', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      };
    } else {
      throw new Error('Không tìm thấy sản phẩm');
    }
  } catch (error) {
    console.error('Lỗi lấy sản phẩm:', error);
    throw error;
  }
};

// Thêm sản phẩm mới
export const addProduct = async (productData, imageFile) => {
  try {
    let imageUrl = productData.image;
    
    // Upload ảnh nếu có file mới
    if (imageFile) {
      const storageRef = ref(storage, `products/${Date.now()}_${imageFile.name}`);
      await uploadBytes(storageRef, imageFile);
      imageUrl = await getDownloadURL(storageRef);
    }
    
    const productWithTimestamp = {
      ...productData,
      image: imageUrl,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, 'products'), productWithTimestamp);
    return { id: docRef.id, ...productWithTimestamp };
  } catch (error) {
    console.error('Lỗi thêm sản phẩm:', error);
    throw error;
  }
};

// Cập nhật sản phẩm
export const updateProduct = async (id, productData, imageFile = null) => {
  try {
    let imageUrl = productData.image;
    
    // Upload ảnh mới nếu có
    if (imageFile) {
      const storageRef = ref(storage, `products/${Date.now()}_${imageFile.name}`);
      await uploadBytes(storageRef, imageFile);
      imageUrl = await getDownloadURL(storageRef);
    }
    
    const productWithTimestamp = {
      ...productData,
      image: imageUrl,
      updatedAt: serverTimestamp()
    };
    
    const docRef = doc(db, 'products', id);
    await updateDoc(docRef, productWithTimestamp);
    
    return { id, ...productWithTimestamp };
  } catch (error) {
    console.error('Lỗi cập nhật sản phẩm:', error);
    throw error;
  }
};

// Xóa sản phẩm
export const deleteProduct = async (id) => {
  try {
    await deleteDoc(doc(db, 'products', id));
    return true;
  } catch (error) {
    console.error('Lỗi xóa sản phẩm:', error);
    throw error;
  }
};

// Lấy sản phẩm theo danh mục
export const getProductsByCategory = async (category) => {
  try {
    const productsRef = collection(db, 'products');
    const q = query(
      productsRef,
      where('category', '==', category),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const products = [];
    
    querySnapshot.forEach((doc) => {
      products.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return products;
  } catch (error) {
    console.error('Lỗi lấy sản phẩm theo danh mục:', error);
    throw error;
  }
};

// Lấy sản phẩm bán chạy
export const getTopProducts = async (limit = 10) => {
  try {
    const productsRef = collection(db, 'products');
    const q = query(
      productsRef,
      where('featured', '==', true),
      orderBy('createdAt', 'desc'),
      limit(limit)
    );
    
    const querySnapshot = await getDocs(q);
    const products = [];
    
    querySnapshot.forEach((doc) => {
      products.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return products;
  } catch (error) {
    console.error('Lỗi lấy sản phẩm bán chạy:', error);
    throw error;
  }
};