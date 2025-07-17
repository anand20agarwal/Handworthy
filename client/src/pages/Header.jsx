import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import Logo from '../Images/logo.png';
import { useNavigate } from 'react-router-dom';
import '../CSS/Header.css';
import '../CSS/Home.css';
import Search from '../Images/Search.png';
import Profile from '../Images/Profile-use.png';
import Searchbar from './Searchbar';

export default function Header() {
  const navigate = useNavigate();
  const [showSearchOverlay, setShowSearchOverlay] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  // const handleSearchKeyDown = (e) => {
  //   if (e.key === 'Enter') {
  //     setShowSearchOverlay(false);
  //     console.log('Search submitted:', e.target.value);
  //   }
  // };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.profile-dropdown')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/login');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleProfile = () => {
    navigate('/profile');
    setIsDropdownOpen(false);
  };

  const handleWishlist = () => {
    navigate('/wishlist');
    setIsDropdownOpen(false);
  };

  const handleCoupons = () => {
    navigate('/coupons');
    setIsDropdownOpen(false);
  };

  const handleHelp = () => {
    navigate('/help');
    setIsDropdownOpen(false);
  };

  const handleSetting = () => {
    navigate('/settings');
    setIsDropdownOpen(false);
  };

  const handleOrders = () => {
    navigate('/orders');
    setIsDropdownOpen(false);
  };

  return (
    <>
      <div className="header">
        <img src={Logo} alt="Handworthy Logo" className="logo" />
          <Searchbar/>
        {/* <input
          type="text"
          placeholder="Search..."
          className="search-bar"
          // onKeyDown={handleSearchKeyDown}
        /> */}

        <nav className="navbar">
          <span>Home</span>
          <span className="why">Why Handworthy</span>
          <span className="quality">Quality Check</span>
          <span>Warranty</span>
          <span>Support</span>
          <span>Blog</span>
          <span>About</span>

          {!isLoggedIn ? (
            <button className="login-btn" onClick={handleLogin}>
              Login
            </button>
          ) : (
            <div className="profile-dropdown">
              <button className="profile-btn" onClick={toggleDropdown}>
                <img src={Profile} alt="Profile" className="profile-img" />
              </button>
              {isDropdownOpen && (
                <div className="dropdown-menu">
                  <span onClick={handleProfile}>Account</span>
                  <span onClick={handleWishlist}>Wishlist</span>
                  <span onClick={handleOrders}>Orders</span>
                  <span onClick={handleCoupons}>Referrals/Coupons</span>
                  <span onClick={handleHelp}>Help</span>
                  <span onClick={handleSetting}>Setting</span>
                  <span onClick={handleLogout}>Logout</span>
                </div>
              )}
            </div>
          )}
        </nav>

        <div className="search-cart">
          <img
            src={Search}
            alt="Search Icon"
            className="search-icon"
            onClick={() => setShowSearchOverlay(true)}
          />

          <img
            src="https://cdn-icons-png.flaticon.com/512/34/34568.png"
            alt="Cart Icon"
            className="cart"
          />
        </div>

        <Sidebar />
      </div>

      {showSearchOverlay && (
        <div className="search-overlay">
          <div className="overlay-content">
            <img src={Search} alt="Search" className="search-icon" />
            <input
              type="text"
              placeholder="Search..."
              autoFocus
              onKeyDown={handleSearchKeyDown}
            />
            <button
              className="close-btn"
              onClick={() => setShowSearchOverlay(false)}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
}
