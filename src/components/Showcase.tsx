import { motion } from 'motion/react';
import { Play, Layers, Users, Building2, Sparkles, Image as ImageIcon, FileText } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Showcase() {
  const { t } = useLanguage();

  const projects = [
    {
      type: t('showcase.tob'),
      title: t('showcase.p1_title'),
      desc: t('showcase.p1_desc'),
      icon: <Building2 className="w-5 h-5" />,
      color: "from-blue-500/20 to-cyan-500/20",
      delay: 0
    },
    {
      type: t('showcase.toc'),
      title: t('showcase.p2_title'),
      desc: t('showcase.p2_desc'),
      icon: <Users className="w-5 h-5" />,
      color: "from-purple-500/20 to-pink-500/20",
      delay: 0.1
    },
    {
      type: t('showcase.tob'),
      title: t('showcase.p3_title'),
      desc: t('showcase.p3_desc'),
      icon: <FileText className="w-5 h-5" />,
      color: "from-emerald-500/20 to-teal-500/20",
      delay: 0.2
    },
    {
      type: t('showcase.tob'),
      title: t('showcase.p4_title'),
      desc: t('showcase.p4_desc'),
      icon: <ImageIcon className="w-5 h-5" />,
      color: "from-orange-500/20 to-red-500/20",
      delay: 0.3
    }
  ];

  return (
    <section id="showcase" className="py-32 relative bg-zinc-950/50 border-y border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-6">
            {t('showcase.title')}
          </h2>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            {t('showcase.desc')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: project.delay }}
              className="glass-panel rounded-3xl p-6 group cursor-pointer flex flex-col"
            >
              {/* Video Player Simulation with Before/After concept */}
              <div className={`w-full h-48 rounded-2xl mb-6 relative overflow-hidden bg-gradient-to-br ${project.color} flex items-center justify-center group-hover:scale-[1.02] transition-transform duration-500`}>
                <div className="absolute inset-0 bg-black/40" />
                
                {/* Abstract Before/After UI */}
                <div className="absolute inset-0 flex items-center justify-between px-8 opacity-50 group-hover:opacity-100 transition-opacity">
                  <div className="w-1/3 h-24 border border-white/20 rounded-lg border-dashed flex items-center justify-center">
                    <span className="text-xs text-white/50">Input</span>
                  </div>
                  <div className="w-8 h-[1px] bg-cyan-500/50 relative">
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 border-t border-r border-cyan-500/50 rotate-45" />
                  </div>
                  <div className="w-1/3 h-24 bg-white/10 rounded-lg border border-white/20 flex items-center justify-center shadow-[0_0_15px_rgba(0,242,254,0.2)]">
                    <span className="text-xs text-cyan-400">Output</span>
                  </div>
                </div>

                <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:bg-white/20 transition-colors z-10">
                  <Play className="w-5 h-5 text-white ml-1" />
                </div>
                {/* Animated scanline for tech feel */}
                <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,rgba(0,242,254,0.1)_50%,transparent_100%)] bg-[length:100%_4px] animate-scan" />
              </div>

              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 rounded-lg bg-white/5 border border-white/10 text-cyan-400">
                  {project.icon}
                </div>
                <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  {project.type}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                {project.title}
              </h3>
              <p className="text-sm text-zinc-400 flex-1">
                {project.desc}
              </p>
            </motion.div>
          ))}

          {/* 100+ Skills Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="glass-panel rounded-3xl p-6 flex flex-col items-center justify-center text-center relative overflow-hidden group cursor-pointer md:col-span-2 lg:col-span-1"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10 flex flex-col items-center">
              <Sparkles className="w-12 h-12 text-cyan-400 mb-4" />
              <h3 className="text-5xl font-bold text-white mb-2">{t('showcase.skills')}</h3>
              <p className="text-xl font-medium text-cyan-400 mb-2">{t('showcase.skills_label')}</p>
              <p className="text-zinc-400 text-sm">{t('showcase.skills_desc')}</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
