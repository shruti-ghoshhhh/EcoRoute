import { motion, useScroll, useSpring } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Leaf, 
  Recycle, 
  LineChart, 
  Trash2, 
  ShieldCheck, 
  ArrowUp, 
  ChevronRight,
  Globe,
  Award,
  Zap
} from 'lucide-react';
import { useState, useEffect } from 'react';

const FeatureCard = ({ icon: Icon, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay }}
    className="bg-white dark:bg-zinc-900/50 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 backdrop-blur-sm group hover:border-emerald-500/50 transition-all hover:shadow-2xl hover:shadow-emerald-500/10"
  >
    <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center mb-6 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
      <Icon size={28} />
    </div>
    <h3 className="text-xl font-bold mb-3 text-zinc-800 dark:text-zinc-100">{title}</h3>
    <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">{description}</p>
  </motion.div>
);

const LandingPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const floatingAnimals = ['🦊', '🐢', '🦜', '🐘', '🌿', '🌍'];

  return (
    <div className="bg-zinc-50 dark:bg-[#09090b] text-zinc-900 dark:text-zinc-200 overflow-x-hidden">
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-emerald-500 origin-left z-[60]"
        style={{ scaleX }}
      />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-6 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 z-0">
          {floatingAnimals.map((emoji, index) => (
            <motion.div
              key={index}
              className="absolute text-4xl sm:text-6xl opacity-20 filter blur-px select-none pointer-events-none"
              initial={{ 
                x: Math.random() * window.innerWidth, 
                y: Math.random() * window.innerHeight 
              }}
              animate={{
                y: [0, -40, 0],
                x: [0, index % 2 === 0 ? 30 : -30, 0],
              }}
              transition={{
                duration: 5 + Math.random() * 5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{
                left: `${Math.random() * 80}%`,
                top: `${Math.random() * 80}%`,
              }}
            >
              {emoji}
            </motion.div>
          ))}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
        </div>

        <div className="container mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-semibold text-sm mb-8 border border-emerald-200 dark:border-emerald-800"
          >
            <Zap size={16} className="fill-current" />
            <span>Waste Management Reimagined</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 tracking-tight leading-[1.1]"
          >
            Your Journey to a <br />
            <span className="bg-gradient-to-r from-emerald-500 via-green-500 to-blue-500 bg-clip-text text-transparent">Greener Future</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            EcoRoute makes recycling simple, rewarding, and educational. Schedule pickups, track your impact, and compete with others to save our planet.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/register"
              className="group bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-xl shadow-emerald-500/30 flex items-center gap-2 active:scale-95"
            >
              Start Recycling Now <ChevronRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#features"
              className="bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 px-8 py-4 rounded-2xl font-bold text-lg transition-all active:scale-95"
            >
              Explore Features
            </a>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white dark:bg-zinc-900/30 border-y border-zinc-200 dark:border-zinc-800">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'Users Active', value: '10K+' },
              { label: 'Waste Collected', value: '50T+' },
              { label: 'CO2 Saved', value: '120T' },
              { label: 'Trees Planted', value: '500+' }
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-black text-emerald-500 mb-1">{stat.value}</div>
                <div className="text-sm font-semibold text-zinc-500 tracking-wider uppercase">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section id="preview" className="py-24 px-6 overflow-hidden">
        <div className="container mx-auto">
          <div className="relative group">
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="relative p-2 md:p-4 rounded-[2rem] md:rounded-[3rem] bg-gradient-to-b from-zinc-200 to-zinc-400 dark:from-zinc-800 dark:to-black shadow-2xl overflow-hidden"
            >
              <img 
                src="/ecoroute dashboard.png" 
                alt="EcoRoute Dashboard" 
                className="rounded-[1.5rem] md:rounded-[2.5rem] w-full h-auto shadow-inner"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
            </motion.div>
            
            {/* Hover Floating Card */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, rotate: -2 }}
              className="absolute -bottom-10 -right-4 sm:right-10 md:right-20 bg-emerald-500 p-6 md:p-8 rounded-3xl text-white shadow-2xl max-w-xs transition-all pointer-events-none sm:pointer-events-auto"
            >
              <Award className="mb-4" size={40} />
              <h4 className="text-2xl font-bold mb-2">Smart Dashboard</h4>
              <p className="text-emerald-50 text-sm opacity-90 leading-relaxed">
                Track your recycling stats, view daily goals, and see your points grow in real-time.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 px-6 relative">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4">Powerful Eco-Tools</h2>
            <p className="text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto text-lg">
              Everything you need to lead a sustainable lifestyle in one ecosystem.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={Trash2}
              title="Schedule Pickups"
              description="Coordinate waste collection from your doorstep with just a few clicks. Supports recurring schedules."
              delay={0.1}
            />
            <FeatureCard
              icon={Recycle}
              title="Smart Sorting"
              description="Not sure how to recycle? Our EcoBot uses AI to guide you on proper waste segregation."
              delay={0.2}
            />
            <FeatureCard
              icon={LineChart}
              title="Impact Tracking"
              description="Visualize the CO2 you've saved and the resources you've helped recover over time."
              delay={0.3}
            />
            <FeatureCard
              icon={Leaf}
              title="Animal Conservation"
              description="Learn about wildlife and how your recycling efforts directly impact their natural habitats."
              delay={0.4}
            />
            <FeatureCard
              icon={Award}
              title="Reward Points"
              description="Each pickup earns you EcoPoints. Use them for exclusive rewards or donate to green causes."
              delay={0.5}
            />
            <FeatureCard
              icon={Globe}
              title="Global Community"
              description="Join forces with thousands of others. Compete on leaderboards and share your eco-wins."
              delay={0.6}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="rounded-[3rem] bg-emerald-600 p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl shadow-emerald-500/20"
          >
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none overflow-hidden">
               <Globe size={400} className="absolute -bottom-20 -right-20" />
            </div>
            
            <h2 className="text-4xl md:text-6xl font-black mb-8 relative z-10">Ready to make a difference?</h2>
            <p className="text-emerald-100 text-lg md:text-xl max-w-2xl mx-auto mb-12 relative z-10 font-medium">
              Join EcoRoute today and become part of a global movement towards a cleaner, more sustainable planet.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
              <Link
                to="/register"
                className="w-full sm:w-auto bg-white text-emerald-600 px-10 py-5 rounded-2xl font-black text-xl hover:bg-emerald-50 transition-all shadow-xl active:scale-95"
              >
                Create Free Account
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto bg-emerald-700/50 backdrop-blur-md text-white border border-emerald-400/30 px-10 py-5 rounded-2xl font-black text-xl hover:bg-emerald-700 transition-all active:scale-95"
              >
                Sign In
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer id="about" className="py-12 bg-zinc-100 dark:bg-zinc-950/50 border-t border-zinc-200 dark:border-zinc-800">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <span className="text-3xl">🌍</span>
              <span className="text-2xl font-black bg-gradient-to-r from-emerald-500 to-green-500 bg-clip-text text-transparent">EcoRoute</span>
            </div>
            <div className="flex gap-8 text-zinc-500 dark:text-zinc-400 font-medium">
              <Link to="/contact" className="hover:text-emerald-500 transition-colors">Contact</Link>
              <a href="#" className="hover:text-emerald-500 transition-colors">Privacy</a>
              <a href="#" className="hover:text-emerald-500 transition-colors">Terms</a>
            </div>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">
              © 2026 EcoRoute Ecosystem. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Scroll to Top */}
      <motion.button
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ 
          opacity: isVisible ? 1 : 0, 
          scale: isVisible ? 1 : 0.5,
          y: isVisible ? 0 : 20
        }}
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 z-[100] bg-emerald-600 text-white p-4 rounded-2xl shadow-2xl shadow-emerald-600/40 hover:bg-emerald-500 transition-all active:scale-90"
      >
        <ArrowUp size={24} />
      </motion.button>
    </div>
  );
};

export default LandingPage;
