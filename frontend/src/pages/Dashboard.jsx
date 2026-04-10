import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Popup, Circle, useMap } from 'react-leaflet';
import { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import { getRank } from '../utils/levelUtils';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Upgraded Smart Map Threat Data
const SMART_ZONES = [
  { id: 1, pos: [40.7128, -74.0060], rad: 800, type: "Pending Pickup", location: "New York, USA", level: "URGENT", fill: "#3b82f6", color: "#2563eb" }, // Blue
  { id: 2, pos: [34.0522, -118.2437], rad: 1200, type: "Dumping Hotspot", location: "Los Angeles, USA", level: "SEVERE", fill: "#f59e0b", color: "#d97706" }, // Amber
  { id: 3, pos: [51.5074, -0.1278], rad: 900, type: "High Pollution Zone", location: "London, UK", level: "CRITICAL", fill: "#ef4444", color: "#dc2626" }, // Red
  { id: 4, pos: [35.6762, 139.6503], rad: 700, type: "Pending Pickup", location: "Tokyo, Japan", level: "URGENT", fill: "#3b82f6", color: "#2563eb" },
  { id: 5, pos: [19.0760, 72.8777], rad: 1500, type: "High Pollution Zone", location: "Mumbai, India", level: "CRITICAL", fill: "#ef4444", color: "#dc2626" },
  { id: 6, pos: [-33.8688, 151.2093], rad: 600, type: "Dumping Hotspot", location: "Sydney, Australia", level: "SEVERE", fill: "#f59e0b", color: "#d97706" },
];

const MapFlyTo = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 12, { duration: 1.5 });
  }, [center, map]);
  return null;
};

