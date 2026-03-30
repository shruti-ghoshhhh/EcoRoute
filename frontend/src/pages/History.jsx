import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';

const History = () => {
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchPickups = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/pickups', {
          headers: { 'Authorization': `Bearer ${user?.token}` }
        });
        const data = await res.json();
        setPickups(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPickups();
  }, [user]);

  const mapIcon = (category) => {
    switch (category?.toLowerCase()) {
      case 'plastic': return '♻️';
      case 'organic': return '🌱';
      case 'ewaste': return '💻';
      case 'hazardous': return '☢️';
      default: return '🗑️';
    }
  };

  const getStatusColor = (status) => {
    if (status === 'In-Route') return 'text-amber-600 dark:text-amber-500 border-amber-500/30 bg-amber-500/10';
    return 'text-emerald-700 dark:text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
  };

  return (
    <div className="min-h-screen relative p-6 bg-zinc-50 dark:bg-[#09090b] transition-colors duration-500 text-zinc-800 dark:text-zinc-200 overflow-hidden">
      {/* Subtle Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-0"></div>

      <div className="max-w-5xl mx-auto space-y-8 relative z-10 pt-10">
        <div className="text-center mb-12">
          <motion.div 
            animate={{ y: [0, -10, 0] }} 
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="text-6xl mb-4 grayscale decortaion-0"
          >
            📋
          </motion.div>
          <h1 className="text-4xl font-extrabold text-zinc-800 dark:text-zinc-100 drop-shadow-md">My Pickups</h1>
          <p className="text-zinc-500 mt-2 text-lg">Track your currently scheduled fleets and view your historical impact.</p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 dark:bg-zinc-900/60 backdrop-blur-2xl rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-2xl p-6 md:p-10"
        >
          <div className="flex justify-between items-center border-b border-zinc-200 dark:border-zinc-800 pb-4 mb-6 px-4">
            <span className="text-zinc-500 font-bold uppercase tracking-widest text-sm">Deployment Log</span>
            <span className="text-emerald-600 dark:text-emerald-500 font-bold uppercase tracking-widest text-sm bg-emerald-500/10 px-3 py-1 rounded-full">{pickups.length} Records</span>
          </div>

          {loading ? (
             <div className="text-center text-zinc-500 py-10 animate-pulse font-mono tracking-widest uppercase">Fetching Fleet Records...</div>
          ) : pickups.length === 0 ? (
             <div className="text-center text-zinc-500 py-10 font-bold">No dispatches found! Schedule a pickup to see history here.</div>
          ) : (
            <div className="space-y-4">
              {pickups.map((pickup, idx) => (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: Math.min(idx * 0.05, 0.5) }}
                  key={pickup._id || idx}
                  className={`p-6 rounded-3xl flex flex-col md:flex-row items-center gap-6 border border-zinc-200 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-950/50 hover:border-emerald-500/50 dark:hover:border-emerald-500/30 hover:bg-white dark:hover:bg-zinc-900/80 transition-all shadow-md group`}
                >
                  <div className={`text-4xl w-14 h-14 rounded-2xl flex items-center justify-center border ${getStatusColor(pickup.status)} shadow-sm group-hover:scale-110 transition-transform`}>
                    {mapIcon(pickup.category)}
                  </div>
                  
                  <div className="flex-1 text-center md:text-left">
                    <div className="flex flex-col md:flex-row md:items-center gap-2 mb-1">
                      <h3 className="text-xl font-bold text-zinc-800 dark:text-zinc-100 uppercase tracking-wide">{pickup.category}</h3>
                      <span className="hidden md:block text-zinc-400 dark:text-zinc-600">•</span>
                      <span className="text-zinc-500 dark:text-zinc-400 font-mono text-sm">{pickup.pickupId || pickup._id}</span>
                    </div>
                    <p className="text-sm font-bold text-zinc-500 tracking-widest uppercase mt-1">
                      Scheduled: <span className="text-emerald-700 dark:text-zinc-300">{pickup.date}</span> | Volume: <span className="text-zinc-600 dark:text-zinc-300">{pickup.volume}</span>
                    </p>
                  </div>

                  <div className="ml-auto mt-4 md:mt-0">
                    <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold tracking-widest uppercase border ${getStatusColor(pickup.status)}`}>
                      {pickup.status === 'In-Route' && <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>}
                      {pickup.status}
                    </span>
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

export default History;
