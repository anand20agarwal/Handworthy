import { Routes, Route, Navigate } from 'react-router-dom';
import Auth from './pages/Auth';
import Home from './pages/Home';
import ProtectedRoute from './pages/ProtectedRoute';
import PrivacyPolicy from './pages/PrivacyPolicy';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />   {/* 👈 redirects '/' to '/login' */}
      <Route path="/login" element={<Auth isLoginDefault={true} />} />
      <Route path="/signup" element={<Auth isLoginDefault={false} />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />

      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
