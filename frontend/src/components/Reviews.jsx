import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ApiService from '../services/api.jsx';
import { useAuth } from '../services/auth.jsx';
import '../styles/Reviews.css';

function Reviews() {
  const { bookId } = useParams();
  const [reviews, setReviews] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState(bookId || '');
  const { user } = useAuth();

  useEffect(() => {
    fetchBooks();
    if (bookId) {
      fetchReviews(bookId);
    }
  }, [bookId]);

  const fetchBooks = async () => {
    try {
      const bookData = await ApiService.getBooks();
      setBooks(bookData);
    } catch (err) {
      console.error('Error fetching books:', err);
    }
  };

  const fetchReviews = async (bookId) => {
    try {
      setLoading(true);
      const reviewsData = await ApiService.getBookReviews(bookId);
      setReviews(reviewsData.reviews || []);
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookChange = (e) => {
    const newBookId = e.target.value;
    setSelectedBook(newBookId);
    if (newBookId) {
      fetchReviews(newBookId);
    } else {
      setReviews([]);
    }
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'POSITIVE': return '#27ae60';
      case 'NEGATIVE': return '#e74c3c';
      case 'NEUTRAL': return '#f39c12';
      default: return '#7f8c8d';
    }
  };

  return (
    <div className="reviews-container">
      <div className="reviews-header">
        <h1>Book Reviews</h1>
        <p>Read what others think about our books</p>
      </div>

      <div className="book-selector">
        <select 
          value={selectedBook} 
          onChange={handleBookChange}
          className="form-select"
        >
          <option value="">Select a book to view reviews</option>
          {books.map(book => (
            <option key={book.bookId} value={book.bookId}>
              {book.title} by {book.author}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading reviews...</p>
        </div>
      ) : (
        <div className="reviews-content">
          {selectedBook ? (
            reviews.length > 0 ? (
              <div className="reviews-list">
                {reviews.map(review => (
                  <div key={review.reviewId} className="review-card">
                    <div className="review-header">
                      <div className="review-rating">
                        ⭐ {review.rating}/5
                      </div>
                      <div 
                        className="sentiment-badge"
                        style={{ backgroundColor: getSentimentColor(review.sentiment) }}
                      >
                        {review.sentiment}
                      </div>
                    </div>
                    
                    <p className="review-text">{review.reviewText}</p>
                    
                    {review.keyPhrases && review.keyPhrases.length > 0 && (
                      <div className="key-phrases">
                        <strong>Key phrases:</strong>
                        <div className="phrases-list">
                          {review.keyPhrases.map((phrase, index) => (
                            <span key={index} className="phrase-tag">
                              {phrase}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="review-meta">
                      <span className="review-date">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-reviews">
                <h3>No reviews yet</h3>
                <p>Be the first to review this book!</p>
              </div>
            )
          ) : (
            <div className="select-book-prompt">
              <h3>Select a book to view reviews</h3>
              <p>Choose a book from the dropdown above to see what readers think about it.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Reviews;