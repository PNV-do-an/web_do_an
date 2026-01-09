import { 
  collection, 
  query, 
  where, 
  orderBy, 
  getDocs, 
  addDoc, 
  updateDoc, 
  doc, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';

const reviewsCollection = collection(db, 'reviews');

export const getReviewsByProductId = async (productId) => {
  try {
    const q = query(
      reviewsCollection,
      where('productId', '==', productId),
      where('isDeleted', '==', false),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    const reviews = [];
    let totalRating = 0;
    
    snapshot.forEach(doc => {
      const review = { id: doc.id, ...doc.data() };
      reviews.push(review);
      totalRating += review.rating;
    });
    
    const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;
    
    return { reviews, averageRating };
  } catch (error) {
    console.error('Error getting reviews:', error);
    throw error;
  }
};

export const addReview = async (reviewData) => {
  try {
    const reviewWithTimestamp = {
      ...reviewData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      isDeleted: false,
      helpfulCount: 0
    };
    
    const docRef = await addDoc(reviewsCollection, reviewWithTimestamp);
    return { id: docRef.id, ...reviewWithTimestamp };
  } catch (error) {
    console.error('Error adding review:', error);
    throw error;
  }
};

export const updateReviewHelpful = async (reviewId, userId, newCount) => {
  try {
    const reviewRef = doc(db, 'reviews', reviewId);
    await updateDoc(reviewRef, {
      helpfulCount: newCount
    });
    
    // Lưu vào collection phản hồi hữu ích (optional)
    const helpfulRef = collection(db, 'reviewHelpful');
    await addDoc(helpfulRef, {
      reviewId,
      userId,
      createdAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating helpful count:', error);
    throw error;
  }
};