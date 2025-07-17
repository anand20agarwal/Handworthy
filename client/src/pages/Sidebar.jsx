import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Sidebar.css';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.profile-wrapper')) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleToggleSidebar = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/login');
    setIsOpen(false);
  };

  const handleLogin = () => {
    navigate('/login');
    setIsOpen(false);
  };

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const navigateAndClose = (path) => {
    navigate(path);
    setIsDropdownOpen(false);
    setIsOpen(false);
  };

  return (
    <>
      {!isOpen && (
        <button
          className="menu-btn"
          aria-label="Open sidebar"
          onClick={handleToggleSidebar}
        >
          &#8942;
        </button>
      )}

      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <button
          className="close-btn"
          aria-label="Close sidebar"
          onClick={handleToggleSidebar}
        >
          X
        </button>

        <div className="menu-button">
          <h2 className="h2-menu">Menu</h2>
          <button onClick={() => navigateAndClose('/')}>Home</button>
          <button onClick={() => navigateAndClose('/why-handworthy')}>
            Why Handworthy
          </button>
          <button onClick={() => navigateAndClose('/quality-check')}>
            Quality Check
          </button>
          <button onClick={() => navigateAndClose('/warranty')}>
            Warranty
          </button>
          <button onClick={() => navigateAndClose('/support')}>
            Support
          </button>
          <button onClick={() => navigateAndClose('/blog')}>Blog</button>
          <button onClick={() => navigateAndClose('/about')}>About</button>

          {/* {!isLoggedIn ? (
            <button className="login-btn" onClick={handleLogin}>
              Login
            </button>
          ) : (
            <div className="profile-wrapper">
              <button
                className="profile-btn"
                aria-haspopup="true"
                aria-expanded={isDropdownOpen}
                onClick={toggleDropdown}
              >
                My Account ⌄
              </button>
              {isDropdownOpen && (
                <div className="dropdown-menu">
                  <button onClick={() => navigateAndClose('/profile')}>
                    Account
                  </button>
                  <button onClick={() => navigateAndClose('/wishlist')}>
                    Wishlist
                  </button>
                  <button onClick={() => navigateAndClose('/orders')}>
                    Orders
                  </button>
                  <button onClick={() => navigateAndClose('/coupons')}>
                    Referrals/Coupons
                  </button>
                  <button onClick={() => navigateAndClose('/help')}>
                    Help
                  </button>
                  <button onClick={() => navigateAndClose('/settings')}>
                    Setting
                  </button>
                  <button onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>
          )} */}
        </div>
      </div>
    </>
  );
}
