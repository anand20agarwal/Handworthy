import React from 'react';
import '../CSS/Footer.css';
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';

const FooterPC = () => {
  return (
    <footer className="footer">
      <div className="footer-columns">
        {/* Quick Links */}
        <div className="footer-column">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/worthy-deals">Worthy deals</a></li>
            <li><a href="/login">Log in</a></li>
            <li><a href="/cart">Cart</a></li>
            <li><a href="/account">My account</a></li>
          </ul>
        </div>

        {/* Social Media + Description */}
        <div className="footer-column">
          <div className="footer-social">
            <a href="https://www.facebook.com/TryHandworthy/"><FaFacebookF /></a>
            <a href="https://www.instagram.com/tryhandworthy/"><FaInstagram /></a>
            <a href="https://x.com/TryHandworthy"><FaTwitter /></a>
            <a href="https://www.youtube.com/@handworthy5184"><FaYoutube /></a>
          </div>
          <div className="footer-description">
            <p>
              We are here to provide the best customer experience possible by adapting
              a sustainable business model which contributes to the ultimate benefit
              of the consumer.
            </p>
          </div>
        </div>

        {/* Get In Touch */}
        <div className="footer-column">
          <h3>Get In Touch</h3>
          <p>Email: support@handworthy.com</p>
          <p>Phone: +91 6300225271</p>
        </div>
      </div>
    </footer>
  );
};

export default FooterPC;
