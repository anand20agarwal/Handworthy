import { Routes, Route } from 'react-router-dom';

import Auth from './pages/Auth';
import AuthOptions from './pages/AuthOptions';
import Home from './pages/Home';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Account from './pages/Account';
import AppLayout from './AppLayout';

import Cart from './pages/Cart';
import PhoneNoAuth from './pages/PhoneNoAuth';

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/account" element={<Account />} />
        <Route path="/cart" element={<Cart />} />
      </Route>
      <Route path="/auth" element={<AuthOptions />} />
      <Route path="/phone-login" element={<PhoneNoAuth />} />
      <Route path="/login" element={<Auth isLoginDefault={true} />} />
      <Route path="/signup" element={<Auth isLoginDefault={false} />} />
    </Routes>
  );
}
