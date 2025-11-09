import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../services/auth';
import '../styles/Navbar.css';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          📚 My Book Haven
        </Link>
        
        <div className="nav-menu">
          <Link to="/" className="nav-link">Books</Link>
          <Link to="/reviews" className="nav-link">FAQs</Link>
          
          {user ? (
            <>
              <Link to="/cart" className="nav-link">Cart 🛒</Link>
              {user.isAdmin && (
                <Link to="/admin" className="nav-link">Admin</Link>
              )}
              <div className="nav-user">
                <span>Hello, {user.firstName}</span>
                <button onClick={handleLogout} className="btn btn-secondary nav-logout">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="nav-auth">
              <Link to="/login" className="btn btn-secondary">Login</Link>
              <Link to="/register" className="btn btn-primary">Register</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
