import { motion } from 'framer-motion';

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
          animate={{
            y: ['0vh', '-120vh'],
            rotate: [0, 90, 180, 270, 360]
          }}
          transition={{
            duration: 25 + Math.random() * 10,
            delay: icon.delay,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          {icon.emoji}
        </motion.div>
      ))}
    </div>
  );
};

const Leaderboard = () => {
  const topUsers = [
    { rank: 1, name: "Sarah Jenkins", points: 14250, icon: "👑", color: "border-yellow-500/30 bg-yellow-500/10" },
    { rank: 2, name: "David Lora", points: 11400, icon: "🥈", color: "border-zinc-400/30 bg-zinc-400/10" },
    { rank: 3, name: "Elena Rostova", points: 9800, icon: "🥉", color: "border-amber-700/40 bg-amber-700/20" },
    { rank: 4, name: "Marcus Torres", points: 7100, icon: "४", color: "border-zinc-800/50 bg-zinc-800/30 hover:border-emerald-500/30" },
    { rank: 5, name: "Jessica Wu", points: 6300, icon: "५", color: "border-zinc-800/50 bg-zinc-800/30 hover:border-emerald-500/30" },
    { rank: 6, name: "Alex Chen", points: 5900, icon: "६", color: "border-zinc-800/50 bg-zinc-800/30 hover:border-emerald-500/30" },
    { rank: 7, name: "Mohammed Ali", points: 5100, icon: "७", color: "border-zinc-800/50 bg-zinc-800/30 hover:border-emerald-500/30" },
    { rank: 8, name: "Chris Evans", points: 4200, icon: "८", color: "border-zinc-800/50 bg-zinc-800/30 hover:border-emerald-500/30" },
    { rank: 9, name: "Sophia Martinez", points: 3100, icon: "९", color: "border-zinc-800/50 bg-zinc-800/30 hover:border-emerald-500/30" },
    { rank: 10, name: "Liam O'Connor", points: 2800, icon: "१०", color: "border-zinc-800/50 bg-zinc-800/30 hover:border-emerald-500/30" }
  ];

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
          
          <div className="space-y-4">
            {topUsers.map((user, idx) => (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                key={user.rank} 
                className={`p-5 md:p-6 rounded-3xl flex items-center gap-6 border ${user.color} transition-all hover:scale-[1.02] cursor-default shadow-lg`}
              >
                <div className="text-3xl w-10 text-center drop-shadow-lg text-emerald-400 font-mono">
                  {user.icon}
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-zinc-950/50 border border-zinc-700/50 text-emerald-400 rounded-full flex items-center justify-center font-bold text-lg uppercase tracking-widest hidden sm:flex">
                    {user.name.substring(0, 2)}
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-zinc-100">{user.name}</h3>
                    <p className="text-xs text-zinc-400 mt-1 uppercase tracking-widest font-bold">Global Rank #{user.rank}</p>
                  </div>
                </div>

                <div className="ml-auto flex items-center gap-2">
                  <span className="text-xl md:text-2xl font-mono font-extrabold text-emerald-400 tracking-wider">
                    {user.points.toLocaleString()}
                  </span>
                  <span className="text-xs text-emerald-500/50 uppercase font-bold tracking-widest hidden sm:inline">PTS</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Leaderboard;
