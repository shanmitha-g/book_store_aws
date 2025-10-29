import React, { useState } from 'react';
import { useAuth } from '../services/auth.jsx';

function VerifyEmail() {
  const [code, setCode] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const { verifyEmail, resendVerificationCode } = useAuth(); // Use the actual functions

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      await verifyEmail(email, code);
      setMessage('Email verified successfully! You can now login.');
    } catch (error) {
      setMessage('Verification failed: ' + error.message);
    }
  };

  const handleResendCode = async () => {
    try {
      await resendVerificationCode(email);
      setMessage('Verification code sent to your email!');
    } catch (error) {
      setMessage('Failed to resend code: ' + error.message);
    }
  };

  return (
    <div>
      <h2>Verify Your Email</h2>
      <form onSubmit={handleVerify}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter verification code"
          required
        />
        <button type="submit">Verify Email</button>
      </form>
      <button onClick={handleResendCode}>Resend Verification Code</button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default VerifyEmail;