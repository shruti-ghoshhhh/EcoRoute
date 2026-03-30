import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AnimalEdu from './pages/AnimalEdu';
import AdminDashboard from './pages/AdminDashboard';
import EcoBot from './components/EcoBot';
import ProtectedRoute from './components/ProtectedRoute';
import Pickup from './pages/Pickup';
import ContactUs from './pages/ContactUs';
import Leaderboard from './pages/Leaderboard';
import History from './pages/History';
import { GoogleOAuthProvider } from '@react-oauth/google';
import useThemeStore from './store/themeStore';
import { useAuthStore } from './store/authStore';
import { useEffect } from 'react';

function App() {
  const initTheme = useThemeStore((state) => state.initTheme);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    initTheme();
  }, [initTheme]);

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || 'UNSET'}>
      <Router>
        <div className="min-h-screen flex flex-col font-sans transition-colors duration-300 bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-200">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Navigate to={user?.role === 'admin' ? '/admin' : '/dashboard'} replace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/pickup" element={<ProtectedRoute><Pickup /></ProtectedRoute>} />
              <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
              <Route path="/learn" element={<ProtectedRoute><AnimalEdu /></ProtectedRoute>} />
              <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
              <Route path="/contact" element={<ProtectedRoute><ContactUs /></ProtectedRoute>} />
              <Route path="/admin" element={<ProtectedRoute requireAdmin={true}><AdminDashboard /></ProtectedRoute>} />
            </Routes>
          </main>
          <EcoBot />
        </div>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
