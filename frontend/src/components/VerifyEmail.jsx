import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../services/auth.jsx';

function VerifyEmail() {
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { verifyEmail, resendVerificationCode } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get email from navigation state or prompt user
  const email = location.state?.email || '';

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!code) {
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
    if (!email) {
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
        {!email && (
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
        )}
        
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

      <button onClick={handleResendCode} disabled={isLoading} className="resend-btn">
        Resend Verification Code
      </button>

      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default VerifyEmail;