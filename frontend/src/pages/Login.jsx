import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { GoogleLogin } from '@react-oauth/google';

const SleekAnimalBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 bg-transparent flex items-center justify-center">
    <svg className="absolute w-full h-[150%] opacity-20 dark:opacity-[0.03] text-emerald-600 dark:text-emerald-400 select-none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox="0 0 1000 1000">
      <path d="M0,200 Q250,50 500,200 T1000,200" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.8" />
      <path d="M0,350 Q250,200 500,350 T1000,350" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
      <path d="M0,500 Q250,350 500,500 T1000,500" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.4" />
      <path d="M0,650 Q250,500 500,650 T1000,650" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
      <path d="M0,800 Q250,650 500,800 T1000,800" fill="none" stroke="currentColor" strokeWidth="0.25" opacity="0.1" />
    </svg>
    
    <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }} className="absolute text-5xl opacity-40 dark:opacity-20 top-[18%] left-[20%]">🦊</motion.div>
    <motion.div animate={{ y: [0, -15, 0] }} transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }} className="absolute text-6xl opacity-30 dark:opacity-10 top-[28%] right-[15%]">🐢</motion.div>
    <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }} className="absolute text-4xl opacity-50 dark:opacity-30 bottom-[35%] left-[10%]">🦜</motion.div>
    <motion.div animate={{ y: [0, -12, 0] }} transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }} className="absolute text-7xl opacity-20 dark:opacity-5 bottom-[20%] right-[25%]">🐘</motion.div>
  </div>
);

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [welcomeMsg, setWelcomeMsg] = useState('');
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      
      if (res.ok) {
        setWelcomeMsg(`Welcome back, ${data.name.split(' ')[0]}! 🌍`);
        setTimeout(() => {
          login({ email: data.email, name: data.name, role: data.role, token: data.token, points: data.points });
          navigate(data.role === 'admin' ? '/admin' : '/dashboard');
        }, 1500);
      } else {
        alert(data.message || 'Login failed');
        setLoading(false);
      }
    } catch (err) {
      alert('Network Error connecting to EcoRoute Server.');
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: credentialResponse.credential })
      });
      const data = await res.json();
      
      if (res.ok) {
        setWelcomeMsg(`Welcome, ${data.name.split(' ')[0]}! 🌿`);
        setTimeout(() => {
          login({ email: data.email, name: data.name, role: data.role, token: data.token, points: data.points });
          navigate('/dashboard');
        }, 1500);
      } else {
        alert(data.message || 'Google Auth Failed');
      }
    } catch (err) {
      alert('Network Error connecting to EcoRoute Server via Google.');
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden bg-zinc-50 dark:bg-[#09090b] transition-colors duration-500">
      
      <SleekAnimalBackground />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="w-full max-w-md bg-white/80 dark:bg-zinc-900/60 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl backdrop-blur-xl p-8 relative z-10 min-h-[450px] flex flex-col justify-center"
      >
        <AnimatePresence mode="wait">
          {welcomeMsg ? (
            <motion.div 
              key="welcome"
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0 }}
              className="flex flex-col items-center text-center space-y-4"
            >
              <div className="text-6xl mb-2 animate-bounce grayscale">🌍</div>
              <h2 className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 leading-tight">{welcomeMsg}</h2>
              <p className="text-sm font-bold text-zinc-500 tracking-widest uppercase animate-pulse">Entering EcoRoute...</p>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="text-center mb-6">
                <motion.div className="text-5xl mb-3">🌍</motion.div>
                <h1 className="text-3xl font-extrabold text-zinc-800 dark:text-zinc-100">Sign In</h1>
                <p className="text-zinc-500 mt-2 text-sm">Welcome back to the EcoRoute ecosystem</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">Email Address</label>
                  <input 
                    type="email" 
                    required
                    className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-zinc-800 dark:text-zinc-200 shadow-inner"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">Password</label>
                  <input 
                    type="password" 
                    required
                    className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-zinc-800 dark:text-zinc-200 shadow-inner"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-emerald-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-emerald-500 transition-colors shadow-lg focus:ring-2 focus:ring-emerald-400 flex justify-center items-center"
                >
                  {loading ? <span className="animate-spin text-xl">⚪</span> : 'Sign In'}
                </motion.button>
              </form>

              <div className="mt-6 flex items-center justify-between">
                <span className="border-b border-zinc-200 dark:border-zinc-800 w-1/5"></span>
                <span className="text-xs text-zinc-400 uppercase tracking-widest font-semibold text-center w-3/5">Or Continue With</span>
                <span className="border-b border-zinc-200 dark:border-zinc-800 w-1/5"></span>
              </div>

              <div className="mt-6 flex justify-center">
                <GoogleLogin 
                  onSuccess={handleGoogleSuccess} 
                  onError={() => console.log('Google Auth Failed')}
                  theme="filled_black"
                  shape="pill"
                  text="continue_with"
                />
              </div>

              <p className="text-center mt-6 text-zinc-500 dark:text-zinc-400 text-sm">
                Don't have an account? <Link to="/register" className="text-emerald-600 dark:text-emerald-500 font-bold hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors">Sign Up</Link>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Login;
