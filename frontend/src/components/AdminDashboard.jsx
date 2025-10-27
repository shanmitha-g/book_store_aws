import React, { useState, useEffect } from 'react';
import ApiService from '../services/api.js';
import '../styles/AdminDashboard.css';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const bookData = await ApiService.getBooks();
      setBooks(bookData);
    } catch (err) {
      console.error('Error fetching books:', err);
    } finally {
      setLoading(false);
    }
  };

  const addNewBook = () => {
    // Simple form for demo - in real app, use a modal or separate page
    const title = prompt('Enter book title:');
    const author = prompt('Enter author:');
    const genre = prompt('Enter genre:');
    
    if (title && author && genre) {
      const newBook = {
        bookId: `B${Date.now()}`,
        title,
        author,
        genre,
        stock: 10,
        price: 12.99,
        description: 'Book description goes here...',
        createdAt: new Date().toISOString()
      };
      
      setBooks(prev => [...prev, newBook]);
      alert('Book added successfully!');
    }
  };

  const updateStock = (bookId, newStock) => {
    setBooks(prev =>
      prev.map(book =>
        book.bookId === bookId ? { ...book, stock: newStock } : book
      )
    );
    alert(`Stock updated for book ${bookId}`);
  };

  const OverviewTab = () => (
    <div className="overview-tab">
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Books</h3>
          <p className="stat-number">{books.length}</p>
        </div>
        <div className="stat-card">
          <h3>Low Stock</h3>
          <p className="stat-number">
            {books.filter(book => book.stock < 5).length}
          </p>
        </div>
        <div className="stat-card">
          <h3>Out of Stock</h3>
          <p className="stat-number">
            {books.filter(book => book.stock === 0).length}
          </p>
        </div>
      </div>
      
      <div className="recent-activity">
        <h3>Recent Activity</h3>
        <p>Admin dashboard is ready for inventory management!</p>
      </div>
    </div>
  );

  const InventoryTab = () => (
    <div className="inventory-tab">
      <div className="inventory-header">
        <h3>Book Inventory</h3>
        <button onClick={addNewBook} className="btn btn-primary">
          Add New Book
        </button>
      </div>
      
      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading inventory...</p>
        </div>
      ) : (
        <div className="inventory-table">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Genre</th>
                <th>Stock</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map(book => (
                <tr key={book.bookId}>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>{book.genre}</td>
                  <td>
                    <input
                      type="number"
                      value={book.stock}
                      onChange={(e) => updateStock(book.bookId, parseInt(e.target.value))}
                      className="stock-input"
                    />
                  </td>
                  <td>${book.price}</td>
                  <td>
                    <button className="btn btn-secondary btn-small">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Manage your bookstore inventory and operations</p>
      </div>

      <div className="admin-tabs">
        <button
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`tab-btn ${activeTab === 'inventory' ? 'active' : ''}`}
          onClick={() => setActiveTab('inventory')}
        >
          Inventory
        </button>
        <button
          className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
          onClick={() => setActiveTab('reviews')}
        >
          Reviews
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'inventory' && <InventoryTab />}
        {activeTab === 'reviews' && (
          <div className="reviews-tab">
            <h3>Review Moderation</h3>
            <p>Review management coming soon!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;