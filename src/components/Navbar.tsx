import { motion } from 'motion/react';
import { Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import AnimatedCubeLogo from './AnimatedCubeLogo';

export default function Navbar({ isAdminView = false }: { isAdminView?: boolean }) {
  const { t, lang, toggleLang } = useLanguage();

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 md:pt-6 px-3 md:px-4"
    >
      <div className="glass rounded-[2rem] md:rounded-full px-4 md:px-6 py-3 flex items-center justify-between w-full max-w-6xl gap-3">
        <a href={isAdminView ? '#/' : '#top'} className="flex items-center gap-3 min-w-0">
          <AnimatedCubeLogo />
          <span className="font-semibold tracking-tight text-lg md:text-base whitespace-nowrap">{t('nav.brand')}</span>
        </a>
        <div className="hidden lg:flex items-center gap-8 text-sm font-medium text-zinc-400">
          <a href="#intro" className="hover:text-white transition-colors">{t('nav.intro')}</a>
          <a href="#platform" className="hover:text-white transition-colors">{t('nav.platform')}</a>
          <a href="#showcase" className="hover:text-white transition-colors">{t('nav.showcase')}</a>
          <a href="#ecosystem" className="hover:text-white transition-colors">{t('nav.ecosystem')}</a>
          <a href="#vision" className="hover:text-white transition-colors">{t('nav.vision')}</a>
        </div>
        <div className="flex items-center gap-2 md:gap-4 shrink-0">
          <button 
            onClick={toggleLang}
            className="flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-white transition-colors px-3 py-1.5 border border-white/10 rounded-full bg-white/5 cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5" />
            {lang === 'en' ? '中文' : 'EN'}
          </button>
          {isAdminView ? (
            <a href="#/" className="bg-white text-black px-5 md:px-4 py-2.5 md:py-2 rounded-full text-sm font-medium hover:bg-zinc-200 transition-colors cursor-pointer whitespace-nowrap">
              {t('nav.home')}
            </a>
          ) : null}
        </div>
      </div>
    </motion.nav>
  );
}
