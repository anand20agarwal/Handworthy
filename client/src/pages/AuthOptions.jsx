import React from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, provider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';
import logo from '../assets/logo.png';
import '../CSS/Auth.css';

export default function AuthOptions() {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      navigate('/');
    } catch (error) {
      alert('Google sign-in failed');
    }
  };

  const handlePhoneLogin = () => {
    navigate('/phone-login');
  };

  const handleEmailLogin = () => {
    navigate('/login');
  };

  return (
    <div className="auth-wrapper">
      <div className="container" id="form-container">
        <div className="logo">
          <img src={logo} alt="Handworthy logo" />
        </div>
        <h2 id="form-title">Sign In</h2>
        <button className="btn google-btn" onClick={handleGoogleLogin}>
          Continue with Google
        </button>
        <div style={{ margin: '20px 0', textAlign: 'center' }}>or</div>
        <button className="btn" onClick={handleEmailLogin}>
          Continue with Email
        </button>
        <div style={{ margin: '20px 0', textAlign: 'center' }}>or</div>
        <button className="btn" onClick={handlePhoneLogin}>
          Continue with Phone Number
        </button>
      </div>
    </div>
  );
}
