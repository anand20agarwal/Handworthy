import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Sidebar.css';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleToggleSidebar = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsOpen(false);
    navigate('/login');
  };

  return (
    <>
      {!isOpen && (
        <button className="menu-btn" onClick={handleToggleSidebar}>
          &#8942;
        </button>
      )}

      {/* Sidebar content */}
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <button className="close-btn" onClick={handleToggleSidebar}>
          X
        </button>
        <div className="menu-button">
          <h2 className='h2-menu'>Menu</h2>
          <a href="#">Home</a>
          <a href="#">Profile</a>
          <a href="#">Settings</a>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </>
  );
}
