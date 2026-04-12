import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { getRank } from '../utils/levelUtils';
import { useAuthStore } from '../store/authStore';

const API_URL = import.meta.env.VITE_API_URL || '';

const RANK_COLORS = [
  'border-yellow-500/40 bg-yellow-500/10',
  'border-zinc-400/40 bg-zinc-400/10',
  'border-amber-700/50 bg-amber-700/20',
];

const FloatingIcons = () => {
  const icons = [
    { emoji: '🏆', size: 'text-6xl', left: '10%', delay: 0 },
    { emoji: '🌟', size: 'text-5xl', left: '25%', delay: 2 },
    { emoji: '🏅', size: 'text-7xl', left: '50%', delay: 5 },
    { emoji: '♻️', size: 'text-6xl', left: '75%', delay: 1 },
    { emoji: '🌍', size: 'text-8xl', left: '40%', delay: 6 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20 z-0 select-none">
      {icons.map((icon, index) => (
        <motion.div
          key={index}
          className={`absolute bottom-[-150px] ${icon.size} grayscale`}
          style={{ left: icon.left }}
          animate={{ y: ['0vh', '-120vh'], rotate: [0, 90, 180, 270, 360] }}
          transition={{ duration: 25 + Math.random() * 10, delay: icon.delay, repeat: Infinity, ease: "linear" }}
        >
          {icon.emoji}
        </motion.div>
      ))}
    </div>
  );
};

const Leaderboard = () => {
  const { user } = useAuthStore();
  const [topUsers, setTopUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/users/leaderboard`, {
          headers: { Authorization: `Bearer ${user?.token}` }
        });
        setTopUsers(res.data);
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
      } finally {
        setLoading(false);
      }
    };
    if (user?.token) fetchLeaderboard();
  }, [user]);

  const getRowColor = (idx) => RANK_COLORS[idx] || 'border-zinc-800/50 bg-zinc-800/30 hover:border-emerald-500/30';

  return (
    <div className="min-h-screen relative flex flex-col items-center bg-[#09090b] p-6 text-zinc-200 overflow-hidden">
      <FloatingIcons />

      <div className="w-full max-w-4xl relative z-10 mt-12 mb-20">
        <div className="text-center mb-12">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className="text-7xl mb-6 grayscale"
          >
            🏆
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-zinc-100">Global Leaderboard</h1>
          <p className="text-zinc-500 mt-4 text-lg">The Top 10 EcoWarriors actively healing our planet.</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-zinc-900/60 backdrop-blur-2xl rounded-[2.5rem] border border-zinc-800 shadow-2xl p-6 md:p-10"
        >
          <div className="flex justify-between items-center mb-8 px-4 border-b border-zinc-800 pb-4">
            <span className="text-zinc-600 font-bold uppercase tracking-widest text-sm">Operative</span>
            <span className="text-zinc-600 font-bold uppercase tracking-widest text-sm">Reputation</span>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-20 rounded-3xl bg-zinc-800/50 animate-pulse" />
              ))}
            </div>
          ) : topUsers.length === 0 ? (
            <div className="text-center py-16 text-zinc-500">
              <div className="text-5xl mb-4">🌱</div>
              <p className="font-bold">No operatives ranked yet.</p>
              <p className="text-sm mt-2">Complete pickups to earn points and appear here!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {topUsers.map((u, idx) => (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.08 }}
                  key={u._id}
                  className={`p-5 md:p-6 rounded-3xl flex items-center gap-6 border ${getRowColor(idx)} transition-all hover:scale-[1.02] cursor-default shadow-lg`}
                >
                  <div className="text-3xl w-10 text-center drop-shadow-lg font-mono">
                    {idx === 0 ? '👑' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : getRank(u.points).icon}
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-zinc-950/50 border border-zinc-700/50 text-emerald-400 rounded-full items-center justify-center font-bold text-lg uppercase tracking-widest hidden sm:flex">
                      {u.name.substring(0, 2)}
                    </div>
                    <div>
                      <h3 className="text-lg md:text-xl font-bold text-zinc-100">{u.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">Rank #{idx + 1}</p>
                        <span className="text-zinc-600">•</span>
                        <p className="text-[10px] text-emerald-500 uppercase tracking-widest font-black">{getRank(u.points).title}</p>
                      </div>
                    </div>
                  </div>

                  <div className="ml-auto flex items-center gap-2">
                    <span className="text-xl md:text-2xl font-mono font-extrabold text-emerald-400 tracking-wider">
                      {u.points.toLocaleString()}
                    </span>
                    <span className="text-xs text-emerald-500/50 uppercase font-bold tracking-widest hidden sm:inline">PTS</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Leaderboard;
