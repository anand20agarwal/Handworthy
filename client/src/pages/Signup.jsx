import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const [form, setForm] = useState({
    fname: '', lname: '', email: '', phone: '',
    address: '', pincode: '', password: '', confirm: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) return alert('Passwords do not match');

    try {
      await axios.post('/api/users/signup', form);
      alert('Signup successful');
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <form onSubmit={handleSignup}>
      <h2>Sign Up</h2>
      <input name="fname" placeholder="First Name" onChange={handleChange} />
      <input name="lname" placeholder="Last Name" onChange={handleChange} />
      <input name="email" placeholder="Email" onChange={handleChange} />
      <input name="phone" placeholder="Phone" onChange={handleChange} />
      <input name="address" placeholder="Address" onChange={handleChange} />
      <input name="pincode" placeholder="Pin Code" onChange={handleChange} />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} />
      <input name="confirm" type="password" placeholder="Confirm Password" onChange={handleChange} />
      <label><input type="checkbox" required /> I agree to the Privacy Policy</label>
      <button type="submit">Create Account</button>
    </form>
  );
}
