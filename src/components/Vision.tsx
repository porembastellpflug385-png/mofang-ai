import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';

export default function Vision() {
  const { t } = useLanguage();

  return (
    <section id="vision" className="py-32 relative overflow-hidden">
      {/* Background image/gradient for future vibe */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-900 via-[#050505] to-[#050505]" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="mb-16"
        >
          <h2 className="text-5xl md:text-7xl font-semibold tracking-tighter mb-6">
            {t('vision.title1')}<br />
            <span className="text-gradient-accent">{t('vision.title2')}</span>
          </h2>
          <p className="text-xl text-zinc-400 max-w-3xl mx-auto font-light">
            {t('vision.desc')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {[
            {
              title: t('vision.v1_title'),
              desc: t('vision.v1_desc')
            },
            {
              title: t('vision.v2_title'),
              desc: t('vision.v2_desc')
            },
            {
              title: t('vision.v3_title'),
              desc: t('vision.v3_desc')
            }
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              className="border-t border-white/10 pt-6"
            >
              <h3 className="text-xl font-medium mb-3 text-white">{item.title}</h3>
              <p className="text-zinc-500 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
