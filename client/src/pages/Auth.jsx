import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import './Auth.css';
import logo from '../assets/logo.png';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState({
    fname: '', lname: '', email: '', phone: '',
    address: '', pincode: '', password: '', confirm: '', privacy: false
  });

  const [loginError, setLoginError] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [isOtpVerified, setIsOtpVerified] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');

    if (!loginForm.email || !loginForm.password) {
      setLoginError('Please fill in all login fields');
      return;
    }

    try {
      const res = await API.post('/login', loginForm);
      localStorage.setItem('token', res.data.token);
      navigate('/home');
    } catch (err) {
      setLoginError(err.response?.data?.message || 'Login failed');
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    const { fname, lname, email, phone, address, pincode, password, confirm, privacy } = signupForm;

    if (!lname || !phone || !pincode || !password || !confirm) {
      alert('Fill all required fields');
      return;
    }
    if (password !== confirm) {
      alert('Passwords do not match');
      return;
    }
    if (!privacy) {
      alert('Agree to the privacy policy');
      return;
    }
    if (!isOtpVerified) {
      alert('Please verify your phone number with OTP');
      return;
    }

    try {
      await API.post('/signup', signupForm);
      alert('Signup successful');
      setIsLogin(true);
    } catch (err) {
      alert(err.response?.data?.message || 'Signup failed');
    }
  };

  const sendOtp = async () => {
    if (!signupForm.phone) return alert("Enter phone number first");

    const formattedPhone = signupForm.phone.startsWith('+')
      ? signupForm.phone
      : '+91' + signupForm.phone;

    try {
      await API.post('/send-otp', { phone: formattedPhone });
      setOtpSent(true);
      alert("OTP sent to your phone");
    } catch (err) {
      console.error('OTP send failed:', err);
      alert("Failed to send OTP");
    }
  };

  const verifyOtp = async () => {
    if (!otp) return alert("Enter OTP");

    const formattedPhone = signupForm.phone.startsWith('+')
      ? signupForm.phone
      : '+91' + signupForm.phone;

    try {
      const res = await API.post('/verify-otp', {
        phone: formattedPhone,
        otp: otp
      });

      if (res.data.success) {
        setIsOtpVerified(true);
        alert("Phone number verified");
      } else {
        alert("Invalid OTP");
      }
    } catch (err) {
      console.error("OTP verification failed:", err);
      alert("OTP verification failed");
    }
  };

  // 🔐 Shared input with eye toggle
  const renderPasswordInput = (value, onChange, visible, toggle) => (
    <div style={{ position: 'relative' }}>
      <input
        type={visible ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        required
        style={{ width: '100%', paddingRight: '30px' }}
      />
      <span
        onClick={toggle}
        style={{
          position: 'absolute',
          right: '10px',
          top: '50%',
          transform: 'translateY(-50%)',
          cursor: 'pointer',
          color: '#555'
        }}
      >
        {visible ? <FaEyeSlash /> : <FaEye />}
      </span>
    </div>
  );

  return (
    <div className="container" id="form-container">
      <div className='logo'>
        <img src={logo} alt="logo" />
      </div>
      <h2 id="form-title">{isLogin ? 'Login' : 'Create Account'}</h2>

      {isLogin ? (
        <form onSubmit={handleLoginSubmit}>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={loginForm.email}
              onChange={e => setLoginForm({ ...loginForm, email: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            {renderPasswordInput(
              loginForm.password,
              e => setLoginForm({ ...loginForm, password: e.target.value }),
              showPassword,
              () => setShowPassword(!showPassword)
            )}
          </div>
          {loginError && <p style={{ color: 'red', marginBottom: '10px' }}>{loginError}</p>}
          <button type="submit" className="btn">Login</button>
          <div className="forgot-link">
            <a href="/forgot-password">Forgot Password or Email?</a>
          </div>
        </form>
      ) : (
        <form onSubmit={handleSignupSubmit}>
          {['fname', 'lname', 'email', 'address', 'pincode'].map(field => (
            <div className="form-group" key={field}>
              <label>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
              <input
                type={field === 'email' ? 'email' : field === 'pincode' ? 'tel' : 'text'}
                value={signupForm[field]}
                onChange={e => setSignupForm({ ...signupForm, [field]: e.target.value })}
                required
              />
            </div>
          ))}

          <div className="form-group">
            <label>Password:</label>
            {renderPasswordInput(
              signupForm.password,
              e => setSignupForm({ ...signupForm, password: e.target.value }),
              showPassword,
              () => setShowPassword(!showPassword)
            )}
          </div>

          <div className="form-group">
            <label>Confirm Password:</label>
            {renderPasswordInput(
              signupForm.confirm,
              e => setSignupForm({ ...signupForm, confirm: e.target.value }),
              showConfirm,
              () => setShowConfirm(!showConfirm)
            )}
          </div>

          <div className="form-group">
            <label>Phone:</label>
            <input
              type="tel"
              value={signupForm.phone}
              onChange={e => setSignupForm({ ...signupForm, phone: e.target.value })}
              required
            />
            {!otpSent ? (
              <button type="button" className="btn" style={{ marginTop: '10px' }} onClick={sendOtp}>
                Send OTP
              </button>
            ) : (
              <>
                <div style={{ marginTop: '10px' }}>
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={e => setOtp(e.target.value)}
                  />
                  <button type="button" className="btn" style={{ marginTop: '10px' }} onClick={verifyOtp}>
                    Verify OTP
                  </button>
                </div>
              </>
            )}
            {isOtpVerified && <p style={{ color: 'green' }}>Phone verified ✅</p>}
          </div>

          <div className="checkbox-group">
            <input
              type="checkbox"
              checked={signupForm.privacy}
              onChange={e => setSignupForm({ ...signupForm, privacy: e.target.checked })}
              required
            />
            <label>I agree to the <a href="/privacy.html" target="_blank">Privacy Policy</a></label>
          </div>
          <button type="submit" className="btn">Create Account</button>
        </form>
      )}

      <div className="tab-switch" onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? (
          <>Don't have an account? <span>Sign Up</span></>
        ) : (
          <>Already have an account? <span>Login</span></>
        )}
      </div>
    </div>
  );
}
