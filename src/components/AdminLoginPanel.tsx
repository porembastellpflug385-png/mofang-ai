import { FormEvent, useState } from 'react';
import { LockKeyhole } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { setAdminToken } from '../lib/adminAuth';

export default function AdminLoginPanel({ onLogin }: { onLogin: () => void }) {
  const { t } = useLanguage();
  const [form, setForm] = useState({
    username: '',
    password: '',
  });
  const [status, setStatus] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setStatus('');

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });
      const result = (await response.json()) as { ok: boolean; token?: string; message?: string };
      if (!response.ok || !result.ok || !result.token) {
        throw new Error(result.message || t('ops.loginError'));
      }
      setAdminToken(result.token);
      onLogin();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : t('ops.loginError'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="glass-panel rounded-[2rem] p-8 max-w-xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-2xl border border-cyan-500/20 bg-cyan-500/10 flex items-center justify-center">
          <LockKeyhole className="w-5 h-5 text-cyan-300" />
        </div>
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">{t('ops.loginBadge')}</p>
          <h3 className="text-2xl font-semibold">{t('ops.loginTitle')}</h3>
        </div>
      </div>
      <p className="text-zinc-400 mb-6">{t('ops.loginDesc')}</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={form.username}
          onChange={(event) => setForm((prev) => ({ ...prev, username: event.target.value }))}
          placeholder={t('ops.loginUser')}
          className="w-full bg-black/50 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500/50 transition-colors"
        />
        <input
          type="password"
          value={form.password}
          onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
          placeholder={t('ops.loginPass')}
          className="w-full bg-black/50 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500/50 transition-colors"
        />
        <button disabled={submitting} className="rounded-2xl bg-white text-black px-5 py-3 font-medium hover:bg-zinc-200 transition-colors disabled:opacity-60">
          {t('ops.loginButton')}
        </button>
        {status ? <p className="text-sm text-rose-400">{status}</p> : null}
      </form>
    </div>
  );
}
