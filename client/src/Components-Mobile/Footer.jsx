import React from 'react';
import { Link } from 'react-router-dom';
import '../CSS/FooterMobile.css';
import Homeimg from '../Images/Home.svg';
import Wishlistimg from '../Images/Heart.svg';
import Profileimg from '../Images/Profile-user.png';

function Footer() {
  return (
    <div className="footer-mobile">
      <div className="footer-links">
        <Link to="/"><img src={Homeimg} alt="Home" /></Link>
        <Link to="/wishlist"><img src={Wishlistimg} alt="Wishlist" /></Link>
        <Link to="/profile"><img src={Profileimg} alt="Profile" /></Link>
      </div>
    </div>
  );
}

export default Footer;
