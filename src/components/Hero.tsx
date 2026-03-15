import { motion } from 'motion/react';
import { ChevronRight, Play } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Hero() {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/20 rounded-full blur-[120px] opacity-50 pointer-events-none" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 flex flex-col items-center text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-6xl md:text-8xl lg:text-9xl font-semibold tracking-tighter mb-6"
        >
          <span className="text-gradient">{t('hero.title1')}</span><br />
          <span className="text-gradient-accent">{t('hero.title2')}</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-lg md:text-xl text-zinc-400 max-w-3xl mb-10 font-light leading-relaxed"
        >
          {t('hero.desc')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <button className="bg-white text-black px-8 py-4 rounded-full font-medium flex items-center gap-2 hover:scale-105 transition-transform cursor-pointer">
            {t('hero.deploy')} <ChevronRight className="w-4 h-4" />
          </button>
          <button className="glass px-8 py-4 rounded-full font-medium hover:bg-white/10 transition-colors cursor-pointer flex items-center gap-2 border border-cyan-500/30">
            <Play className="w-4 h-4 text-cyan-400" />
            {t('hero.docs')}
          </button>
        </motion.div>
      </div>
    </section>
  );
}
