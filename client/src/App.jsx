import { Routes, Route, Navigate } from 'react-router-dom';
import Auth from './pages/Auth';
import Home from './pages/Home';
import PrivacyPolicy from './pages/PrivacyPolicy';

export default function App() {
  return (
    <Routes>
      {/* <Route path="/" element={<Navigate to="/login" />} />  */}
      <Route path="/login" element={<Auth  />} />
      <Route path="/signup" element={<Auth  />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/" element={<Home />}/>
    </Routes>
  );
}
