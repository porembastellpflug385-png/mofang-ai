import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="py-8 border-t border-white/10 text-center text-sm text-zinc-600 font-mono">
      <p>{t('footer.copyright')}</p>
      <div className="flex justify-center gap-6 mt-4">
        <a href="#" className="hover:text-zinc-300 transition-colors">{t('footer.privacy')}</a>
        <a href="#" className="hover:text-zinc-300 transition-colors">{t('footer.terms')}</a>
        <a href="#" className="hover:text-zinc-300 transition-colors">{t('footer.status')}</a>
      </div>
    </footer>
  );
}
