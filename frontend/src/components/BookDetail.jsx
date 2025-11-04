import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ApiService from '../services/api.js';
import { useAuth } from '../services/auth.jsx';
import '../styles/BookDetail.css';

function BookDetail() {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBookDetails();
  }, [bookId]);

  const fetchBookDetails = async () => {
    try {
      setLoading(true);

      // Fetch book and reviews in parallel
      const [bookData, reviewsData] = await Promise.all([
        ApiService.getBookById(bookId),
        ApiService.getBookReviews(bookId)
      ]);

      console.log("📘 Raw bookData:", bookData);

      let transformedBook = bookData;

      // Handle DynamoDB response shapes
      if (bookData?.Item) {
        const item = bookData.Item;
        transformedBook = {
          bookId: item.bookId?.S || '',
          title: item.title?.S || '',
          author: item.author?.S || '',
          genre: item.genre?.S || '',
          description: item.description?.S || '',
          price: item.price?.N || '',
          stock: item.stock?.N || '',
          imageUrl: item.imageUrl?.S || '',
          averageRating: item.averageRating?.N || '',
          reviewCount: item.reviewCount?.N || '',
          createdAt: item.createdAt?.S || '',
          updatedAt: item.updatedAt?.S || ''
        };
      } else if (bookData?.data) {
        // Some APIs wrap result in "data"
        const item = bookData.data;
        transformedBook = {
          bookId: item.bookId?.S || '',
          title: item.title?.S || '',
          author: item.author?.S || '',
          genre: item.genre?.S || '',
          description: item.description?.S || '',
          price: item.price?.N || '',
          stock: item.stock?.N || '',
          imageUrl: item.imageUrl?.S || '',
          averageRating: item.averageRating?.N || '',
          reviewCount: item.reviewCount?.N || '',
          createdAt: item.createdAt?.S || '',
          updatedAt: item.updatedAt?.S || ''
        };
      }

      console.log("✅ Transformed Book:", transformedBook);
      setBook(transformedBook);
      setReviews(reviewsData.reviews || []);

    } catch (err) {
      setError('Failed to load book details');
      console.error('Error fetching book:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      alert('Please login to add books to cart');
      navigate('/login');
      return;
    }

    try {
      await ApiService.addToCart(bookId);
      alert('Book added to cart successfully!');
    } catch (err) {
      alert('Failed to add book to cart');
      console.error('Error adding to cart:', err);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading book details...</p>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="error-container">
        <h3>Book Not Found</h3>
        <p>{error || 'The book you are looking for does not exist.'}</p>
        <button onClick={() => navigate('/')} className="btn btn-primary">
          Back to Books
        </button>
      </div>
    );
  }

  return (
    <div className="book-detail-container">
      <button onClick={() => navigate('/')} className="btn btn-secondary back-btn">
        ← Back to Books
      </button>

      <div className="book-detail">
        <div className="book-image-section">
          <div className="book-image-large">
            {book.imageUrl ? (
              <img src={book.imageUrl} alt={book.title} />
            ) : (
              <div className="book-image-placeholder-large">
                📖
              </div>
            )}
          </div>
        </div>

        <div className="book-info-section">
          <h1 className="book-title-large">{book.title}</h1>
          <h2 className="book-author-large">by {book.author}</h2>
          <p className="book-genre-large">{book.genre}</p>

          <div className="book-rating-large">
            ⭐ {book.averageRating || 'No ratings'}
            <span className="review-count">({reviews.length} reviews)</span>
          </div>

          <p className="book-description-large">{book.description}</p>

          <div className="book-meta-large">
            <div className="price-stock">
              <span className="book-price">${book.price || 'N/A'}</span>
              <span
                className={`stock-status ${
                  book.stock > 0 ? 'in-stock' : 'out-of-stock'
                }`}
              >
                {book.stock > 0 ? `${book.stock} in stock` : 'Out of stock'}
              </span>
            </div>
          </div>

          <div className="book-actions-large">
            <button
              onClick={handleAddToCart}
              disabled={book.stock === 0 || !user}
              className="btn btn-primary add-to-cart-large"
            >
              {book.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookDetail;
