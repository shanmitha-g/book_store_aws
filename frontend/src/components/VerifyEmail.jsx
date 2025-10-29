import React, { useState } from 'react';
import { useAuth } from './services/auth';

function VerifyEmail() {
  const [code, setCode] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const verifyEmail = async (e) => {
    e.preventDefault();
    try {
      // You'll need to implement this in your auth.jsx
      // await verifyEmailCode(email, code);
      setMessage('Email verified successfully! You can now login.');
    } catch (error) {
      setMessage('Verification failed: ' + error.message);
    }
  };

  return (
    <div>
      <h2>Verify Your Email</h2>
      <form onSubmit={verifyEmail}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
        />
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter verification code"
        />
        <button type="submit">Verify Email</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default VerifyEmail;