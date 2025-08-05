import React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import '../CSS/AccountCart.css';


export default function Cart() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      const token = localStorage.getItem('token');
      if (!user && !token) {
        navigate('/auth');
      } else {
        setChecking(false);
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  if (checking) return null;

  return (
    <div className="cart-page">
      <div className="cart-card">
        <h2 style={{ color: '#222', fontWeight: 700 }}>Your Cart</h2>
        <p style={{ color: '#666' }}>Your cart is currently empty.</p>
      </div>
    </div>
  );
}

