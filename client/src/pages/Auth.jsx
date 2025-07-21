import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api'; // your Axios instance
import '../CSS/Auth.css';
import logo from '../assets/logo.png';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Auth({ isLoginDefault = true }) {
  const [isLogin, setIsLogin] = useState(isLoginDefault);
  const navigate = useNavigate();

  // Form states
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState({
    fname: '', lastName: '', email: '', phone: '',
    address: '', pincode: '', password: '', confirm: '', privacy: false
  });

  // Errors
  const [loginError, setLoginError] = useState('');
  const [loginFieldErrors, setLoginFieldErrors] = useState({});
  const [signupError, setSignupError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  // OTP states
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [isOtpVerified, setIsOtpVerified] = useState(false);

  // Password toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Login submit
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoginFieldErrors({});
    let errors = {};

    if (!loginForm.email) errors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginForm.email))
      errors.email = 'Please enter a valid email address';

    if (!loginForm.password) errors.password = 'Password is required';

    if (Object.keys(errors).length > 0) {
      setLoginFieldErrors(errors);
      return;
    }

    try {
      const res = await API.post('/login', loginForm);
      localStorage.setItem('token', res.data.token);
      navigate('/');
    } catch (err) {
      const errorMessage = err.response?.data?.message || '';
      const statusCode = err.response?.status;

      if (statusCode === 404 || errorMessage.toLowerCase().includes('not found'))
        setLoginError('Email not registered');
      else if (statusCode === 401 || errorMessage.toLowerCase().includes('password'))
        setLoginError('Incorrect password');
      else setLoginError(errorMessage || 'Login failed');
    }
  };

  // Signup submit
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setSignupError('');
    setFieldErrors({});
    const { lastName, email, phone, pincode, password, confirm, privacy } = signupForm;

    let errors = {};
    if (!lastName) errors.lastName = 'Last name is required';
    if (!email) errors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errors.email = 'Please enter a valid email address';
    if (!phone) errors.phone = 'Phone number is required';
    else if (!/^\d{10}$/.test(phone))
      errors.phone = 'Phone number must be exactly 10 digits';
    if (!pincode) errors.pincode = 'Pincode is required';
    else if (!/^\d{6}$/.test(pincode))
      errors.pincode = 'Pincode must be exactly 6 digits';
    if (!password) errors.password = 'Password is required';
    else if (password.length < 6)
      errors.password = 'Password must be at least 6 characters';
    if (!confirm) errors.confirm = 'Please confirm your password';
    else if (password !== confirm)
      errors.confirm = 'Passwords do not match';

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

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
      navigate('/login');
    } catch (err) {
      setSignupError(err.response?.data?.message || 'Signup failed');
    }
  };

  // OTP send
  const sendOtp = async () => {
    if (!signupForm.phone) {
      setFieldErrors({ ...fieldErrors, phone: 'Enter phone number first' });
      return;
    }
    if (!/^\d{10}$/.test(signupForm.phone)) {
      setFieldErrors({ ...fieldErrors, phone: 'Phone number must be exactly 10 digits' });
      return;
    }

    const formattedPhone = signupForm.phone.startsWith('+')
      ? signupForm.phone
      : '+91' + signupForm.phone;

    try {
      await API.post('/send-otp', { phone: formattedPhone });
      setOtpSent(true);
      toast.success("OTP sent to your phone");
    } catch (err) {
      setFieldErrors({ ...fieldErrors, phone: 'Failed to send OTP' });
    }
  };

  // OTP verify
  const verifyOtp = async () => {
    if (!otp) return toast.warning("Enter OTP");

    const formattedPhone = signupForm.phone.startsWith('+')
      ? signupForm.phone
      : '+91' + signupForm.phone;

    try {
      const res = await API.post('/verify-otp', { phone: formattedPhone, otp });
      if (res.data.success) {
        setIsOtpVerified(true);
        toast.success("Phone number verified");
      } else {
        toast.error("Invalid OTP");
      }
    } catch {
      toast.error("OTP verification failed");
    }
  };

  // Password input toggle
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
          position: 'absolute', right: '10px', top: '50%',
          transform: 'translateY(-50%)', cursor: 'pointer', color: '#555'
        }}
      >
        {visible ? <FaEyeSlash /> : <FaEye />}
      </span>
    </div>
  );

  return (
    <div className="auth-wrapper">
      <div className="container" id="form-container">
        <div className="logo">
          <img src={logo} alt="Handworthy logo" />
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
              {loginFieldErrors.email && <p className="error">* {loginFieldErrors.email}</p>}
            </div>
            <div className="form-group">
              <label>Password *</label>
              {renderPasswordInput(
                loginForm.password,
                e => setLoginForm({ ...loginForm, password: e.target.value }),
                showPassword,
                () => setShowPassword(!showPassword)
              )}
              {loginFieldErrors.password && <p className="error">* {loginFieldErrors.password}</p>}
            </div>
            {loginError && <p className="error">* {loginError}</p>}
            <button type="submit" className="btn">Login</button>
          </form>
        ) : (
          <form onSubmit={handleSignupSubmit}>
            {['fname', 'lastName', 'email', 'address', 'pincode'].map(field => (
              <div className="form-group" key={field}>
                <label>
                  {field === 'fname' ? 'First Name' :
                    field === 'lastName' ? 'Last Name' :
                      field.charAt(0).toUpperCase() + field.slice(1)}
                  {field !== 'address' && field !== 'fname' ? ' *' : ''}
                </label>
                <input
                  type={field === 'email' ? 'email' : 'text'}
                  value={signupForm[field]}
                  onChange={e => setSignupForm({ ...signupForm, [field]: e.target.value })}
                />
                {fieldErrors[field] && <p className="error">* {fieldErrors[field]}</p>}
              </div>
            ))}

            <div className="form-group">
              <label>Password *</label>
              {renderPasswordInput(
                signupForm.password,
                e => setSignupForm({ ...signupForm, password: e.target.value }),
                showPassword,
                () => setShowPassword(!showPassword)
              )}
              {fieldErrors.password && <p className="error">* {fieldErrors.password}</p>}
            </div>
            <div className="form-group">
              <label>Confirm Password *</label>
              {renderPasswordInput(
                signupForm.confirm,
                e => setSignupForm({ ...signupForm, confirm: e.target.value }),
                showConfirm,
                () => setShowConfirm(!showConfirm)
              )}
              {fieldErrors.confirm && <p className="error">* {fieldErrors.confirm}</p>}
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
              {fieldErrors.phone && <p className="error">* {fieldErrors.phone}</p>}
              {!otpSent ? (
                <button type="button" className="btn" onClick={sendOtp} disabled={isOtpVerified}>Send OTP</button>
              ) : (
                <>
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={e => setOtp(e.target.value)}
                    disabled={isOtpVerified}
                  />
                  <button type="button" className="btn" onClick={verifyOtp} disabled={isOtpVerified}>Verify OTP</button>
                </>
              )}
              {isOtpVerified && <p style={{ color: 'green' }}>Phone verified ✅</p>}
            </div>

            <div className="checkbox-group">
              <input
                type="checkbox"
                id="privacyCheck"
                checked={signupForm.privacy}
                onChange={e => setSignupForm({ ...signupForm, privacy: e.target.checked })}
              />
              <label htmlFor="privacyCheck">
                I agree to the <Link to="/privacy-policy">Privacy Policy</Link>
              </label>
            </div>

            {signupError && <p className="error">* {signupError}</p>}
            <button type="submit" className="btn">Create Account</button>
          </form>
        )}

        <div className="tab-switch">
          {isLogin ? (
            <>Don't have an account? <span onClick={() => { navigate('/signup'); setIsLogin(false); }}>Sign Up</span></>
          ) : (
            <>Already have an account? <span onClick={() => { navigate('/login'); setIsLogin(true); }}>Login</span></>
          )}
        </div>

        <ToastContainer position="top-center" autoClose={3000} />
      </div>
    </div>
  );
}