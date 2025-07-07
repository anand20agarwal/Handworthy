import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import '../CSS/Home.css';
import Search from '../Images/Search.png';

export default function Home() {
  const navigate = useNavigate();
  const [showSearchOverlay, setShowSearchOverlay] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) navigate('/');
  }, [navigate]);

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      setShowSearchOverlay(false);
      console.log('Search submitted:', e.target.value);
    }
  };

  return (
    <div className="home">
      <Header />

      {/* Regular search bar under header */}
      <div className="search-container">
        <img src={Search} alt="Search" className="search-icon" />
        <input
          type="text"
          placeholder="Search..."
          onFocus={() => setShowSearchOverlay(true)}
          readOnly // makes sure it doesn't type here
        />
      </div>

      <div className="content">
        <h1>Welcome to the Home Page!</h1>
        <p>This is your protected content.</p>
      </div>

      {/* Overlay search modal */}
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
    </div>
  );
}
