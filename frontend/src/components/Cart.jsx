import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../services/api.jsx';
import { useAuth } from '../services/auth.jsx';
import './Cart.css';

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      // For now, we'll use mock data since the API might not be ready
      const mockCartItems = [
        {
          reservationId: 'CART_001',
          bookId: 'B001',
          bookTitle: 'Harry Potter and the Sorcerer\'s Stone',
          bookAuthor: 'J.K. Rowling',
          quantity: 1,
          bookPrice: 12.99
        },
        {
          reservationId: 'CART_002', 
          bookId: 'B002',
          bookTitle: 'The Hunger Games',
          bookAuthor: 'Suzanne Collins',
          quantity: 2,
          bookPrice: 11.99
        }
      ];
      setCartItems(mockCartItems);
    } catch (err) {
      setError('Failed to load cart');
      console.error('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.reservationId === itemId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const removeItem = (itemId) => {
    setCartItems(prevItems =>
      prevItems.filter(item => item.reservationId !== itemId)
    );
  };

  const createReservation = async () => {
    if (!user) {
      alert('Please login to create reservation');
      navigate('/login');
      return;
    }

    try {
      // This would call your actual API
      alert('Reservation feature coming soon! For now, this is a demo.');
      console.log('Creating reservation with items:', cartItems);
    } catch (err) {
      alert('Failed to create reservation');
      console.error('Error creating reservation:', err);
    }
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = cartItems.reduce((sum, item) => sum + (item.quantity * item.bookPrice), 0);

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading your cart...</p>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h1>Your Shopping Cart</h1>
        <p>{totalItems} {totalItems === 1 ? 'item' : 'items'} in cart</p>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <h2>Your cart is empty</h2>
          <p>Browse our books and add some to your cart!</p>
          <button onClick={() => navigate('/')} className="btn btn-primary">
            Browse Books
          </button>
        </div>
      ) : (
        <div className="cart-content">
          <div className="cart-items">
            {cartItems.map(item => (
              <div key={item.reservationId} className="cart-item">
                <div className="item-info">
                  <h3 className="item-title">{item.bookTitle}</h3>
                  <p className="item-author">by {item.bookAuthor}</p>
                  <p className="item-price">${item.bookPrice}</p>
                </div>
                
                <div className="item-controls">
                  <div className="quantity-controls">
                    <button
                      onClick={() => updateQuantity(item.reservationId, item.quantity - 1)}
                      className="quantity-btn"
                    >
                      -
                    </button>
                    <span className="quantity">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.reservationId, item.quantity + 1)}
                      className="quantity-btn"
                    >
                      +
                    </button>
                  </div>
                  
                  <div className="item-total">
                    ${(item.quantity * item.bookPrice).toFixed(2)}
                  </div>
                  
                  <button
                    onClick={() => removeItem(item.reservationId)}
                    className="btn btn-danger remove-btn"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="summary-card">
              <h3>Order Summary</h3>
              
              <div className="summary-row">
                <span>Subtotal ({totalItems} items):</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
              
              <div className="summary-row">
                <span>Estimated Tax:</span>
                <span>${(totalAmount * 0.1).toFixed(2)}</span>
              </div>
              
              <div className="summary-row total">
                <span>Total:</span>
                <span>${(totalAmount * 1.1).toFixed(2)}</span>
              </div>
              
              <button
                onClick={createReservation}
                className="btn btn-primary checkout-btn"
              >
                Proceed to Reservation
              </button>
              
              <button
                onClick={() => navigate('/')}
                className="btn btn-secondary continue-shopping"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;