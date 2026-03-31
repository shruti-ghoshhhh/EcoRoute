import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const API = import.meta.env.VITE_API_URL;
const EcoBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState('English');
  const [messages, setMessages] = useState([
    { sender: 'bot', text: "Hi there! 🌿 I'm EcoBot, your friendly green assistant! How can I help you sort your recycling today?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/chat/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: `[Please reply exclusively in ${language}] ${userMsg}` }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { sender: 'bot', text: data.reply || data.error }]);
    } catch (err) {
      setMessages((prev) => [...prev, { sender: 'bot', text: 'Error: Connection lost to central AI server.' }]);
    }
    setLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-zinc-950 w-80 shadow-2xl rounded-3xl overflow-hidden border border-zinc-800 flex flex-col mb-4 max-h-[500px]"
          >
            <div className="bg-zinc-900 border-b border-zinc-800 p-4 text-emerald-400 font-bold flex justify-between items-center">
              <span className="flex items-center gap-2 text-lg font-extrabold"><span className="text-2xl drop-shadow-[0_0_10px_rgba(52,211,153,0.5)] animate-bounce">🤖</span> EcoBot</span>
              <div className="flex items-center gap-3">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="bg-zinc-950 border border-zinc-700 text-xs text-zinc-300 rounded px-2 py-1 outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="English">EN</option>
                  <option value="Spanish">ES</option>
                  <option value="French">FR</option>
                  <option value="Hindi">HI</option>
                  <option value="Mandarin">ZH</option>
                  <option value="German">DE</option>
                  <option value="Arabic">AR</option>
                </select>
                <button onClick={() => setIsOpen(false)} className="hover:text-zinc-200 opacity-50 hover:opacity-100 transition-opacity">✖</button>
              </div>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-4 min-h-[300px] bg-zinc-950/50">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${msg.sender === 'user' ? 'bg-emerald-600 text-white rounded-br-none' : 'bg-zinc-900 border border-zinc-800 text-zinc-300 shadow-sm rounded-bl-none'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-zinc-900 border border-zinc-800 text-zinc-500 shadow-sm p-3 rounded-2xl rounded-bl-none text-sm animate-pulse">
                    Processing...
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={sendMessage} className="p-3 bg-zinc-900 border-t border-zinc-800 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask EcoBot a question..."
                className="flex-1 bg-zinc-950 border border-zinc-800 text-zinc-300 rounded-xl px-4 py-2 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm"
              />
              <button type="submit" disabled={loading} className="bg-zinc-800 text-emerald-400 p-2 rounded-xl hover:bg-zinc-700 disabled:opacity-50">
                ↵
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {!isOpen && (
        <div className="relative group flex items-center justify-center">
          {/* Cute Hover Tooltip */}
          <div className="absolute right-full mr-4 bg-emerald-900/80 backdrop-blur-md border border-emerald-500/40 text-white text-xs font-bold px-4 py-2 rounded-2xl shadow-xl opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-50">
            Hi! I'm EcoBot 🌿<br />Need recycling help?
          </div>
          <motion.button
            whileHover={{ scale: 1.15, rotate: [0, -10, 10, -5, 5, 0] }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="bg-zinc-900/90 backdrop-blur-xl border border-emerald-500/30 text-emerald-400 rounded-full shadow-[0_0_20px_rgba(52,211,153,0.15)] hover:shadow-[0_0_30px_rgba(52,211,153,0.4)] hover:bg-zinc-800 flex items-center justify-center w-16 h-16 text-3xl transition-colors"
          >
            🤖
          </motion.button>
        </div>
      )}
    </div>
  );
};

export default EcoBot;
