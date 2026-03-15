import { motion, AnimatePresence } from 'motion/react';
import { Brain, Zap, Shield, Mic, Activity } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useState, useEffect } from 'react';

export default function Introduction() {
  const { t } = useLanguage();
  const [step, setStep] = useState(0);

  // Simulate Generative UI flow
  useEffect(() => {
    const timer = setInterval(() => {
      setStep((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const features = [
    {
      icon: <Brain className="w-6 h-6 text-cyan-400" />,
      title: t('intro.f1_title'),
      desc: t('intro.f1_desc')
    },
    {
      icon: <Zap className="w-6 h-6 text-cyan-400" />,
      title: t('intro.f2_title'),
      desc: t('intro.f2_desc')
    },
    {
      icon: <Shield className="w-6 h-6 text-cyan-400" />,
      title: t('intro.f3_title'),
      desc: t('intro.f3_desc')
    }
  ];

  return (
    <section id="intro" className="py-32 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-6">
              {t('intro.title1')}<br />
              <span className="text-zinc-500">{t('intro.title2')}</span>
            </h2>
            <p className="text-zinc-400 text-lg leading-relaxed mb-8">
              {t('intro.desc')}
            </p>
            
            <div className="space-y-8">
              {features.map((feature, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl glass flex items-center justify-center shrink-0">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-1">{feature.title}</h3>
                    <p className="text-zinc-400 text-sm leading-relaxed">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Generative UI Showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative h-[600px] rounded-3xl glass-panel overflow-hidden border border-white/10 p-8 flex flex-col bg-gradient-to-b from-zinc-900/50 to-black"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/50" />
              </div>
              <div className="text-xs font-mono text-zinc-500 flex items-center gap-2">
                <Activity className="w-3 h-3 text-cyan-400 animate-pulse" />
                Generative UI Engine
              </div>
            </div>
            
            <div className="flex-1 flex flex-col gap-4 relative">
              {/* Step 1: Voice Input */}
              <AnimatePresence mode="wait">
                {step === 0 && (
                  <motion.div 
                    key="step1"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute inset-0 flex flex-col items-center justify-center"
                  >
                    <div className="w-20 h-20 rounded-full bg-cyan-500/10 flex items-center justify-center mb-6 relative">
                      <div className="absolute inset-0 rounded-full border border-cyan-400/30 animate-ping" />
                      <Mic className="w-8 h-8 text-cyan-400" />
                    </div>
                    <p className="text-zinc-400 font-mono text-sm">{t('intro.sys_await')}</p>
                  </motion.div>
                )}

                {/* Step 2: Intent Recognition */}
                {step === 1 && (
                  <motion.div 
                    key="step2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute inset-0 flex flex-col justify-center px-4"
                  >
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 mb-4 inline-block self-end max-w-[80%]">
                      <p className="text-white text-sm">{t('intro.sys_user')}</p>
                    </div>
                    <div className="flex items-center gap-3 text-cyan-400 text-sm font-mono mt-4">
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                      {t('intro.sys_nexus')}
                    </div>
                  </motion.div>
                )}

                {/* Step 3 & 4: Generated UI Dashboard */}
                {(step === 2 || step === 3) && (
                  <motion.div 
                    key="step3"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex flex-col"
                  >
                    <div className="text-xs font-mono text-cyan-400 mb-4">{t('intro.sys_done')}</div>
                    {/* Apple OS style generated dashboard */}
                    <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col gap-4">
                      <div className="flex justify-between items-center">
                        <h4 className="text-white font-medium text-sm">Q3 Quant Analysis</h4>
                        <span className="px-2 py-1 rounded-md bg-emerald-500/20 text-emerald-400 text-xs">Live</span>
                      </div>
                      <div className="flex gap-4 h-24">
                        <div className="flex-1 bg-black/30 rounded-xl p-3 flex flex-col justify-between border border-white/5">
                          <span className="text-zinc-500 text-xs">Gold (XAU)</span>
                          <span className="text-emerald-400 font-mono text-lg">+2.4%</span>
                        </div>
                        <div className="flex-1 bg-black/30 rounded-xl p-3 flex flex-col justify-between border border-white/5">
                          <span className="text-zinc-500 text-xs">Crude (WTI)</span>
                          <span className="text-red-400 font-mono text-lg">-1.2%</span>
                        </div>
                      </div>
                      <div className="flex-1 bg-black/30 rounded-xl border border-white/5 p-4 relative overflow-hidden">
                        {/* Mock Chart */}
                        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                          <path d="M0,50 Q20,40 40,60 T80,30 T120,70 T160,20 T200,50" fill="none" stroke="#00f2fe" strokeWidth="2" vectorEffect="non-scaling-stroke" className="opacity-50" />
                        </svg>
                      </div>
                      <div className="flex gap-2">
                        <button className="flex-1 bg-cyan-500/20 text-cyan-400 py-2 rounded-lg text-xs font-medium border border-cyan-500/30">Execute Buy</button>
                        <button className="flex-1 bg-white/5 text-white py-2 rounded-lg text-xs font-medium border border-white/10">Hold Position</button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