const Dashboard = () => {
  const { user } = useAuthStore();
  const [activeLocation, setActiveLocation] = useState(SMART_ZONES[0].pos);
  const MISSIONS = [
    { title: "Collect 5kg Recycled Plastic", progress: 60, target: "5kg", points: "+50 XP" },
    { title: "Complete 3 Pickups", progress: 33, target: "1/3 Done", points: "+150 XP" },
    { title: "Calculate 5 EcoRoutes", progress: 0, target: "0/5 Done", points: "+20 XP" },
  ];

  // Dynamic Leveling & Title Algorithm via Utils
  const currentPoints = user?.points || 0;
  const rank = getRank(currentPoints);
  const progressPercent = rank.progressPercent;

  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [pickups, setPickups] = useState([]);

  useEffect(() => {
    const fetchPickups = async () => {
      try {
        const res = await axios.get('/api/pickups', {
          headers: { Authorization: `Bearer ${user?.token}` }
        });
        setPickups(res.data);
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      }
    };
    if (user?.token) fetchPickups();
  }, [user]);

  // Real Stats Calculation Engine 🌍
  const completedPickups = pickups.filter(p => p.status === 'Completed');
  const getWeight = (volume) => {
    switch(volume?.toLowerCase()) {
      case 'small': return 10;
      case 'large': return 25;
      case 'industrial': return 200;
      default: return 0;
    }
  };
  const totalWaste = completedPickups.reduce((acc, p) => acc + getWeight(p.volume), 0);
  const co2Saved = (totalWaste * 2.5) + (currentPoints * 0.1);

  const submitQuickFeedback = async (e) => {
    e.preventDefault();
    if (!feedbackMsg.trim()) return;
    try {
      await axios.post('/api/feedback/submit', { message: `[Dashboard Quick Action] - ${feedbackMsg}` }, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      setFeedbackSent(true);
      setFeedbackMsg('');
      setTimeout(() => setFeedbackSent(false), 5000);
    } catch (error) {
      alert("Failed to submit feedback natively.");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#09090b] transition-colors duration-500 p-6 text-zinc-800 dark:text-zinc-200">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Gamified Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm p-6 rounded-[2rem] border border-zinc-200 dark:border-zinc-800/80 shadow-lg">
          <div className="mb-4 md:mb-0 text-center md:text-left flex items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-500 to-emerald-300 flex items-center justify-center text-white text-3xl shadow-lg shadow-emerald-500/40">
              {rank.icon}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">Level {rank.level} <span className="text-emerald-600 dark:text-emerald-500">{rank.title}</span></h1>
              <div className="w-48 h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full mt-2 overflow-hidden border border-zinc-300 dark:border-zinc-700">
                <div className="h-full bg-emerald-500 shadow-[0_0_10px_#10b981] transition-all duration-1000" style={{ width: `${progressPercent}%` }}></div>
              </div>
              <p className="text-zinc-500 mt-1 uppercase tracking-widest text-[10px] font-bold">
                {rank.level === 11 ? 'MAX RANK ACHIEVED ✨' : `${rank.remainingXP} XP to Level ${rank.level + 1}`}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-500 border border-amber-200 dark:border-amber-500/30 font-black py-3 px-6 rounded-3xl flex flex-col items-center min-w-[120px]">
              <span className="text-xl font-mono">{totalWaste}kg</span>
              <span className="text-[10px] uppercase tracking-widest opacity-70">Waste Fixed</span>
            </div>
            <div className="bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-500 border border-blue-200 dark:border-blue-500/30 font-black py-3 px-6 rounded-3xl flex flex-col items-center min-w-[120px] shadow-[0_0_15px_rgba(59,130,246,0.1)]">
              <span className="text-xl font-mono">💨 {co2Saved.toFixed(1)}kg</span>
              <span className="text-[10px] uppercase tracking-widest opacity-70">CO2 Offset</span>
            </div>
            <div className="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 border border-emerald-200 dark:border-emerald-500/30 font-black py-3 px-6 rounded-3xl flex flex-col items-center min-w-[120px]">
              <span className="text-xl font-mono">💰 {user?.points || 0}</span>
              <span className="text-[10px] uppercase tracking-widest opacity-70">Eco-Vault</span>
            </div>
          </div>
        </div>

        {/* Core Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Left Column: Missions */}
          <div className="col-span-1 space-y-8">
            {/* Daily Missions */}
            <div className="bg-white dark:bg-zinc-900/40 rounded-[2rem] border border-zinc-200 dark:border-zinc-800/80 p-5 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100">🎯 Daily Quests</h3>
                <span className="text-[10px] animate-pulse text-emerald-500 uppercase font-black bg-emerald-500/10 px-2 rounded tracking-widest">Live</span>
              </div>

              <div className="space-y-4">
                {MISSIONS.map((mission, i) => (
                  <div key={i} className="bg-zinc-50 dark:bg-zinc-950 p-4 border border-zinc-200 dark:border-zinc-800 rounded-xl relative overflow-hidden group">
                    <div className="relative z-10">
                      <p className="font-bold text-sm text-zinc-800 dark:text-zinc-200 flex justify-between">
                        {mission.title} <span className="text-emerald-500">{mission.points}</span>
                      </p>
                      <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full mt-3 overflow-hidden">
                        <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: `${mission.progress}%` }}></div>
                      </div>
                      <p className="text-[10px] text-zinc-500 text-right mt-1 font-mono uppercase">{mission.target}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Real-World Biological Impact Translation */}
            <div className="bg-white dark:bg-zinc-900/40 rounded-[2rem] border border-zinc-200 dark:border-zinc-800/80 p-5 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100">🦊 Biological Impact</h3>
              </div>
              <div className="space-y-3">
                <div className={`p-3 rounded-xl border transition-all ${currentPoints >= 1000 ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30' : 'bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 opacity-50 grayscale'}`}>
                  <p className="font-bold text-sm text-zinc-800 dark:text-zinc-200">🦁 Protected a Lion</p>
                  <p className="text-[10px] text-zinc-500 mt-1">Apex Environmentalism Verified</p>
                </div>
                <div className={`p-3 rounded-xl border transition-all ${currentPoints >= 3000 ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30' : 'bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 opacity-50 grayscale'}`}>
                  <p className="font-bold text-sm text-zinc-800 dark:text-zinc-200">🐘 Saved a Wildlife Corridor</p>
                  <p className="text-[10px] text-zinc-500 mt-1">Sustainable Land Restoration</p>
                </div>
                <div className={`p-3 rounded-xl border transition-all ${currentPoints >= 5500 ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30' : 'bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 opacity-50 grayscale'}`}>
                  <p className="font-bold text-sm text-zinc-800 dark:text-zinc-200">✨ Gaia's Absolute Chosen</p>
                  <p className="text-[10px] text-zinc-500 mt-1">Full planet restoration achieved</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Smart Map Viewer */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="col-span-3 bg-white dark:bg-zinc-900/40 rounded-[2rem] border border-zinc-200 dark:border-zinc-800/80 p-6 flex flex-col h-[800px] shadow-xl"
          >
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-emerald-500 animate-[ping_2s_infinite]">●</span> EcoRoute Spatial Analyzer
              </div>
              <div className="flex gap-2 text-[10px] uppercase font-bold text-zinc-500">
                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Pickups</span>
                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-amber-500"></div> Dumping</span>
                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500"></div> Pollution</span>
              </div>
            </h2>
            <div className="flex-1 rounded-[1.5rem] overflow-hidden border border-zinc-200 dark:border-zinc-800 relative z-0 shadow-inner">

              {/* Map Layer */}
              <div className="w-full h-full dark:brightness-[0.8] dark:contrast-[1.2] dark:invert-[0.9] dark:hue-rotate-180">
                <MapContainer center={activeLocation} zoom={12} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <MapFlyTo center={activeLocation} />

                  {SMART_ZONES.map((zone) => (
                    <Circle
                      key={zone.id}
                      center={zone.pos}
                      pathOptions={{ color: "#ef4444", fillColor: zone.fill, fillOpacity: 0.6, weight: 2, dashArray: "4" }}
                      radius={zone.rad}
                    >
                      <Popup>
                        <div className={`font-bold uppercase tracking-widest text-[10px] mb-1 pb-1`} style={{ color: zone.color, borderBottom: `1px solid ${zone.fill}` }}>{zone.level}</div>
                        <div className="font-black text-zinc-900 mt-1">{zone.type}</div>
                        <div className="text-zinc-600 text-xs mt-1 font-mono">{zone.location}</div>
                      </Popup>
                    </Circle>
                  ))}
                </MapContainer>
              </div>
            </div>

            <div className="mt-6 mb-2">
              <h3 className="font-bold text-lg mb-4 text-zinc-900 dark:text-zinc-100 flex items-center gap-2">📡 Actionable Global Intelligence</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[160px] overflow-y-auto pr-2 pb-2">
                {SMART_ZONES.map((zone) => (
                  <div
                    key={zone.id}
                    onClick={() => setActiveLocation(zone.pos)}
                    className={`p-3 rounded-xl cursor-pointer transition-all border flex flex-col justify-center ${activeLocation === zone.pos ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 shadow-md scale-[1.02]' : 'bg-white/50 dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800 hover:border-emerald-300 dark:hover:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-900'}`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <p className="font-bold text-zinc-800 dark:text-zinc-200 text-sm truncate pr-2">{zone.type}</p>
                      <span className={`text-[9px] font-black uppercase text-white px-2 py-0.5 rounded shadow-sm whitespace-nowrap ${zone.color === '#2563eb' ? 'bg-blue-500' : zone.color === '#d97706' ? 'bg-amber-500' : 'bg-red-500'}`}>{zone.level}</span>
                    </div>
                    <p className="text-[10px] tracking-widest font-mono text-zinc-500">{zone.location}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <Link to="/pickup" className="w-full text-center bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-xl transition-colors shadow-[0_0_20px_rgba(16,185,129,0.3)] block text-lg hover:shadow-[0_0_25px_rgba(16,185,129,0.5)]">
                Schedule Environmental Extraction
              </Link>
            </div>
          </motion.div>

        </div>

        {/* Animal Conservation Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 bg-white/60 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] p-8 md:p-10 backdrop-blur-md shadow-lg"
        >
          <div className="text-center mb-10 max-w-2xl mx-auto">
            <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-white mb-4">What We Do</h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-lg">EcoRoute is built to protect native ecosystems by actively removing hazardous waste and plastics from vulnerable zones.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="relative h-[280px] rounded-3xl overflow-hidden group border border-zinc-200 dark:border-zinc-800 shadow-md">
              <img src="https://images.pexels.com/photos/76957/tree-frog-frog-red-eyed-amphibian-76957.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Frog" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-6">
                <h3 className="text-2xl font-bold text-white">Protecting Amphibians</h3>
              </div>
            </div>
            <div className="relative h-[280px] rounded-3xl overflow-hidden group border border-zinc-200 dark:border-zinc-800 shadow-md">
              <img src="https://images.pexels.com/photos/247431/pexels-photo-247431.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Elephant" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-6">
                <h3 className="text-2xl font-bold text-white">Securing Habitats</h3>
              </div>
            </div>
            <div className="relative h-[280px] rounded-3xl overflow-hidden group border border-zinc-200 dark:border-zinc-800 shadow-md">
              <img src="https://images.pexels.com/photos/709552/pexels-photo-709552.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Clean River" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-6">
                <h3 className="text-2xl font-bold text-white">River Rejuvenation</h3>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Thank You Hero */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 bg-emerald-50 dark:bg-zinc-900/60 border border-emerald-100 dark:border-zinc-800 rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row shadow-2xl relative"
        >
          <div className="md:w-1/2 p-10 md:p-14 flex flex-col justify-center relative z-10 bg-white/40 dark:bg-zinc-900/80 backdrop-blur-sm">
            <div className="text-5xl mb-6 drop-shadow">🐾</div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-zinc-900 dark:text-white mb-6 leading-tight">Thank You For <br /><span className="text-emerald-600 dark:text-emerald-400">Saving Us.</span> 💚</h2>
            <p className="text-zinc-600 dark:text-zinc-400 text-lg leading-relaxed font-medium">
              Every single piece of hazardous waste you report and recycle through EcoRoute directly ensures a safer, cleaner, and healthier planet.
              <br /><br />
              They can't speak, but they appreciate all of your hard work!
            </p>
          </div>
          <div className="md:w-1/2 h-80 md:h-auto overflow-hidden bg-emerald-100 dark:bg-zinc-950/80 flex items-center justify-center">
            <img
              src="/dog.png"
              alt="Cute Smiling Dog Saving the Environment"
              className="w-full h-full object-cover object-center shadow-[0_0_30px_rgba(52,211,153,0.15)]"
            />
          </div>
        </motion.div>

        {/* Quick Feedback Portal */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative overflow-hidden flex flex-col items-center justify-center text-center max-w-4xl mx-auto"
        >
          <h3 className="text-2xl font-black text-white mb-2">Have a suggestion or found a bug?</h3>
          <p className="text-zinc-400 text-sm mb-6">Your voice directly influences our platform development.</p>

          {!feedbackSent ? (
            <form onSubmit={submitQuickFeedback} className="w-full max-w-xl flex gap-3">
              <input
                type="text"
                required
                placeholder="Type your feedback here..."
                className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                value={feedbackMsg}
                onChange={(e) => setFeedbackMsg(e.target.value)}
              />
              <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-6 rounded-xl transition-colors">
                Submit
              </button>
            </form>
          ) : (
            <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold px-8 py-3 rounded-xl flex items-center gap-3">
              ✅ Feedback received!
            </div>
          )}
        </motion.div>

      </div>
    </div>
  );
};

export default Dashboard;
