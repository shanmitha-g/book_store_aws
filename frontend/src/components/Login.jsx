/*import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../services/auth';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, demoLogin } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  /*const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(formData.email, formData.password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };//
  const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setIsLoading(true);

  try {
    // Try real login first
    await login(formData.email, formData.password);
    navigate('/');
  } catch (err) {
    console.log('Login failed, using demo mode:', err);
    
    // Demo mode fallback
    if (formData.email.includes('admin')) {
      // Auto-login as admin for demo
      const userData = {
        username: formData.email,
        email: formData.email,
        firstName: 'Admin',
        lastName: 'User',
        isAdmin: true,
        token: 'demo-admin-token'
      };
      // You'll need to add setUser to your Login component props
      // Or use context to update auth state
      alert('Demo mode: Logged in as Admin. In production, this would use real authentication.');
      navigate('/admin');
    } else {
      // Regular user demo
      alert('Demo mode: Logged in successfully. In production, this would use real Cognito authentication.');
      navigate('/');
    }
  } finally {
    setIsLoading(false);
  }
};*/

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../services/auth';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();  // Add demoLogin here
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  /*
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(formData.email, formData.password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Login failed'); 
    } finally {
      setIsLoading(false);
    }
  };*/
  const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setIsLoading(true);

  try {
    const userData = await login(formData.email, formData.password);
    // Redirect based on user role
    if (userData.isAdmin) {
      navigate('/admin');
    } else {
      navigate('/');
    }
  } catch (err) {
    setError(err.message || 'Login failed');
  } finally {
    setIsLoading(false);
  }
};


  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Welcome Back</h2>
        <p className="auth-subtitle">Sign in to your account</p>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter your password"
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary btn-block"
            disabled={isLoading}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        
        <p className="auth-footer">
          Don't have an account? <Link to="/register">Sign up here</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;