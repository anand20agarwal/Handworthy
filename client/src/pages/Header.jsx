import React from 'react';
import Sidebar from './Sidebar';
import Logo from '../Images/logo.png';
import { useNavigate } from 'react-router-dom';
import '../CSS/Header.css';

export default function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="header">
      <img src={Logo} alt="Handworthy Logo" className="logo" />

      {/* ✅ Only visible on tablet & desktop */}
      <nav className="navbar">
        <span>Home</span>
        <span>Profile</span>
        <span>Settings</span>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </nav>

      <img
        src="https://cdn-icons-png.flaticon.com/512/34/34568.png"
        alt="Cart Icon"
        className="cart"
      />

      {/* ✅ Sidebar toggle only shows on mobile */}
      <Sidebar />
    </div>
  );
}
