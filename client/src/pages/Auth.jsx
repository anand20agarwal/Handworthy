import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Auth.css'; 
import logo from '../assets/logo.png'

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState({
    fname: '', lname: '', email: '', phone: '',
    address: '', pincode: '', password: '', confirm: '', privacy: false
  });

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginForm.email || !loginForm.password) return alert('Fill all login fields');
    try {
      const res = await axios.post('/api/users/login', loginForm);
      localStorage.setItem('token', res.data.token);
      navigate('/home');
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    const { fname, lname, email, phone, address, pincode, password, confirm, privacy } = signupForm;

    if (!lname || !phone || !pincode || !password || !confirm) return alert('Fill all required fields');
    if (password !== confirm) return alert('Passwords do not match');
    if (!privacy) return alert('Agree to the privacy policy');

    try {
      await axios.post('/api/users/signup', signupForm);
      alert('Signup successful');
      setIsLogin(true);
    } catch (err) {
      alert(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="container" id="form-container">
        <div className='logo'>
        <img src={logo} alt="logo"/>
        </div>
      <h2 id="form-title">{isLogin ? 'Login' : 'Create Account'}</h2>

      {isLogin ? (
        <form onSubmit={handleLoginSubmit}>
          <div className="form-group">
            <label>Email:</label>
            <input type="email" value={loginForm.email} onChange={e => setLoginForm({ ...loginForm, email: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input type="password" value={loginForm.password} onChange={e => setLoginForm({ ...loginForm, password: e.target.value })} required />
          </div>
          <button type="submit" className="btn">Login</button>
          <div className="forgot-link">
            <a href="#">Forgot Password or Email?</a>
          </div>
        </form>
      ) : (
        <form onSubmit={handleSignupSubmit}>
          {['fname', 'lname', 'email', 'phone', 'address', 'pincode', 'password', 'confirm'].map(field => (
            <div className="form-group" key={field}>
              <label>{field === 'confirm' ? 'Confirm Password:' : field.charAt(0).toUpperCase() + field.slice(1) + ':'}</label>
              <input
                type={field.includes('password') ? 'password' : field === 'email' ? 'email' : field === 'phone' || field === 'pincode' ? 'tel' : 'text'}
                value={signupForm[field]}
                onChange={e => setSignupForm({ ...signupForm, [field]: e.target.value })}
                required={['fname', 'lname', 'email', 'pincode', 'password', 'confirm'].includes(field)}
              />
            </div>
          ))}
          <div className="checkbox-group">
            <input type="checkbox" checked={signupForm.privacy} onChange={e => setSignupForm({ ...signupForm, privacy: e.target.checked })} required />
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
