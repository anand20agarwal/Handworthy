import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import './Auth.css';
import logo from '../assets/logo.png';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState({
    fname: '', lname: '', email: '', phone: '',
    address: '', pincode: '', password: '', confirm: '', privacy: false
  });

  const [loginError, setLoginError] = useState('');
  const [loginFieldErrors, setLoginFieldErrors] = useState({}); // Added for login field errors
  const [signupError, setSignupError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [isOtpVerified, setIsOtpVerified] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    // Clear previous errors
    setLoginError('');
    setLoginFieldErrors({});

    let errors = {};

    // Individual field validations for login
    if (!loginForm.email) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginForm.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!loginForm.password) {
      errors.password = 'Password is required';
    }

    // Set field errors if any
    if (Object.keys(errors).length > 0) {
      setLoginFieldErrors(errors);
      return;
    }

    try {
      const res = await API.post('/login', loginForm);
      localStorage.setItem('token', res.data.token);
      navigate('/home');
    } catch (err) {
      console.log('Login error:', err.response?.data); // Debug log
      
      // Handle specific error messages from backend
      const errorMessage = err.response?.data?.message || err.response?.data?.error || '';
      const statusCode = err.response?.status;
      
      // Check for specific error conditions
      if (statusCode === 404 || 
          errorMessage.toLowerCase().includes('user not found') || 
          errorMessage.toLowerCase().includes('email not registered') ||
          errorMessage.toLowerCase().includes('not found')) {
        setLoginError('Email not registered');
      } else if (statusCode === 401 || 
                 errorMessage.toLowerCase().includes('invalid password') || 
                 errorMessage.toLowerCase().includes('incorrect password') ||
                 errorMessage.toLowerCase().includes('wrong password') ||
                 errorMessage.toLowerCase().includes('password')) {
        setLoginError('Incorrect password');
      } else {
        // Fallback to original error message or generic message
        setLoginError(errorMessage || 'Login failed');
      }
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    const { fname, lname, email, phone, address, pincode, password, confirm, privacy } = signupForm;

    // Clear previous errors
    setSignupError('');
    setFieldErrors({});

    let errors = {};

    // Individual field validations
    if (!lname) {
      errors.lname = 'Last name is required';
    }

    if (!email) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!phone) {
      errors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(phone)) {
      errors.phone = 'Phone number must be exactly 10 digits';
    }

    if (!pincode) {
      errors.pincode = 'Pincode is required';
    } else if (!/^\d{6}$/.test(pincode)) {
      errors.pincode = 'Pincode must be exactly 6 digits';
    }

    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
    }

    if (!confirm) {
      errors.confirm = 'Please confirm your password';
    } else if (password && confirm && password !== confirm) {
      errors.confirm = 'Passwords do not match';
    }

    // Set field errors if any
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    // Other validations
    if (!privacy) {
      setSignupError('Agree to the privacy policy');
      return;
    }
    if (!isOtpVerified) {
      setSignupError('Please verify your phone number with OTP');
      return;
    }

    try {
      await API.post('/signup', signupForm);
      toast.success('Signup successful');
      setIsLogin(true);
    } catch (err) {
      setSignupError(err.response?.data?.message || 'Signup failed');
    }
  };

  const sendOtp = async () => {
    if (!signupForm.phone) {
      setFieldErrors({...fieldErrors, phone: 'Enter phone number first'});
      return;
    }

    // Validate phone number before sending OTP
    if (!/^\d{10}$/.test(signupForm.phone)) {
      setFieldErrors({...fieldErrors, phone: 'Phone number must be exactly 10 digits'});
      return;
    }

    // Clear phone error if validation passes
    const newErrors = {...fieldErrors};
    delete newErrors.phone;
    setFieldErrors(newErrors);

    const formattedPhone = signupForm.phone.startsWith('+')
      ? signupForm.phone
      : '+91' + signupForm.phone;

    try {
      await API.post('/send-otp', { phone: formattedPhone });
      setOtpSent(true);
      toast.success("OTP sent to your phone");
    } catch (err) {
      console.error('OTP send failed:', err);
      setFieldErrors({...fieldErrors, phone: 'Failed to send OTP'});
    }
  };

  const verifyOtp = async () => {
    if (!otp) return toast.warning("Enter OTP");

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
        toast.success("Phone number verified");
      } else {
        toast.error("Invalid OTP");
      }
    } catch (err) {
      console.error("OTP verification failed:", err);
      toast.error("OTP verification failed");
    }
  };

  const renderPasswordInput = (value, onChange, visible, toggle) => (
    <div style={{ position: 'relative' }}>
      <input
        type={visible ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        style={{ width: '100%', paddingRight: '30px', background: '#fff' }}
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
            <label>Email *</label>
            <input
              type="email"
              value={loginForm.email}
              onChange={e => setLoginForm({ ...loginForm, email: e.target.value })}
            />
            {loginFieldErrors.email && <p style={{ color: 'red', fontSize: '12px', margin: '5px 0 0 0' }}>* {loginFieldErrors.email}</p>}
          </div>
          <div className="form-group">
            <label>Password *</label>
            {renderPasswordInput(
              loginForm.password,
              e => setLoginForm({ ...loginForm, password: e.target.value }),
              showPassword,
              () => setShowPassword(!showPassword)
            )}
            {loginFieldErrors.password && <p style={{ color: 'red', fontSize: '12px', margin: '5px 0 0 0' }}>* {loginFieldErrors.password}</p>}
          </div>
          {loginError && <p style={{ color: 'red', marginBottom: '10px' }}>* {loginError}</p>}
          <button type="submit" className="btn">Login</button>
          <div className="forgot-link">
            <a href="/forgot-password">Forgot Password or Email?</a>
          </div>
        </form>
      ) : (
        <form onSubmit={handleSignupSubmit}>
          {['fname', 'lname', 'email', 'address', 'pincode'].map(field => (
            <div className="form-group" key={field}>
              <label>
                {field === 'fname' ? 'First Name' : 
                 field === 'lname' ? 'Last Name' : 
                 field.charAt(0).toUpperCase() + field.slice(1)}
                {field === 'lname' || field === 'email' || field === 'pincode' ? ' *' : ''}
              </label>
              <input
                type={field === 'email' ? 'email' : field === 'pincode' ? 'tel' : 'text'}
                value={signupForm[field]}
                onChange={e => setSignupForm({ ...signupForm, [field]: e.target.value })}
                placeholder={field === 'pincode' ? 'Enter 6-digit pincode' : ''}
              />
              {fieldErrors[field] && <p style={{ color: 'red', fontSize: '12px', margin: '5px 0 0 0' }}>* {fieldErrors[field]}</p>}
            </div>
          ))}

          <div className="form-group">
            <label>Password</label>
            {renderPasswordInput(
              signupForm.password,
              e => setSignupForm({ ...signupForm, password: e.target.value }),
              showPassword,
              () => setShowPassword(!showPassword)
            )}
            {fieldErrors.password && <p style={{ color: 'red', fontSize: '12px', margin: '5px 0 0 0' }}>* {fieldErrors.password}</p>}
          </div>

          <div className="form-group">
            <label>Confirm Password *</label>
            {renderPasswordInput(
              signupForm.confirm,
              e => setSignupForm({ ...signupForm, confirm: e.target.value }),
              showConfirm,
              () => setShowConfirm(!showConfirm)
            )}
            {fieldErrors.confirm && <p style={{ color: 'red', fontSize: '12px', margin: '5px 0 0 0' }}>* {fieldErrors.confirm}</p>}
          </div>

          <div className="form-group">
            <label>Phone *</label>
            <input
            type="tel"
            value={signupForm.phone}
            onChange={e => setSignupForm({ ...signupForm, phone: e.target.value })}
            disabled={isOtpVerified}
            placeholder="Enter 10-digit phone number"
          />
            {fieldErrors.phone && <p style={{ color: 'red', fontSize: '12px', margin: '5px 0 0 0' }}>* {fieldErrors.phone}</p>}

            {!otpSent ? (
              <button
                type="button"
                className="btn"
                style={{ marginTop: '10px' }}
                onClick={sendOtp}
                disabled={isOtpVerified}
              >
                Send OTP
              </button>
            ) : (
              <div style={{ marginTop: '10px' }}>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                  disabled={isOtpVerified}
                />
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button
                    type="button"
                    className="btn"
                    onClick={verifyOtp}
                    disabled={isOtpVerified}
                  >
                    Verify OTP
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={sendOtp}
                    disabled={isOtpVerified}
                  >
                    Resend OTP
                  </button>
                </div>
              </div>
            )}
            {isOtpVerified && <p style={{ color: 'green' }}>Phone verified ✅</p>}
          </div>

        <div className="checkbox-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <input
            type="checkbox"
            id="privacyCheck"
            checked={signupForm.privacy}
            onChange={e => setSignupForm({ ...signupForm, privacy: e.target.checked })}
            style={{ 
              width: '20px',
              height: '20px',
              backgroundColor: signupForm.privacy ? 'black' : 'white',
              border: '2px solid black',
              cursor: 'pointer',
              appearance: 'none',
              WebkitAppearance: 'none',
              position: 'relative',
              flexShrink: 0
            }}
          />
          {signupForm.privacy && (
            <span style={{
              position: 'absolute',
              left: '3px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'white',
              fontSize: '20px',
              fontWeight: '900',
              pointerEvents: 'none',
              textShadow: '0 0 2px white, 1px 1px 0 white, -1px -1px 0 white, 1px -1px 0 white, -1px 1px 0 white'
            }}>
              ✓
            </span>
          )}
          <label htmlFor="privacyCheck">
            I agree to the <a href="/privacy.html" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
          </label>
        </div>

          {signupError && <p style={{ color: 'red', marginBottom: '10px' }}>* {signupError}</p>}
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

      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
}