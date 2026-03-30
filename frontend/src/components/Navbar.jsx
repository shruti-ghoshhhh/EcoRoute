import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { motion, AnimatePresence } from 'framer-motion';
import useThemeStore from '../store/themeStore';

const Navbar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const { theme, toggleTheme } = useThemeStore();

  const getInitials = (name) => {
    if (!name) return 'US';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  if (!user || location.pathname === '/login' || location.pathname === '/register') return null;

  return (
    <nav className="bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800/80 sticky top-0 z-50 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/dashboard" className="text-2xl font-extrabold text-emerald-400 flex items-center gap-2 drop-shadow-[0_0_15px_rgba(52,211,153,0.3)]">
          <span className="text-3xl grayscale brightness-150">🌍</span> EcoRoute
        </Link>
        
        {/* Desktop Links */}
        <div className="hidden md:flex space-x-8 items-center font-medium text-zinc-400">
          <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} className={`hover:text-emerald-400 transition-colors ${location.pathname === '/dashboard' || location.pathname === '/admin' ? 'text-emerald-400' : ''}`}>Home</Link>
          {user.role !== 'admin' && (
            <>
              <Link to="/pickup" className={`hover:text-emerald-400 transition-colors ${location.pathname === '/pickup' ? 'text-emerald-400' : ''}`}>Schedule Pickup</Link>
              <Link to="/history" className={`hover:text-emerald-400 transition-colors ${location.pathname === '/history' ? 'text-emerald-400' : ''}`}>My Pickups</Link>
              <Link to="/learn" className={`hover:text-emerald-400 transition-colors ${location.pathname === '/learn' ? 'text-emerald-400' : ''}`}>Save Animals</Link>
              <Link to="/leaderboard" className={`hover:text-emerald-400 transition-colors ${location.pathname === '/leaderboard' ? 'text-emerald-400' : ''}`}>Leaderboard</Link>
              <Link to="/contact" className={`hover:text-emerald-400 transition-colors ${location.pathname === '/contact' ? 'text-emerald-400' : ''}`}>Contact Us</Link>
            </>
          )}
        </div>

        <div className="hidden md:flex space-x-6 items-center">
          <button onClick={toggleTheme} className="text-zinc-500 hover:text-emerald-400 text-lg transition-colors p-2 rounded-full hidden md:block" title="Toggle Theme">
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <Link to="/login" onClick={logout} className="text-zinc-500 font-medium hover:text-emerald-400 transition-colors">Log out</Link>
          <div className="h-10 w-10 bg-emerald-500 dark:bg-emerald-900/40 text-white dark:text-emerald-400 rounded-full flex items-center justify-center font-bold border border-transparent dark:border-emerald-500/30 shadow-md shadow-emerald-500/20 dark:shadow-[0_0_15px_rgba(52,211,153,0.15)] content-center uppercase tracking-widest transition-colors">
            {getInitials(user.name)}
          </div>
        </div>

        {/* Mobile Hamburger Button */}
        <button className="md:hidden text-zinc-400 hover:text-emerald-400 focus:outline-none" onClick={() => setIsMobileOpen(true)}>
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.div 
              initial={{ x: '100%' }} 
              animate={{ x: 0 }} 
              exit={{ x: '100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
              className="fixed top-0 right-0 h-full w-64 bg-zinc-50 dark:bg-zinc-950 border-l border-zinc-200 dark:border-zinc-800 p-6 z-50 md:hidden flex flex-col shadow-2xl"
            >
              <div className="flex justify-between items-center mb-10">
                <span className="text-xl font-bold text-emerald-400 tracking-widest uppercase">Menu</span>
                <button onClick={() => setIsMobileOpen(false)} className="text-zinc-500 hover:text-emerald-400 focus:outline-none">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex flex-col space-y-6 text-zinc-400 font-medium">
                <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} onClick={() => setIsMobileOpen(false)} className={`hover:text-emerald-400 transition-colors ${location.pathname === '/dashboard' || location.pathname === '/admin' ? 'text-emerald-400 font-bold' : ''}`}>Home</Link>
                {user.role !== 'admin' && (
                  <>
                    <Link to="/pickup" onClick={() => setIsMobileOpen(false)} className={`hover:text-emerald-400 transition-colors ${location.pathname === '/pickup' ? 'text-emerald-400 font-bold' : ''}`}>Schedule Pickup</Link>
                    <Link to="/history" onClick={() => setIsMobileOpen(false)} className={`hover:text-emerald-400 transition-colors ${location.pathname === '/history' ? 'text-emerald-400 font-bold' : ''}`}>My Pickups</Link>
                    <Link to="/learn" onClick={() => setIsMobileOpen(false)} className={`hover:text-emerald-400 transition-colors ${location.pathname === '/learn' ? 'text-emerald-400 font-bold' : ''}`}>Save Animals</Link>
                    <Link to="/leaderboard" onClick={() => setIsMobileOpen(false)} className={`hover:text-emerald-400 transition-colors ${location.pathname === '/leaderboard' ? 'text-emerald-400 font-bold' : ''}`}>Leaderboard</Link>
                    <Link to="/contact" onClick={() => setIsMobileOpen(false)} className={`hover:text-emerald-400 transition-colors ${location.pathname === '/contact' ? 'text-emerald-400 font-bold' : ''}`}>Contact Us</Link>
                  </>
                )}
              </div>

              <div className="mt-auto border-t border-zinc-200 dark:border-zinc-800 pt-6 flex flex-col space-y-6">
                <button onClick={toggleTheme} className="text-zinc-500 font-medium hover:text-emerald-400 transition-colors flex items-center gap-2 cursor-pointer text-left focus:outline-none">
                  <span className="text-xl">{theme === 'dark' ? '☀️' : '🌙'}</span> Toggle Theme
                </button>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-emerald-500 dark:bg-emerald-900/40 text-white dark:text-emerald-400 rounded-full flex items-center justify-center font-bold border border-transparent dark:border-emerald-500/30 text-lg uppercase tracking-widest shadow-md shadow-emerald-500/20 dark:shadow-none transition-colors">
                    {getInitials(user.name)}
                  </div>
                  <span className="text-zinc-700 dark:text-zinc-300 font-bold text-lg">{user.name}</span>
                </div>
                <Link to="/login" onClick={() => { logout(); setIsMobileOpen(false); }} className="text-zinc-500 font-medium hover:text-emerald-400 transition-colors flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                  Log out
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
