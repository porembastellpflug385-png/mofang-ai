import { motion } from 'motion/react';
import { Store, Coins, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Ecosystem() {
  const { t } = useLanguage();

  return (
    <section id="ecosystem" className="py-32 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-6">
            {t('ecosystem.title')}
          </h2>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            {t('ecosystem.desc')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-panel rounded-3xl p-8 flex flex-col relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <Store className="w-10 h-10 text-purple-400 mb-6 relative z-10" />
            <h3 className="text-2xl font-semibold mb-3 relative z-10">{t('ecosystem.card1_title')}</h3>
            <p className="text-zinc-400 mb-8 relative z-10">
              {t('ecosystem.card1_desc')}
            </p>
            
            {/* Mock UI for Marketplace */}
            <div className="mt-auto bg-black/40 rounded-2xl border border-white/10 p-4 relative z-10">
              <div className="flex gap-4 items-center mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500 to-orange-400 flex items-center justify-center">
                  <span className="text-white font-bold">SK</span>
                </div>
                <div>
                  <div className="text-sm font-medium text-white">Skill Marketplace</div>
                  <div className="text-xs text-zinc-500">by @design_geek</div>
                </div>
                <div className="ml-auto px-3 py-1 rounded-full bg-white/10 text-xs text-white">
                  Install
                </div>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full w-3/4 bg-purple-500 rounded-full" />
              </div>
              <div className="text-xs text-zinc-500 mt-2 text-right">12.4k installs</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-panel rounded-3xl p-8 flex flex-col relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <Coins className="w-10 h-10 text-emerald-400 mb-6 relative z-10" />
            <h3 className="text-2xl font-semibold mb-3 relative z-10">{t('ecosystem.card2_title')}</h3>
            <p className="text-zinc-400 mb-8 relative z-10">
              {t('ecosystem.card2_desc')}
            </p>

            {/* Mock UI for Revenue */}
            <div className="mt-auto bg-black/40 rounded-2xl border border-white/10 p-4 relative z-10">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <div className="text-xs text-zinc-500 mb-1">Token Revenue (30d)</div>
                  <div className="text-3xl font-mono text-emerald-400">45,200 <span className="text-sm text-zinc-500">TKN</span></div>
                </div>
                <ShieldCheck className="w-6 h-6 text-zinc-600" />
              </div>
              <div className="flex gap-2">
                <div className="h-8 flex-1 bg-emerald-500/20 rounded-lg border border-emerald-500/30 flex items-center justify-center text-xs text-emerald-400">Smart Contract Active</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
