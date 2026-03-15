import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';

export default function Partners() {
  const { t } = useLanguage();
  
  // Placeholder names for tech partners
  const partners = [
    "Aether Dynamics", "Quantum Logic", "Starlight Corp", "Nova Systems", 
    "Cyberdyne", "OmniCorp", "Tyrell", "Wayne Ent", "Stark Ind"
  ];

  return (
    <section id="partners" className="py-24 border-y border-white/5 bg-black/50">
      <div className="max-w-7xl mx-auto px-6 mb-12 text-center">
        <p className="text-sm font-medium text-zinc-500 uppercase tracking-widest">{t('partners.title')}</p>
      </div>
      
      <div className="relative flex overflow-x-hidden">
        {/* Gradient masks for smooth fade on edges */}
        <div className="absolute top-0 bottom-0 left-0 w-32 bg-gradient-to-r from-[#050505] to-transparent z-10" />
        <div className="absolute top-0 bottom-0 right-0 w-32 bg-gradient-to-l from-[#050505] to-transparent z-10" />
        
        <motion.div 
          className="flex whitespace-nowrap items-center gap-16 px-8"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 30
          }}
        >
          {/* Double the array for seamless looping */}
          {[...partners, ...partners].map((partner, idx) => (
            <div key={idx} className="text-2xl md:text-3xl font-bold text-zinc-800 tracking-tighter">
              {partner}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
