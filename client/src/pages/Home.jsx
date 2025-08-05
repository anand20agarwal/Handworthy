import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import '../CSS/Home.css';
import FooterPC from '../Components-Desktop/FooterPc';
import Footer from '../Components-Mobile/Footer';
import '../CSS/AccountCart.css';

export default function Home() {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 599);
  const [count, setCount] = useState(0);



  useEffect(() => {
    setTimeout(() => {
      setCount((count) => count + 1)
    }, 1000);
  });



  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 599);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="home">
      {/* <Header /> */}
      <div className="content">
       <h1> the count is {count}</h1>
      </div>
      {/* {isMobile ? <Footer /> : <FooterPC />} */}
    </div>
  );
}
