import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './services/auth.jsx';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import BookList from './components/BookList';
import BookDetail from './components/BookDetail';
import Cart from './components/Cart';
import Reviews from './components/Reviews';
import AdminDashboard from './components/AdminDashboard';
import './styles/App.css';
import VerifyEmail from './components/VerifyEmail';

function AppContent() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="App">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
          <Route path="/" element={<BookList />} />
          <Route path="/book/:bookId" element={<BookDetail />} />
          <Route path="/cart" element={user ? <Cart /> : <Navigate to="/login" />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/admin" element={user?.isAdmin ? <AdminDashboard /> : <Navigate to="/" />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;"// Build test" 
