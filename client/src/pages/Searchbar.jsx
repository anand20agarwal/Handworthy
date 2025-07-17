import React from 'react';
import '../CSS/Searchbar.css';

function Searchbar() {
  return (
    <div className="searchbar-container">
      <input
        type="text"
        placeholder="Search..."
        className="search-bar-pc"
      />
    </div>
  );
}

export default Searchbar;
