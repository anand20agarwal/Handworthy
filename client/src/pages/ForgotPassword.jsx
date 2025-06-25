import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Auth.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      alert("Please enter your email");
      return;
    }

    try {
      const res = await axios.post('/api/users/forgot-password', { email });
      alert(res.data.message);
      setSubmitted(true);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        alert("Email not registered");
      } else {
        alert("Something went wrong");
      }
    }
  };

  return (
    <div className="container" id="form-container">
      <h2>Forgot Password</h2>

      {submitted ? (
        <div>
          <p className="success-message">
            If this email is registered, a reset link has been sent.
          </p>
          <button className="btn" onClick={() => navigate('/')}>
            Back to Login
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address:</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn">Send Reset Link</button>
        </form>
      )}
    </div>
  );
}
