import { FormEvent, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Fingerprint, SendHorizonal } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import SmartChatWidget from './SmartChatWidget';

interface ContactResponse {
  ok: boolean;
  message?: string;
}

async function readJsonResponse<T>(response: Response): Promise<T> {
  const text = await response.text();
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error(text.startsWith('<') ? '接口暂时不可用，请检查后端部署或稍后重试。' : text || 'Invalid server response.');
  }
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

      const result = await readJsonResponse<ContactResponse>(response);
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
    <section id="contact" className="py-24 md:py-32 relative flex items-center justify-center min-h-[80vh]">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/5 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/5 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] border border-white/5 rounded-full" />
      </div>

      <div className="relative z-10 max-w-6xl w-full px-4 md:px-6 grid gap-6 md:gap-8 lg:grid-cols-[1.02fr_0.98fr] items-stretch">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass-panel rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 border border-white/10 h-full min-h-[920px] flex flex-col"
        >
          <div className="mb-8 flex justify-center">
            <div className="w-20 h-20 rounded-full bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 shadow-[0_0_40px_rgba(34,211,238,0.12)]">
              <Fingerprint className="w-10 h-10 text-cyan-300" />
            </div>
          </div>
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight">{t('contact.title')}</h2>
            <p className="text-zinc-400 mt-4 text-base md:text-lg leading-8">{t('contact.desc')}</p>
          </div>

          <form className="space-y-4 mt-10 max-w-3xl mx-auto w-full flex-1" onSubmit={handleSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <input
                type="text"
                value={formState.name}
                onChange={(event) => setFormState((prev) => ({ ...prev, name: event.target.value }))}
                placeholder={t('contact.name')}
                className="w-full bg-black/70 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500/50 transition-colors"
              />
              <input
                type="text"
                value={formState.company}
                onChange={(event) => setFormState((prev) => ({ ...prev, company: event.target.value }))}
                placeholder={t('contact.company')}
                className="w-full bg-black/70 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500/50 transition-colors"
              />
            </div>
            <input
              type="email"
              value={formState.email}
              onChange={(event) => setFormState((prev) => ({ ...prev, email: event.target.value }))}
              placeholder={t('contact.placeholder')}
              className="w-full bg-black/70 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500/50 transition-colors font-mono text-sm"
            />
            <textarea
              value={formState.message}
              onChange={(event) => setFormState((prev) => ({ ...prev, message: event.target.value }))}
              placeholder={t('contact.message')}
              rows={8}
              className="w-full bg-black/70 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500/50 transition-colors resize-none min-h-[240px]"
            />
            <button disabled={isSubmitting} className="w-full bg-white text-black font-medium rounded-2xl px-6 py-4 hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-wait text-lg">
              {t('contact.button')}
              <SendHorizonal className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 flex flex-col md:flex-row items-center justify-center gap-3 text-xs font-mono">
            <p className="text-zinc-600">{t('contact.secure')}</p>
            {statusText ? <p className={statusClass}>{statusText}</p> : null}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="h-full"
        >
          <SmartChatWidget />
        </motion.div>
      </div>
    </section>
  );
}
