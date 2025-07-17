import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import '../CSS/Home.css';
import FooterPC from '../Components-Desktop/FooterPc';
import Footer from '../Components-Mobile/Footer';

export default function Home() {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 599);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 599);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="home">
      <Header />
      <div className="content">
        <h1>Welcome to the Home Page!</h1>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit...</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit...</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit...</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit...</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit...</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit...</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit...</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit...</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit...</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit...</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit...</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit...</p>
      </div>
      {isMobile ? <Footer /> : <FooterPC />}
    </div>
  );
}
