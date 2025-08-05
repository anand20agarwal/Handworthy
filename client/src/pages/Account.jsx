import React, { useEffect, useState } from 'react';
import { auth } from '../firebase';
import API from '../api';
import '../CSS/AccountCart.css';

export default function Account() {
  const [user, setUser] = useState(null);
  const [dbUser, setDbUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get Firebase user
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          const res = await API.get(`/user?email=${firebaseUser.email}`);
          setDbUser(res.data);
        } catch (err) {
          console.log('Error fetching user from backend by email:', err);
          setDbUser(null);
        }
      } else {
        const token = localStorage.getItem('token');
        console.log('No Firebase user, token in localStorage:', token);
        if (token) {
          try {
            const res = await API.get('/profile', {
              headers: { Authorization: `Bearer ${token}` }
            });
            setDbUser(res.data);
            console.log('Fetched dbUser from /user/me:', res.data);
          } catch (err) {
            console.log('Error fetching user from /user/me:', err);
            setDbUser(null);
          }
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div>Loading...</div>;

  if (!user && !dbUser) return <div>Please log in to view your account.</div>;

  return (
    <div className="account-page">
      <div className="account-card">
        <div style={{ marginBottom: 24 }}>
          <img
            src={user?.photoURL || 'https://ui-avatars.com/api/?name=' + (dbUser?.fname + ' ' + wdbUser?.lname || 'User')}
            alt="User Avatar"
            style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', border: '2px solid #eee' }}
          />
        </div>
        <h2 style={{ marginBottom: 8, color: '#222', fontWeight: 700 }}>Account Details</h2>
        {user && (
          <div style={{ width: '100%', marginBottom: 24 }}>
            <h4 style={{ color: '#666', marginBottom: 8 }}>
              {user.providerData[0]?.providerId === 'phone' ? 'Phone Account' : 'Google Account'}
            </h4>
            <div style={{ background: '#f3f3f7', borderRadius: 8, padding: 12, marginBottom: 8 }}>
              {user.providerData[0]?.providerId === 'phone' ? (
                <>
                  <div><b>Phone:</b> {user.phoneNumber}</div>
                </>
              ) : (
                <>
                  <div><b>Name:</b> {user.displayName || '-'}</div>
                  <div><b>Email:</b> {user.email}</div>
                </>
              )}
            </div>
          </div>
        )}
        {dbUser && (
          <div style={{ width: '100%' }}>
            <h4 style={{ color: '#666', marginBottom: 8 }}>Handworthy Account</h4>
            <div style={{ background: '#f3f3f7', borderRadius: 8, padding: 12 }}>
              <div><b>Name:</b> {dbUser.fname} {dbUser.lname}</div>
              <div><b>Email:</b> {dbUser.email}</div>
              <div><b>Phone:</b> {dbUser.phone}</div>
              <div><b>Address:</b> {dbUser.address}</div>
              <div><b>Pincode:</b> {dbUser.pincode}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
