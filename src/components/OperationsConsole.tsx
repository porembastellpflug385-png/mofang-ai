import { FormEvent, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Inbox, LogOut, Mail, RefreshCcw, Upload, Video } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import AdminLoginPanel from './AdminLoginPanel';
import SmartChatWidget from './SmartChatWidget';
import { adminFetch, clearAdminToken, getAdminToken } from '../lib/adminAuth';

type AssetItem = {
  id: string;
  originalName: string;
  mimeType: string;
  url: string;
  createdAt: string;
  size: number;
};

type InboxItem = {
  id: string;
  type: string;
  name?: string;
  email?: string;
  message: string;
  createdAt: string;
};

export default function OperationsConsole() {
  const { t } = useLanguage();
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(getAdminToken()));
  const [assets, setAssets] = useState<AssetItem[]>([]);
  const [inbox, setInbox] = useState<InboxItem[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [uploadState, setUploadState] = useState('');
  const [mailState, setMailState] = useState('');
  const [authState, setAuthState] = useState('');
  const [storageMode, setStorageMode] = useState<'local' | 's3'>('local');
  const [mailForm, setMailForm] = useState({
    to: '',
    subject: '',
    message: '',
  });

  const loadDashboard = async () => {
    const [assetsResponse, inboxResponse] = await Promise.all([
      adminFetch('/api/admin/assets'),
      adminFetch('/api/admin/messages'),
    ]);

    if (assetsResponse.status === 401 || inboxResponse.status === 401) {
      setIsAuthenticated(false);
      setAuthState(t('ops.sessionExpired'));
      return;
    }

    if (assetsResponse.ok) {
      const assetsData = (await assetsResponse.json()) as { items: AssetItem[]; storageProvider?: 'local' | 's3' };
      setAssets(assetsData.items);
      if (assetsData.storageProvider) {
        setStorageMode(assetsData.storageProvider);
      }
    }

    if (inboxResponse.ok) {
      const inboxData = (await inboxResponse.json()) as { items: InboxItem[] };
      setInbox(inboxData.items);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      void loadDashboard();
    }
  }, [isAuthenticated]);

  const handleUpload = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedFiles?.length) {
      setUploadState('Please choose files first.');
      return;
    }

    const payload = new FormData();
    Array.from(selectedFiles as FileList).forEach((file: File) => payload.append('files', file));

    const response = await adminFetch('/api/admin/upload', {
      method: 'POST',
      body: payload,
    });

    const result = (await response.json()) as { ok: boolean; message?: string };
    if (response.status === 401) {
      setIsAuthenticated(false);
      setAuthState(t('ops.sessionExpired'));
      return;
    }
    setUploadState(result.ok ? 'Upload completed.' : result.message || 'Upload failed.');
    if (result.ok) {
      setSelectedFiles(null);
      await loadDashboard();
    }
  };

  const handleMail = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const response = await adminFetch('/api/admin/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mailForm),
    });

    const result = (await response.json()) as { ok: boolean; message?: string };
    if (response.status === 401) {
      setIsAuthenticated(false);
      setAuthState(t('ops.sessionExpired'));
      return;
    }
    setMailState(result.ok ? 'Email sent.' : result.message || 'Email failed.');
    if (result.ok) {
      setMailForm({ to: '', subject: '', message: '' });
    }
  };

  return (
    <section id="ops-console" className="relative py-12 md:py-20 px-4 md:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10">
          <p className="text-sm uppercase tracking-[0.4em] text-cyan-400/70">{t('ops.eyebrow')}</p>
          <h2 className="mt-4 text-4xl md:text-5xl font-semibold tracking-tight">{t('ops.title')}</h2>
          <p className="mt-4 max-w-3xl text-zinc-400 text-lg">{t('ops.desc')}</p>
        </div>

        {!isAuthenticated ? (
          <div className="space-y-4">
            <AdminLoginPanel
              onLogin={() => {
                setAuthState('');
                setIsAuthenticated(true);
              }}
            />
            {authState ? <p className="text-sm text-zinc-500">{authState}</p> : null}
          </div>
        ) : null}

        {isAuthenticated ? (
          <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="space-y-6">
            <div className="glass-panel rounded-[2rem] p-8">
              <div className="flex items-center justify-between gap-4 mb-3">
                <div className="flex items-center gap-3">
                  <Upload className="w-5 h-5 text-cyan-300" />
                  <h3 className="text-2xl font-semibold">{t('ops.uploadTitle')}</h3>
                </div>
                <div className="flex items-center gap-3">
                  <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-400">
                    {t('ops.storagePrefix')}: {storageMode.toUpperCase()}
                  </span>
                  <button
                    onClick={() => {
                      clearAdminToken();
                      setIsAuthenticated(false);
                      setAssets([]);
                      setInbox([]);
                    }}
                    className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    {t('ops.logout')}
                  </button>
                </div>
              </div>
              <p className="text-zinc-400 mb-6">{t('ops.uploadDesc')}</p>
              <form onSubmit={handleUpload} className="space-y-4">
                <label className="block rounded-3xl border border-dashed border-cyan-500/30 bg-cyan-500/5 px-5 py-10 text-center cursor-pointer">
                  <Video className="w-7 h-7 mx-auto text-cyan-300 mb-3" />
                  <span className="text-zinc-300">PNG / JPG / MP4 / MOV / PDF</span>
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    onChange={(event) => setSelectedFiles(event.target.files)}
                  />
                </label>
                <button className="rounded-2xl bg-white text-black px-5 py-3 font-medium hover:bg-zinc-200 transition-colors">
                  {t('ops.uploadButton')}
                </button>
                {uploadState ? <p className="text-sm text-zinc-400">{uploadState}</p> : null}
              </form>

              <div className="mt-8 grid gap-3 md:grid-cols-2">
                {assets.length ? (
                  assets.map((asset) => (
                    <a key={asset.id} href={asset.url} target="_blank" rel="noreferrer" className="rounded-2xl border border-white/10 bg-black/30 px-4 py-4 hover:border-cyan-500/30 transition-colors">
                      <p className="truncate font-medium text-white">{asset.originalName}</p>
                      <p className="mt-2 text-sm text-zinc-500">{asset.mimeType}</p>
                    </a>
                  ))
                ) : (
                  <p className="text-sm text-zinc-500">{t('ops.uploadEmpty')}</p>
                )}
              </div>
            </div>

            <div className="glass-panel rounded-[2rem] p-8">
              <div className="flex items-center gap-3 mb-3">
                <Mail className="w-5 h-5 text-cyan-300" />
                <h3 className="text-2xl font-semibold">{t('ops.mailTitle')}</h3>
              </div>
              <p className="text-zinc-400 mb-6">{t('ops.mailDesc')}</p>
              <form onSubmit={handleMail} className="space-y-4">
                <input
                  type="email"
                  value={mailForm.to}
                  onChange={(event) => setMailForm((prev) => ({ ...prev, to: event.target.value }))}
                  placeholder={t('ops.mailTo')}
                  className="w-full bg-black/50 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500/50 transition-colors"
                />
                <input
                  type="text"
                  value={mailForm.subject}
                  onChange={(event) => setMailForm((prev) => ({ ...prev, subject: event.target.value }))}
                  placeholder={t('ops.mailSubject')}
                  className="w-full bg-black/50 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500/50 transition-colors"
                />
                <textarea
                  rows={4}
                  value={mailForm.message}
                  onChange={(event) => setMailForm((prev) => ({ ...prev, message: event.target.value }))}
                  placeholder={t('ops.mailMessage')}
                  className="w-full bg-black/50 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500/50 transition-colors resize-none"
                />
                <button className="rounded-2xl bg-cyan-400 text-black px-5 py-3 font-medium hover:bg-cyan-300 transition-colors">
                  {t('ops.mailButton')}
                </button>
                {mailState ? <p className="text-sm text-zinc-400">{mailState}</p> : null}
              </form>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="space-y-6">
            <div className="hidden xl:block">
              <SmartChatWidget onNewMessage={loadDashboard} />
            </div>

            <div className="glass-panel rounded-[2rem] p-8">
              <div className="flex items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <Inbox className="w-5 h-5 text-cyan-300" />
                  <h3 className="text-2xl font-semibold">{t('ops.chatTitle')}</h3>
                </div>
                <button onClick={() => void loadDashboard()} className="text-sm text-zinc-400 hover:text-white transition-colors inline-flex items-center gap-2">
                  <RefreshCcw className="w-4 h-4" />
                  {t('ops.refresh')}
                </button>
              </div>
              <p className="text-zinc-400 mb-6">{t('ops.chatDesc')}</p>
              <div className="space-y-3 max-h-[28rem] overflow-auto pr-1">
                {inbox.length ? (
                  inbox.map((item) => (
                    <div key={item.id} className="rounded-2xl border border-white/10 bg-black/30 px-4 py-4">
                      <div className="flex items-center justify-between gap-3 text-sm">
                        <p className="font-medium text-white">{item.name || item.email || item.type}</p>
                        <span className="text-zinc-500">{new Date(item.createdAt).toLocaleString()}</span>
                      </div>
                      {item.email ? <p className="mt-1 text-sm text-cyan-300">{item.email}</p> : null}
                      <p className="mt-3 text-zinc-300 leading-6">{item.message}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-zinc-500">{t('ops.inboxEmpty')}</p>
                )}
              </div>
            </div>
          </motion.div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
