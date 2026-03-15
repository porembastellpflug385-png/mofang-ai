import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';

export default function Partners() {
  const { t } = useLanguage();

  const partners = [
    '腾讯',
    '华为',
    '字节跳动',
    '亚一黄金',
    '老庙黄金',
    '京东',
    '来伊份',
    '海尔',
  ];

  return (
    <section id="partners" className="py-24 border-y border-white/5 bg-black/50">
      <div className="max-w-7xl mx-auto px-6 mb-12 text-center">
        <p className="text-sm font-medium text-zinc-500 uppercase tracking-widest">{t('partners.title')}</p>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {partners.map((partner, idx) => (
            <motion.div
              key={partner}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.06 }}
              className="rounded-3xl border border-white/8 bg-white/[0.02] px-4 py-8 md:py-10 flex items-center justify-center"
            >
              <div className="text-white/90 text-2xl md:text-3xl font-semibold tracking-tight text-center">
                {partner}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
