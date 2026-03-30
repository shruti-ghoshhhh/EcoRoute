import { motion } from 'framer-motion';

const AnimalEdu = () => {
  const animals = [
    {
      name: "Sea Turtles",
      status: "Endangered",
      image: "https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?auto=format&fit=crop&w=800&q=80",
      threat: "Plastic bags are often mistaken for jellyfish, their main food source.",
      tip: "Refuse single-use plastics and always cut your six-pack rings.",
      color: "text-emerald-400",
      bg: "bg-emerald-900/20",
      border: "border-emerald-500/30"
    },
    {
      name: "Polar Bears",
      status: "Vulnerable",
      image: "https://images.unsplash.com/photo-1589656966895-2f33e7653819?auto=format&fit=crop&w=800&q=80",
      threat: "Rapid loss of sea ice due to catastrophic global warming.",
      tip: "Reduce your daily carbon footprint by utilizing EcoRoute's optimized fleets.",
      color: "text-blue-400",
      bg: "bg-blue-900/20",
      border: "border-blue-500/30"
    },
    {
      name: "Red Pandas",
      status: "Highly Endangered",
      image: "https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?auto=format&fit=crop&w=800&q=80",
      threat: "Aggressive deforestation and agricultural habitat destruction.",
      tip: "Recycle your paper products and support sustainable forestry initiatives.",
      color: "text-orange-400",
      bg: "bg-orange-900/20",
      border: "border-orange-500/30"
    }
  ];

  const stats = [
    { title: "Ocean Plastic", stat: "8 Million", desc: "Tons of plastic enter our oceans every single year, suffocating marine habitats.", icon: "🌊", glow: "shadow-blue-500/20" },
    { title: "Deforestation", stat: "15 Billion", desc: "Trees are aggressively chopped down globally each year for human expansion.", icon: "🪓", glow: "shadow-orange-500/20" },
    { title: "Emissions", stat: "36 Billion", desc: "Tons of CO2 are pumped into the atmosphere annually, accelerating the crisis.", icon: "🏭", glow: "shadow-zinc-500/20" },
    { title: "Extinction Rate", stat: "1 Million", desc: "Animal and plant species are currently threatened with global extinction.", icon: "🥀", glow: "shadow-red-500/20" }
  ];

  return (
    <div className="min-h-screen bg-[#09090b] p-6 text-zinc-200">
      <div className="max-w-6xl mx-auto mt-8 space-y-16">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl mb-4"
          >
            🐾
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-4xl md:text-5xl font-extrabold text-zinc-100"
          >
            Protecting Our Wildlife
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-zinc-400 text-lg"
          >
            Every piece of waste you recycle through EcoRoute directly impacts the survival of these beautiful creatures.
          </motion.p>
        </div>

        {/* Cute Animals Photo Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {animals.map((animal, idx) => (
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.15 }}
              whileHover={{ y: -10 }}
              key={animal.name}
              className={`bg-zinc-900/50 backdrop-blur-xl rounded-3xl overflow-hidden border ${animal.border} shadow-2xl flex flex-col group cursor-pointer`}
            >
              <div className="h-64 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent z-10 opacity-60"></div>
                <img 
                  src={animal.image} 
                  alt={animal.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                />
                <div className="absolute bottom-4 left-4 z-20">
                  <h3 className="text-3xl font-extrabold text-white drop-shadow-md">{animal.name}</h3>
                  <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${animal.bg} ${animal.color} backdrop-blur-md`}>
                    {animal.status}
                  </span>
                </div>
              </div>
              
              <div className="p-6 flex flex-col gap-4 flex-1">
                <div>
                  <h4 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-1">Primary Threat</h4>
                  <p className="text-zinc-300 font-medium leading-relaxed">{animal.threat}</p>
                </div>
                <div className="mt-auto pt-4 border-t border-zinc-800">
                  <h4 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-1">How You Help</h4>
                  <p className="text-emerald-400 font-medium">{animal.tip}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Environmental Exploitation Stats */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="bg-zinc-900/40 border border-zinc-800 rounded-[2.5rem] p-10 backdrop-blur-md relative overflow-hidden"
        >
          <div className="text-center mb-12 relative z-10">
            <h2 className="text-3xl font-extrabold text-white mb-3">The Global Environmental Crisis</h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              Our planet is facing unprecedented destruction. The metrics below highlight exactly why EcoRoute's mission is critical to our survival.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            {stats.map((stat, idx) => (
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 * idx }}
                viewport={{ once: true }}
                key={stat.title}
                className={`bg-zinc-950/80 border border-zinc-800 rounded-3xl p-6 shadow-[0_0_30px_rgba(0,0,0,0)] hover:${stat.glow} transition-shadow duration-500 flex flex-col items-center text-center`}
              >
                <div className="text-5xl mb-4 grayscale hover:grayscale-0 transition-all duration-300">{stat.icon}</div>
                <h3 className="text-4xl font-extrabold text-white mb-2">{stat.stat}</h3>
                <h4 className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-3">{stat.title}</h4>
                <p className="text-sm text-zinc-400 leading-relaxed">{stat.desc}</p>
              </motion.div>
            ))}
          </div>
          
          {/* Subtle Background Glow for tension */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-red-900/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
        </motion.div>

        {/* Call to Action Footer */}
        <div className="text-center pb-12">
          <p className="text-zinc-500 font-medium">
            Be part of the solution. Return to your <a href="/dashboard" className="text-emerald-400 hover:text-emerald-300 font-bold underline decoration-emerald-500/30 underline-offset-4">Dashboard</a> to start collecting.
          </p>
        </div>

      </div>
    </div>
  );
};

export default AnimalEdu;
