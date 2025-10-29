import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../services/auth.jsx';
import '../styles/VerifyEmail.css';

function VerifyEmail() {
  const location = useLocation();
  const navigate = useNavigate();
  const { verifyEmail, resendVerificationCode } = useAuth();
  
  // Get email from navigation state or use empty string
  const initialEmail = location.state?.email || '';
  const [email, setEmail] = useState(initialEmail);
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setMessage('Please enter your email address');
      return;
    }
    if (!code.trim()) {
      setMessage('Please enter verification code');
      return;
    }

    setIsLoading(true);
    try {
      await verifyEmail(email, code);
      setMessage('✅ Email verified successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      setMessage(`❌ Verification failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email.trim()) {
      setMessage('Please enter your email address');
      return;
    }

    setIsLoading(true);
    try {
      await resendVerificationCode(email);
      setMessage('📧 Verification code sent to your email!');
    } catch (error) {
      setMessage(`❌ Failed to resend code: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="verify-email">
      <h2>Verify Your Email</h2>
      <p>We sent a verification code to your email. Please enter it below.</p>
      
      <form onSubmit={handleVerify}>
        <div className="form-group">
          <label>Email Address:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>
        
        <div className="form-group">
          <label>Verification Code:</label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter 6-digit code"
            required
          />
        </div>
        
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Verifying...' : 'Verify Email'}
        </button>
      </form>

      <button 
        onClick={handleResendCode} 
        disabled={isLoading} 
        className="resend-btn"
        type="button"
      >
        Resend Verification Code
      </button>

      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default VerifyEmail;