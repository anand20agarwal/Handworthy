import React, { useState, useRef } from 'react';
import '../CSS/Searchbar.css';

const SUGGESTIONS = [
  'Smart Watches',
  'Earbuds',
  'Fitness Bands',
  'Bluetooth Speakers',
];

function Searchbar() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [search, setSearch] = useState('');
  const inputRef = useRef(null);

  // Filter suggestions based on input
  const filtered = SUGGESTIONS.filter(opt =>
    opt.toLowerCase().includes(search.toLowerCase())
  );

  // Hide dropdown on click outside
  React.useEffect(() => {
    function handleClick(e) {
      if (inputRef.current && !inputRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    }
    if (showDropdown) {
      document.addEventListener('mousedown', handleClick);
    }
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showDropdown]);

  return (
    <div className="searchbar-container" ref={inputRef}>
      <input
        type="text"
        placeholder="Search..."
        className="search-bar-pc"
        value={search}
        onFocus={() => setShowDropdown(true)}
        onChange={e => setSearch(e.target.value)}
        autoComplete="off"
      />
      {showDropdown && (
        <div className="searchbar-dropdown">
          {filtered.length > 0 ? filtered.map(opt => (
            <div
              key={opt}
              className="searchbar-dropdown-item"
              onMouseDown={() => {
                setSearch(opt);
                setShowDropdown(false);
              }}
            >
              {opt}
            </div>
          )) : (
            <div className="searchbar-no-results">No results</div>
          )}
        </div>
      )}
    </div>
  );
}

export default Searchbar;
