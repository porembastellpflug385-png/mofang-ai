import { FormEvent, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Bot, Mail, SendHorizonal } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface ContactResponse {
  ok: boolean;
  message?: string;
}

export default function Contact() {
  const { t } = useLanguage();
  const [formState, setFormState] = useState({
    name: '',
    company: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusText, setStatusText] = useState('');
  const statusClass = useMemo(
    () => (statusText.includes('失败') || statusText.includes('failed') ? 'text-rose-400' : 'text-emerald-400'),
    [statusText]
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatusText('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formState),
      });

      const result = (await response.json()) as ContactResponse;
      if (!response.ok || !result.ok) {
        throw new Error(result.message || 'Request failed.');
      }

      setFormState({ name: '', company: '', email: '', message: '' });
      setStatusText(t('contact.success'));
    } catch (error) {
      setStatusText(error instanceof Error ? error.message : t('contact.error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-32 relative flex items-center justify-center min-h-[80vh]">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/5 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/5 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] border border-white/5 rounded-full" />
      </div>

      <div className="relative z-10 max-w-6xl w-full px-6 grid gap-8 lg:grid-cols-[1.15fr_0.85fr] items-start">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass-panel rounded-[2.5rem] p-8 md:p-12"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
              <Mail className="w-8 h-8 text-cyan-300" />
            </div>
            <div className="text-left">
              <h2 className="text-3xl md:text-4xl font-semibold">{t('contact.title')}</h2>
              <p className="text-zinc-400 mt-2">{t('contact.desc')}</p>
            </div>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <input
                type="text"
                value={formState.name}
                onChange={(event) => setFormState((prev) => ({ ...prev, name: event.target.value }))}
                placeholder={t('contact.name')}
                className="w-full bg-black/50 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500/50 transition-colors"
              />
              <input
                type="text"
                value={formState.company}
                onChange={(event) => setFormState((prev) => ({ ...prev, company: event.target.value }))}
                placeholder={t('contact.company')}
                className="w-full bg-black/50 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500/50 transition-colors"
              />
            </div>
            <input
              type="email"
              value={formState.email}
              onChange={(event) => setFormState((prev) => ({ ...prev, email: event.target.value }))}
              placeholder={t('contact.placeholder')}
              className="w-full bg-black/50 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500/50 transition-colors font-mono text-sm"
            />
            <textarea
              value={formState.message}
              onChange={(event) => setFormState((prev) => ({ ...prev, message: event.target.value }))}
              placeholder={t('contact.message')}
              rows={5}
              className="w-full bg-black/50 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500/50 transition-colors resize-none"
            />
            <button disabled={isSubmitting} className="w-full bg-white text-black font-medium rounded-2xl px-6 py-4 hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-wait">
              {t('contact.button')}
              <SendHorizonal className="w-4 h-4" />
            </button>
            <a href="#ops-console" className="w-full glass text-cyan-400 font-medium rounded-2xl px-6 py-4 hover:bg-white/5 transition-colors flex items-center justify-center gap-2 cursor-pointer border border-cyan-500/20">
              <Bot className="w-4 h-4" />
              {t('contact.sandbox')}
            </a>
          </form>

          <div className="mt-6 flex items-center justify-between gap-4 text-xs font-mono">
            <p className="text-zinc-600">{t('contact.secure')}</p>
            {statusText ? <p className={statusClass}>{statusText}</p> : null}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-panel rounded-[2rem] p-8"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
              <Bot className="w-6 h-6 text-cyan-300" />
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">{t('contact.assistantBadge')}</p>
              <h3 className="text-2xl font-semibold">{t('contact.assistantTitle')}</h3>
            </div>
          </div>
          <p className="text-zinc-400 leading-7">{t('contact.assistantDesc')}</p>
          <div className="mt-8 space-y-4 text-sm">
            <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 px-5 py-4 text-cyan-50">
              {t('contact.assistantFeature1')}
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-zinc-300">
              {t('contact.assistantFeature2')}
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-zinc-300">
              {t('contact.assistantFeature3')}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
