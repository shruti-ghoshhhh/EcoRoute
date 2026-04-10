import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const ContactUs = () => {
  const { user } = useAuthStore();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Route through our secure Database Feedback API
      await axios.post('/api/feedback/submit', { message: `[Contact Us: ${formData.subject}] - From: ${formData.name} (${formData.email}) - Message: ${formData.message}` }, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      setSubmitted(true);
      setTimeout(() => navigate('/dashboard'), 3500);
    } catch (error) {
      alert("Transmission failed. Please ensure you are logged in.");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#09090b] text-zinc-800 dark:text-zinc-200 py-12 px-6 transition-colors duration-500 flex items-center justify-center">
      <div className="max-w-4xl w-full">
        {!submitted ? (
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] shadow-xl overflow-hidden flex flex-col md:flex-row">
            
            {/* Left Contact Info Hero */}
            <div className="md:w-5/12 bg-emerald-600 dark:bg-emerald-900/50 text-white p-10 flex flex-col justify-between">
              <div>
                <h1 className="text-4xl font-black mb-4">Contact Us</h1>
                <p className="text-emerald-100 dark:text-emerald-200 font-medium leading-relaxed">
                  Have questions about our global environmental logistics? Reach out to the EcoRoute operations team today and help us build a cleaner planet.
                </p>
              </div>
              <div className="space-y-6 mt-12">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xl">📍</div>
                  <span className="font-bold tracking-wide">Global HQ</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xl">✉️</div>
                  <span className="font-bold tracking-wide">support@ecoroute.com</span>
                </div>
              </div>
            </div>

            {/* Right Standard Form */}
            <div className="md:w-7/12 p-10">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Full Name</label>
                    <input 
                      type="text" required
                      className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 transition-colors"
                      value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Email Address</label>
                    <input 
                      type="email" required
                      className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 transition-colors"
                      value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Subject</label>
                  <input 
                    type="text" required
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 transition-colors"
                    value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Message</label>
                  <textarea 
                    required rows="4"
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 transition-colors resize-none"
                    value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})}
                  ></textarea>
                </div>

                <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-xl transition-colors shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                  Send Message
                </button>
              </form>
            </div>
            
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] p-12 text-center shadow-2xl"
          >
            <div className="text-6xl mb-6">📬</div>
            <h2 className="text-3xl font-black mb-4">Message Delivered!</h2>
            <p className="text-zinc-500 leading-relaxed mb-6">
              Thank you for contacting EcoRoute. We have received your inquiry regarding <strong>{formData.subject}</strong> and will respond to <strong>{formData.email}</strong> shortly.
            </p>
            <p className="text-xs uppercase tracking-widest text-emerald-500 font-bold animate-pulse">Redirecting to Dashboard...</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ContactUs;
