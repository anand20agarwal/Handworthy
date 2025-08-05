import React from 'react';
import Header from './pages/Header';
import FooterPc from './Components-Desktop/FooterPc';
import { Outlet, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Footer from './Components-Mobile/Footer';
// import FooterPc from './Components-Desktop/FooterPc';

export default function AppLayout() {

     const [isMobile, setIsMobile] = useState(window.innerWidth <= 599);
  const location = useLocation();
  // Hide header/footer on login/signup/auth pages
  const hideLayout = ['/login', '/signup', '/auth'].includes(location.pathname);

  useEffect(() => {
      const handleResize = () => {
        setIsMobile(window.innerWidth <= 599);
      };
  
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {!hideLayout && <Header />}
      <div style={{ flex: 1 }}>
        <Outlet />
      </div>
      {!hideLayout && (isMobile ? <Footer /> : <FooterPc />)}
    </div>
  );
}
