import React, { useState, useEffect } from 'react';
import DemoApiService from '../services/demoApi';
import '../styles/AdminDashboard.css';

function DemoAdminDashboard() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      const bookData = await DemoApiService.getBooks();
      setBooks(bookData);
    } catch (error) {
      console.error('Error loading books:', error);
      // For demo, create some sample data if API fails
      setBooks([
        {
          bookId: 'demo-1',
          title: 'Sample Book 1',
          author: 'Demo Author',
          genre: 'Fiction',
          stock: 5
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBook = () => {
    const newBook = {
      bookId: 'demo-' + Date.now(),
      title: `New Book ${books.length + 1}`,
      author: 'Demo Author',
      genre: 'Fiction',
      stock: 10
    };
    setBooks([...books, newBook]);
    DemoApiService.addBook(newBook);
  };

  const handleUpdateStock = (bookId, newStock) => {
    const updatedBooks = books.map(book =>
      book.bookId === bookId ? { ...book, stock: newStock } : book
    );
    setBooks(updatedBooks);
    DemoApiService.updateBookStock(bookId, newStock);
  };

  if (loading) {
    return <div className="loading">Loading books from DynamoDB...</div>;
  }

  return (
    <div className="admin-dashboard">
      <h1>📚 Admin Dashboard (Demo Mode)</h1>
      <p>Managing inventory with real DynamoDB data</p>
      
      <div className="admin-actions">
        <button onClick={handleAddBook} className="btn btn-primary">
          + Add Demo Book
        </button>
      </div>

      <div className="books-list">
        <h2>Books in Inventory ({books.length})</h2>
        {books.map(book => (
          <div key={book.bookId} className="book-item">
            <h3>{book.title}</h3>
            <p>Author: {book.author}</p>
            <p>Genre: {book.genre}</p>
            <div className="stock-control">
              <span>Stock: </span>
              <input
                type="number"
                value={book.stock}
                onChange={(e) => handleUpdateStock(book.bookId, parseInt(e.target.value))}
                className="stock-input"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DemoAdminDashboard;