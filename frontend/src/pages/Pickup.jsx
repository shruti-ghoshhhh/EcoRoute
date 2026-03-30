import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import { useAuthStore } from '../store/authStore';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Dynamic Background Environmental Animation
const FloatingIcons = () => {
  const icons = [
    { emoji: '🍃', size: 'text-3xl', left: '10%', delay: 0 },
    { emoji: '🌿', size: 'text-5xl', left: '25%', delay: 2 },
    { emoji: '♻️', size: 'text-4xl', left: '50%', delay: 5 },
    { emoji: '🌍', size: 'text-6xl', left: '75%', delay: 1 },
    { emoji: '🌎', size: 'text-5xl', left: '90%', delay: 3 },
    { emoji: '🌲', size: 'text-4xl', left: '40%', delay: 6 },
    { emoji: '🌳', size: 'text-7xl', left: '5%', delay: 4 },
    { emoji: '🌻', size: 'text-3xl', left: '85%', delay: 7 },
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

function LocationMarker({ position, setPosition }) {
  const map = useMap();

  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });

  useEffect(() => {
    if (position) {
      map.flyTo(position, 15);
    }
  }, [position, map]);

  return position === null ? null : <Marker position={position}></Marker>;
}

const Pickup = () => {
  const [formData, setFormData] = useState({ category: '', volume: '', date: '' });
  const [position, setPosition] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const [showAi, setShowAi] = useState(false);
  const [aiInput, setAiInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const { user } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.category) return alert("Please select a Waste Category via the dropdown or EcoBot!");
    if (!formData.volume) return alert("Please assign a Volume Size!");
    if (!formData.date) return alert("Please specify a Preferred Deployment Date!");
    if (!position) return alert("Please specify your extraction coordinates on the Map!");

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${API_URL}/api/pickups`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify({
          category: formData.category,
          volume: formData.volume,
          date: formData.date,
          position
        })
      });

      if (res.ok) {
        setSubmitted(true);
        setTimeout(() => navigate('/history'), 2500);
      } else {
        const data = await res.json();
        alert(data.error || "Failed to schedule pickup.");
      }
    } catch (err) {
      console.error(err);
      alert("Network Error");
    }
  };

  const getExactLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        () => {
          alert("Location access denied or unavailable. Please click the map manually.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  const askEcoBotForCategory = async () => {
    if (!aiInput.trim()) return;
    setAiLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/chat/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `I am throwing away: "${aiInput}". Which of these exactly 4 categories does it belong to: 'plastic', 'organic', 'ewaste', or 'hazardous'? Reply with ONLY the ONE exact lowercase word of the category.`
        }),
      });
      const data = await res.json();
      let detectedCat = data.reply.trim().toLowerCase().replace(/[^a-z]/g, '');

      if (['plastic', 'organic', 'ewaste', 'hazardous'].includes(detectedCat)) {
        setFormData({ ...formData, category: detectedCat });
        setShowAi(false);
        setAiInput('');
      } else {
        alert("EcoBot couldn't perfectly categorize that. Please select it manually!");
      }
    } catch {
      alert("Error contacting EcoBot. Are you sure the backend server and Gemini API are running?");
    }
    setAiLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#09090b] relative p-6 text-zinc-200 flex flex-col items-center justify-center overflow-hidden">

      {/* Dynamic Background */}
      <FloatingIcons />

      <div className="w-full max-w-2xl relative z-10 my-8">
        {!submitted ? (
          <motion.form
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onSubmit={handleSubmit}
            className="bg-zinc-900/60 backdrop-blur-xl p-8 rounded-3xl border border-zinc-800 shadow-2xl space-y-6"
          >
            {/* Login-style centered header */}
            <div className="text-center mb-8">
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="text-5xl mb-4 grayscale"
              >
                🚛
              </motion.div>
              <h1 className="text-3xl font-extrabold text-zinc-100">Schedule Collection</h1>
              <p className="text-zinc-500 mt-2 text-sm">Deploy an EcoRoute autonomous fleet vehicle securely</p>


            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div className="space-y-2 relative">
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Waste Category</label>
                  <button type="button" onClick={() => setShowAi(!showAi)} className="text-xs text-emerald-400 font-bold hover:text-emerald-300 transition-colors drop-shadow-[0_0_5px_rgba(52,211,153,0.3)]">
                    🌱 Unsure? Ask EcoBot!
                  </button>
                </div>

                {showAi ? (
                  <div className="bg-zinc-950 border border-emerald-500/50 p-3 rounded-xl flex gap-2 shadow-inner">
                    <input
                      type="text"
                      placeholder="e.g. Broken microwave"
                      value={aiInput}
                      onChange={(e) => setAiInput(e.target.value)}
                      className="flex-1 bg-transparent text-sm outline-none text-zinc-200"
                      autoFocus
                    />
                    <button type="button" onClick={askEcoBotForCategory} disabled={aiLoading} className="bg-emerald-600 px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap">
                      {aiLoading ? 'Thinking...' : 'Detect'}
                    </button>
                  </div>
                ) : (
                  <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-4 py-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors text-zinc-800 dark:text-zinc-200 shadow-inner appearance-none cursor-pointer">
                    <option value="" disabled className="text-zinc-600">Select Classification...</option>
                    <option value="plastic">Recyclable Plastics</option>
                    <option value="organic">Organic Compost</option>
                    <option value="ewaste">Electronic Waste (E-Waste)</option>
                    <option value="hazardous">Hazardous / Chemical</option>
                  </select>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-zinc-400 mb-2">Volume Size</label>
                <select onChange={(e) => setFormData({ ...formData, volume: e.target.value })} className="w-full px-4 py-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors text-zinc-800 dark:text-zinc-200 shadow-inner appearance-none cursor-pointer">
                  <option value="" disabled selected className="text-zinc-600">Select Volume...</option>
                  <option value="small">Standard Bin (50L)</option>
                  <option value="large">Large Container (120L)</option>
                  <option value="industrial">Industrial Dumpster</option>
                </select>
              </div>

            </div>

            <div className="space-y-3 pt-4">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-zinc-400 mb-2">Extraction Coordinates</label>
                <button type="button" onClick={getExactLocation} className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-3 py-1.5 rounded-lg border border-zinc-700 transition-colors flex items-center gap-2 shadow-inner">
                  <span className="text-emerald-500 animate-pulse">●</span> Auto-Locate
                </button>
              </div>

              <div className="h-48 w-full rounded-2xl overflow-hidden border border-zinc-800 relative z-0 shadow-inner">
                <div className="w-full h-full brightness-[0.8] contrast-[1.2] invert-[0.9] hue-rotate-180">
                  <MapContainer center={[40.7128, -74.0060]} zoom={12} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <LocationMarker position={position} setPosition={setPosition} />
                  </MapContainer>
                </div>
              </div>

              <input
                type="text"
                readOnly
                value={position ? `Lat: ${position.lat.toFixed(5)}, Lng: ${position.lng.toFixed(5)}` : ''}
                placeholder="Click the map to select your location"
                className="w-full px-4 py-3 bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none text-zinc-600 dark:text-zinc-500 shadow-inner transition-colors font-mono text-center text-sm cursor-not-allowed"
              />
            </div>

            <div className="space-y-2 pt-2">
              <label className="block text-sm font-medium text-zinc-400 mb-2">Preferred Deployment Date</label>
              <input
                type="date"
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors text-zinc-800 dark:text-zinc-400 shadow-inner appearance-none cursor-text"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className={`w-full bg-emerald-600 text-white font-bold py-3 px-4 rounded-xl shadow-[0_0_20px_rgba(52,211,153,0.15)] focus:ring-2 focus:ring-emerald-400 transition-colors mt-6 hover:bg-emerald-500`}
            >
              Confirm Dispatch
            </motion.button>
          </motion.form>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-zinc-900/60 backdrop-blur-xl p-10 rounded-3xl border border-zinc-800 shadow-2xl text-center space-y-4 relative z-10"
          >
            <div className="text-6xl mb-4 grayscale">🛰️</div>
            <h2 className="text-2xl font-bold text-zinc-100">Dispatched!</h2>
            <p className="text-zinc-400 text-sm">A fleet unit is being routed to [{position?.lat.toFixed(2)}, {position?.lng.toFixed(2)}] for <strong className="uppercase text-emerald-500">{formData.category}</strong>.</p>
            <p className="text-xs text-zinc-500 tracking-widest uppercase mt-6 pt-4 border-t border-zinc-800 animate-pulse">Redirecting to Dashboard...</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Pickup;
