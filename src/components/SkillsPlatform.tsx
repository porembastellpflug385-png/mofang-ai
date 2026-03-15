import { motion } from 'motion/react';
import { Terminal, Layers, Network, Cpu, Database, Code2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function SkillsPlatform() {
  const { t } = useLanguage();

  return (
    <section id="platform" className="py-24 md:py-32 relative bg-zinc-950 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="text-center mb-14 md:mb-20">
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight mb-6">
            {t('platform.title')}
          </h2>
          <p className="text-zinc-400 text-base md:text-lg max-w-2xl mx-auto leading-8">
            {t('platform.desc')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 auto-rows-auto md:auto-rows-[240px]">
          {/* Large Feature */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-2 md:row-span-2 glass-panel rounded-3xl p-6 md:p-8 relative overflow-hidden group min-h-[320px] md:min-h-0"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <Layers className="w-10 h-10 text-cyan-400 mb-6" />
            <h3 className="text-2xl md:text-3xl font-semibold mb-3 relative z-10">{t('platform.hub_title')}</h3>
            <p className="text-zinc-400 mb-8 max-w-md relative z-10 leading-8">
              {t('platform.hub_desc')}
            </p>
            
            <div className="hidden md:flex absolute bottom-0 right-0 w-2/3 h-1/2 bg-black/50 rounded-tl-2xl border-t border-l border-white/10 p-4 flex-col gap-3 pointer-events-none">
              <div className="h-2 w-1/3 bg-zinc-800 rounded-full" />
              <div className="flex gap-2">
                <div className="h-16 w-1/2 bg-cyan-500/20 rounded-lg border border-cyan-500/30" />
                <div className="h-16 w-1/2 bg-zinc-800/50 rounded-lg border border-white/5" />
              </div>
              <div className="h-2 w-1/2 bg-zinc-800 rounded-full" />
            </div>
          </motion.div>

          {/* Skill 1 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="glass-panel rounded-3xl p-6 md:p-8 flex flex-col min-h-[220px]"
          >
            <Terminal className="w-8 h-8 text-white mb-4" />
            <h3 className="text-xl font-semibold mb-2">{t('platform.code_title')}</h3>
            <p className="text-zinc-400 text-sm flex-1">{t('platform.code_desc')}</p>
          </motion.div>

          {/* Skill 2 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="glass-panel rounded-3xl p-6 md:p-8 flex flex-col min-h-[220px]"
          >
            <Database className="w-8 h-8 text-white mb-4" />
            <h3 className="text-xl font-semibold mb-2">{t('platform.data_title')}</h3>
            <p className="text-zinc-400 text-sm flex-1">{t('platform.data_desc')}</p>
          </motion.div>

          {/* Skill 3 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="glass-panel rounded-3xl p-6 md:p-8 flex flex-col min-h-[220px]"
          >
            <Network className="w-8 h-8 text-white mb-4" />
            <h3 className="text-xl font-semibold mb-2">{t('platform.api_title')}</h3>
            <p className="text-zinc-400 text-sm flex-1">{t('platform.api_desc')}</p>
          </motion.div>

          {/* Wide Feature */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="md:col-span-2 glass-panel rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between overflow-hidden relative gap-6 min-h-[220px]"
          >
            <div className="relative z-10 max-w-md">
              <Cpu className="w-8 h-8 text-cyan-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">{t('platform.custom_title')}</h3>
              <p className="text-zinc-400 text-sm leading-7">{t('platform.custom_desc')}</p>
            </div>
            
            <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl" />
            <Code2 className="hidden md:block absolute right-12 top-1/2 -translate-y-1/2 w-32 h-32 text-white/5" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
