import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ApiService from '../services/api';
import { useAuth } from '../services/auth';
import '../styles/BookList.css';

function BookList() {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    genre: '',
    search: ''
  });
  
  const { user } = useAuth();

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    filterBooks();
  }, [books, filters]);

  const fetchBooks = async () => {
  try {
    setLoading(true);
    const response = await ApiService.getBooks();

    // Extract the data array
    const rawBooks = response.data.data || [];

    // Transform DynamoDB style objects to normal JS objects
    const booksArray = rawBooks.map(book => ({
      bookId: book.bookId.S,
      title: book.title.S,
      author: book.author.S,
      genre: book.genre.S,
      description: book.description.S,
      imageUrl: book.imageUrl.S,
      averageRating: book.averageRating.N,
      reviewCount: book.reviewCount.N,
      stock: book.stock.N,
      price: book.price.N,
    }));

    setBooks(booksArray);
    console.log("📚 Transformed Books from API:", booksArray);

  } catch (err) {
    setError('Failed to load books');
    console.error('Error fetching books:', err);
  } finally {
    setLoading(false);
  }
};


  const filterBooks = () => {
    let filtered = books;

    if (filters.genre) {
      filtered = filtered.filter(book => 
        book.genre.toLowerCase() === filters.genre.toLowerCase()
      );
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(book =>
        book.title.toLowerCase().includes(searchLower) ||
        book.author.toLowerCase().includes(searchLower) ||
        book.genre.toLowerCase().includes(searchLower)
      );
    }

    setFilteredBooks(filtered);
  };

  const handleAddToCart = async (bookId) => {
    if (!user) {
      alert('Please login to add books to cart');
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

  const genres = Array.isArray(books)
  ? [...new Set(books.map(book => book.genre))]
  : [];


  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading books...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h3>Error Loading Books</h3>
        <p>{error}</p>
        <button onClick={fetchBooks} className="btn btn-primary">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="book-list-container">
      <div className="book-list-header">
        <h1>Discover Your Next Favorite Book</h1>
        <p>Browse our collection of amazing books</p>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by title, author, or genre..."
            value={filters.search}
            onChange={(e) => setFilters({...filters, search: e.target.value})}
            className="search-input"
          />
        </div>
        
        <div className="filter-controls">
          <select
            value={filters.genre}
            onChange={(e) => setFilters({...filters, genre: e.target.value})}
            className="form-select"
          >
            <option value="">All Genres</option>
            {genres.map(genre => (
              <option key={genre} value={genre}>{genre}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Books Grid */}
      <div className="books-grid">
        {Array.isArray(filteredBooks) && filteredBooks.map((book) => (
          <div key={book.bookId} className="book-card">
            <div className="book-image">
              {book.imageUrl ? (
                <img src={book.imageUrl} alt={book.title} />
              ) : (
                <div className="book-image-placeholder">📖</div>
              )}
            </div>

            <div className="book-content">
              <h3 className="book-title">{book.title}</h3>
              <p className="book-author">by {book.author}</p>
              <p className="book-genre">{book.genre}</p>
              <p className="book-description">
                {book.description?.substring(0, 100)}...
              </p>

              <div className="book-meta">
                <div className="book-rating">
                  ⭐ {book.averageRating || 'No ratings'}
                  {book.reviewCount && (
                    <span className="review-count">({book.reviewCount})</span>
                  )}
                </div>
                <div className="book-stock">
                  {book.stock > 0 ? (
                    <span className="in-stock">{book.stock} in stock</span>
                  ) : (
                    <span className="out-of-stock">Out of stock</span>
                  )}
                </div>
              </div>

              <div className="book-actions">
                <Link to={`/book/${book.bookId}`} className="btn btn-secondary">
                  View Details
                </Link>
                <button
                  onClick={() => handleAddToCart(book.bookId)}
                  disabled={book.stock === 0 || !user}
                  className="btn btn-primary"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <div className="no-books">
          <h3>No books found</h3>
          <p>Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}

export default BookList;
