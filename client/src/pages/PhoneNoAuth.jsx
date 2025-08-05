
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { auth } from '../firebase';

import '../CSS/PhoneNoAuth.css';
import logo from '../assets/logo.png';

function PhoneNoAuth() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('phone'); // 'phone' | 'otp'
  const [confirmation, setConfirmation] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const recaptchaRef = useRef(null);


  // Setup invisible reCAPTCHA only once, after container is mounted
  React.useEffect(() => {
    // Wait for the container to be in the DOM
    if (document.getElementById('recaptcha-container') && !window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: () => {},
      });
    }
    return () => {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        delete window.recaptchaVerifier;
      }
    };
  }, []);

  const handleSendCode = async () => {
    setError('');
    // Only allow 10 digit numbers for India
    if (!/^\d{10}$/.test(phone)) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }
    setLoading(true);
    try {
      const appVerifier = window.recaptchaVerifier;
      const fullPhone = '+91' + phone;
      const confirmationResult = await signInWithPhoneNumber(auth, fullPhone, appVerifier);
      setConfirmation(confirmationResult);
      setStep('otp');
    } catch (err) {
      setError('Failed to send OTP: ' + (err.message || err));
    }
    setLoading(false);
  };

  const handleVerifyOtp = async () => {
    setError('');
    if (!otp || otp.length < 4) {
      setError('Please enter the OTP');
      return;
    }
    setLoading(true);
    try {
      await confirmation.confirm(otp);
      setStep('done');
      navigate('/');
    } catch (err) {
      setError('Invalid OTP. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="phone-auth-page phone-auth-bg">
      <div className="phone-auth-card">
        <div className="logo logo-center">
          <img src={logo} alt="Handworthy logo" className="logo-img" />
        </div>
        <h2 className="phone-auth-title">Phone Number Login</h2>
        {step === 'phone' && (
          <>
            <label className="phone-auth-label">Phone Number</label>
            <div className="phone-auth-input-row">
              <span className="phone-auth-prefix">+91</span>
              <input
                type="tel"
                value={phone}
                onChange={e => {
                  // Only allow numbers, max 10 digits
                  const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                  setPhone(val);
                }}
                placeholder="Enter 10-digit number"
                className="phone-auth-input"
                disabled={loading}
              />
            </div>
            <button
              onClick={handleSendCode}
              className="phone-auth-btn"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </>
        )}
        {step === 'otp' && (
          <>
            <label className="phone-auth-label">Enter OTP</label>
            <input
              type="text"
              value={otp}
              onChange={e => setOtp(e.target.value)}
              placeholder="Enter OTP"
              className="phone-auth-input"
              disabled={loading}
            />
            <button
              onClick={handleVerifyOtp}
              className="phone-auth-btn"
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </>
        )}
        {step === 'done' && (
          <div className="phone-auth-success">Login successful!</div>
        )}
        {error && <div className="phone-auth-error">{error}</div>}
        {/* recaptcha container must always be present for Firebase */}
        <div id="recaptcha-container" />
      </div>
    </div>
  );
}

export default PhoneNoAuth;
