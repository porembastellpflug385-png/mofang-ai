import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Copy, Download, ImagePlus, Link2, Mic, QrCode, Sparkles, Wand2, X } from 'lucide-react';
import { toPng } from 'html-to-image';
import QRCode from 'qrcode';
import { useLanguage } from '../context/LanguageContext';
import { createCardShareUrl } from '../lib/microSkillShare';

type CardData = {
  name: string | null;
  title: string | null;
  company: string | null;
  phone: string | null;
  email: string | null;
  social: string | null;
  insight: string;
  confidence: number;
  themeMode: 'dark' | 'light';
  primaryColor: string;
  secondaryColor: string;
  layout: 'minimal' | 'bold' | 'tech';
  background: 'glassmorphism' | 'solid' | 'gradient';
};

const defaultPrompt = '我是 Kevin，全栈开发者，偏爱暗黑极客风，邮箱 kevin@mofang.ai，微信 kevinlab。';

const templateThemes = [
  { primary: '#22d3ee', secondary: '#a78bfa', layout: 'tech', background: 'gradient', mode: 'dark' },
  { primary: '#34d399', secondary: '#0f172a', layout: 'minimal', background: 'glassmorphism', mode: 'dark' },
  { primary: '#f59e0b', secondary: '#1f2937', layout: 'bold', background: 'solid', mode: 'dark' },
] as const;

async function readJsonResponse<T>(response: Response): Promise<T> {
  const text = await response.text();
  return JSON.parse(text) as T;
}

function downloadFile(filename: string, url: string) {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function createCardSvg(card: CardData) {
  const name = escapeXml(card.name || 'Name Pending');
  const title = escapeXml(card.title || 'Role Pending');
  const company = escapeXml(card.company || 'Independent Builder');
  const email = escapeXml(card.email || 'email@placeholder.ai');
  const meta = escapeXml(card.phone || card.social || 'WeChat / Phone pending');

  return `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="720" viewBox="0 0 1200 720">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${card.primaryColor}" stop-opacity="0.28"/>
      <stop offset="100%" stop-color="${card.secondaryColor}" stop-opacity="0.18"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="720" rx="48" fill="#09090b"/>
  <rect x="24" y="24" width="1152" height="672" rx="40" fill="url(#bg)" />
  <rect x="56" y="56" width="1088" height="608" rx="36" fill="rgba(9,9,11,0.82)" stroke="rgba(255,255,255,0.12)"/>
  <text x="92" y="144" fill="#71717a" font-family="Inter, Arial, sans-serif" font-size="22" letter-spacing="6">ONE-PROMPT CARD</text>
  <text x="92" y="250" fill="#ffffff" font-family="Inter, Arial, sans-serif" font-weight="700" font-size="82">${name}</text>
  <text x="92" y="306" fill="#d4d4d8" font-family="Inter, Arial, sans-serif" font-size="34">${title}</text>
  <text x="92" y="352" fill="#71717a" font-family="Inter, Arial, sans-serif" font-size="26">${company}</text>
  <rect x="92" y="446" width="432" height="126" rx="28" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.10)"/>
  <text x="126" y="494" fill="#71717a" font-family="Inter, Arial, sans-serif" font-size="18" letter-spacing="3">CONTACT</text>
  <text x="126" y="534" fill="#ffffff" font-family="Inter, Arial, sans-serif" font-size="28">${email}</text>
  <text x="126" y="574" fill="#a1a1aa" font-family="Inter, Arial, sans-serif" font-size="24">${meta}</text>
  <circle cx="1008" cy="150" r="72" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.10)"/>
  <circle cx="1008" cy="150" r="44" fill="${card.primaryColor}" fill-opacity="0.16"/>
</svg>`.trim();
}

function inferName(prompt: string) {
  const patterns = [
    /我叫([A-Za-z\u4e00-\u9fa5·]+)/,
    /我是([A-Za-z\u4e00-\u9fa5·]+)/,
    /叫我([A-Za-z\u4e00-\u9fa5·]+)/,
    /name[:：]?\s*([A-Za-z\u4e00-\u9fa5·]+)/i,
  ];

  for (const pattern of patterns) {
    const match = prompt.match(pattern);
    if (match?.[1]) {
      return match[1].replace(/老师|总|哥|姐|就行|哈|呀/g, '');
    }
  }

  return null;
}

function inferField(prompt: string, patterns: RegExp[]) {
  for (const pattern of patterns) {
    const match = prompt.match(pattern);
    if (match?.[1]) return match[1];
  }
  return null;
}

function createCard(prompt: string, imageColor?: string | null): CardData {
  const name = inferName(prompt);
  const email = inferField(prompt, [/([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})/i]);
  const phone = inferField(prompt, [/(1[3-9]\d{9})/, /(\+?\d[\d\s-]{7,}\d)/]);
  const social = inferField(prompt, [/微信[是:： ]?([A-Za-z0-9_-]+)/, /twitter[是:： ]?([A-Za-z0-9_]+)/i]);
  const company = inferField(prompt, [/在(.+?)工作/, /来自(.+?)(?:，|。|,)/, /(.+?)的(设计师|开发者|创始人|产品经理|顾问)/]);
  const title = inferField(prompt, [/(全栈开发者|设计师|独立游戏开发者|产品经理|创始人|顾问|程序员|运营负责人|导演|摄影师)/]);
  const confidence = name ? 0.92 : 0.48;
  const theme =
    prompt.includes('极简') ? templateThemes[1] :
    prompt.includes('金融') ? templateThemes[2] :
    templateThemes[0];

  return {
    name,
    title,
    company,
    phone,
    email,
    social,
    insight: confidence > 0.8 ? '已匹配高科技深色主题' : '检测到称呼可能有歧义，请点按名片修正',
    confidence,
    themeMode: theme.mode,
    primaryColor: imageColor || theme.primary,
    secondaryColor: theme.secondary,
    layout: theme.layout,
    background: theme.background,
  };
}

async function extractAverageColor(file: File) {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Image read failed.'));
    reader.readAsDataURL(file);
  });

  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Image load failed.'));
    image.src = dataUrl;
  });

  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 32;
  const context = canvas.getContext('2d');
  if (!context) return '#22d3ee';
  context.drawImage(img, 0, 0, 32, 32);
  const { data } = context.getImageData(0, 0, 32, 32);

  let r = 0;
  let g = 0;
  let b = 0;
  const count = data.length / 4;
  for (let index = 0; index < data.length; index += 4) {
    r += data[index];
    g += data[index + 1];
    b += data[index + 2];
  }

  return `#${[r, g, b].map((value) => Math.round(value / count).toString(16).padStart(2, '0')).join('')}`;
}

async function compressImage(file: File) {
  const rawDataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Image read failed.'));
    reader.readAsDataURL(file);
  });

  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Image load failed.'));
    image.src = rawDataUrl;
  });

  const canvas = document.createElement('canvas');
  const maxWidth = 768;
  const scale = Math.min(1, maxWidth / img.width);
  canvas.width = Math.max(1, Math.round(img.width * scale));
  canvas.height = Math.max(1, Math.round(img.height * scale));
  const context = canvas.getContext('2d');
  if (!context) return rawDataUrl;
  context.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL('image/jpeg', 0.82);
}

export default function MicroSkillSandbox({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useLanguage();
  const [prompt, setPrompt] = useState(defaultPrompt);
  const [logs, setLogs] = useState<string[]>([]);
  const [card, setCard] = useState<CardData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageColor, setImageColor] = useState<string | null>(null);
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [nameOverride, setNameOverride] = useState('');
  const [editingName, setEditingName] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [qrDataUrl, setQrDataUrl] = useState('');
  const timerRef = useRef<number[]>([]);
  const cardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    return () => {
      timerRef.current.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  const effectiveCard = useMemo(() => {
    if (!card) return null;
    return {
      ...card,
      name: editingName ? nameOverride : (nameOverride || card.name),
    };
  }, [card, editingName, nameOverride]);

  useEffect(() => {
    if (!effectiveCard) {
      setShareUrl('');
      setQrDataUrl('');
      return;
    }

    const nextUrl = createCardShareUrl(effectiveCard);
    setShareUrl(nextUrl);
    void QRCode.toDataURL(nextUrl, {
      margin: 1,
      width: 180,
      color: {
        dark: '#ffffff',
        light: '#00000000',
      },
    }).then(setQrDataUrl);
  }, [effectiveCard]);

  const runGenerate = async () => {
    setIsGenerating(true);
    setLogs([]);
    setCard(null);

    const stagedLogs = [
      t('micro.log1'),
      t('micro.log2'),
      t('micro.log3'),
      t('micro.log4'),
    ];

    stagedLogs.forEach((line, index) => {
      const timer = window.setTimeout(() => {
        setLogs((prev) => [...prev, line]);
      }, index * 550);
      timerRef.current.push(timer);
    });

    const timer = window.setTimeout(async () => {
      try {
        const response = await fetch('/api/micro-skill', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt,
            imageColor,
            imageDataUrl,
          }),
        });

        const result = await readJsonResponse<{ ok: boolean; card?: CardData; message?: string }>(response);
        if (!response.ok || !result.ok || !result.card) {
          throw new Error(result.message || 'Micro-skill generation failed.');
        }

        setCard(result.card);
        setNameOverride(result.card.name || '');
      } catch {
        const fallbackCard = createCard(prompt, imageColor);
        setCard(fallbackCard);
        setNameOverride(fallbackCard.name || '');
        setLogs((prev) => [...prev, t('micro.fallback')]);
      } finally {
        setEditingName(false);
        setIsGenerating(false);
      }
    }, stagedLogs.length * 550 + 350);

    timerRef.current.push(timer);
  };

  const onImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const [color, compressed] = await Promise.all([extractAverageColor(file), compressImage(file)]);
    setImageColor(color);
    setImageDataUrl(compressed);
  };

  const handleDownloadPng = async () => {
    if (!cardRef.current || !effectiveCard) return;
    const dataUrl = await toPng(cardRef.current, {
      cacheBust: true,
      pixelRatio: 2,
      backgroundColor: '#09090b',
    });
    downloadFile(`${(effectiveCard.name || 'one-prompt-card').replace(/\s+/g, '-').toLowerCase()}.png`, dataUrl);
  };

  const handleDownloadSvg = () => {
    if (!effectiveCard) return;
    const svg = createCardSvg(effectiveCard);
    const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    downloadFile(`${(effectiveCard.name || 'one-prompt-card').replace(/\s+/g, '-').toLowerCase()}.svg`, url);
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const handleCopyShareUrl = async () => {
    if (!shareUrl) return;
    await navigator.clipboard.writeText(shareUrl);
    setLogs((prev) => [...prev, t('micro.linkCopied')]);
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] bg-black/70 backdrop-blur-md px-4 py-6 overflow-auto"
        >
          <div className="mx-auto max-w-6xl min-h-full flex items-center">
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              className="w-full glass-panel rounded-[2.5rem] border border-white/10 p-6 md:p-10 relative"
            >
              <button onClick={onClose} className="absolute top-5 right-5 rounded-full border border-white/10 bg-white/5 p-3 text-zinc-400 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>

              <div className="max-w-2xl">
                <p className="text-cyan-300 uppercase tracking-[0.35em] text-xs">{t('micro.eyebrow')}</p>
                <h2 className="mt-4 text-4xl md:text-6xl font-semibold tracking-tight">{t('micro.title')}</h2>
                <p className="mt-4 text-zinc-400 text-lg leading-8">{t('micro.desc')}</p>
              </div>

              <div className="mt-10 grid gap-6 xl:grid-cols-[0.92fr_1.08fr] items-start">
                <div className="rounded-[2rem] border border-white/10 bg-black/35 p-5 md:p-6">
                  <div className="flex gap-3 mb-4">
                    <button type="button" className="rounded-2xl border border-white/10 bg-white/5 p-3 text-zinc-400">
                      <Mic className="w-4 h-4" />
                    </button>
                    <label className="rounded-2xl border border-white/10 bg-white/5 p-3 text-zinc-400 cursor-pointer">
                      <ImagePlus className="w-4 h-4" />
                      <input type="file" accept="image/*" className="hidden" onChange={onImageChange} />
                    </label>
                    <button onClick={runGenerate} disabled={isGenerating} className="ml-auto inline-flex items-center gap-2 rounded-2xl bg-white text-black px-5 py-3 font-medium disabled:opacity-60">
                      <Wand2 className="w-4 h-4" />
                      {t('micro.generate')}
                    </button>
                  </div>

                  <textarea
                    value={prompt}
                    onChange={(event) => setPrompt(event.target.value)}
                    placeholder={t('micro.placeholder')}
                    rows={7}
                    className="w-full rounded-[1.5rem] border border-white/10 bg-black/60 px-5 py-4 text-white placeholder:text-zinc-600 resize-none focus:outline-none focus:border-cyan-500/50"
                  />

                  <div className="mt-5 rounded-[1.5rem] border border-white/10 bg-[#09090b] p-4 min-h-[190px] font-mono text-sm text-zinc-400">
                    {logs.length ? logs.map((line, index) => (
                      <div key={`${line}-${index}`} className="mb-2 last:mb-0">{line}</div>
                    )) : <div className="text-zinc-600">{t('micro.consoleIdle')}</div>}
                  </div>
                </div>

                <div className="rounded-[2rem] border border-white/10 bg-black/35 p-5 md:p-6">
                  <div
                    ref={cardRef}
                    className="rounded-[2rem] border border-white/10 p-8 md:p-10 min-h-[540px] relative overflow-hidden"
                    style={{
                      background:
                        effectiveCard
                          ? `radial-gradient(circle at top left, ${effectiveCard.primaryColor}22, transparent 36%), linear-gradient(135deg, #111114 0%, #050505 100%)`
                          : 'linear-gradient(135deg, #111114 0%, #050505 100%)',
                    }}
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.06),transparent_30%)]" />
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-8">
                        <div className="w-12 h-12 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center">
                          <Sparkles className="w-5 h-5" style={{ color: effectiveCard?.primaryColor || '#22d3ee' }} />
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">{t('micro.cardLabel')}</p>
                          <p className="text-sm text-zinc-400">{effectiveCard?.insight || t('micro.cardHint')}</p>
                        </div>
                      </div>

                      {effectiveCard ? (
                        <>
                          <div className="mb-8">
                            {editingName ? (
                              <input
                                value={nameOverride}
                                onChange={(event) => setNameOverride(event.target.value)}
                                onBlur={() => setEditingName(false)}
                                autoFocus
                                className="bg-transparent text-4xl md:text-5xl font-semibold tracking-tight text-white border-b border-cyan-400/40 focus:outline-none"
                              />
                            ) : (
                              <button onClick={() => setEditingName(true)} className="text-left">
                                <div className="text-4xl md:text-5xl font-semibold tracking-tight text-white">
                                  {effectiveCard.name || t('micro.nameFallback')}
                                </div>
                              </button>
                            )}
                            <p className="mt-3 text-lg text-zinc-300">{effectiveCard.title || t('micro.roleFallback')}</p>
                            <p className="mt-2 text-zinc-500">{effectiveCard.company || t('micro.companyFallback')}</p>
                          </div>

                          <div className="grid gap-4 md:grid-cols-2">
                            <div className="rounded-[1.5rem] border border-white/10 bg-black/40 p-5">
                              <p className="text-xs uppercase tracking-[0.3em] text-zinc-500 mb-3">Contact</p>
                              <p className="text-zinc-200">{effectiveCard.email || 'email@placeholder.ai'}</p>
                              <p className="text-zinc-400 mt-2">{effectiveCard.phone || effectiveCard.social || 'WeChat / Phone pending'}</p>
                            </div>
                            <div className="rounded-[1.5rem] border border-white/10 bg-black/40 p-5">
                              <p className="text-xs uppercase tracking-[0.3em] text-zinc-500 mb-3">Theme</p>
                              <p className="text-zinc-200">{effectiveCard.layout} / {effectiveCard.background}</p>
                              <p className="mt-2 text-zinc-400">{Math.round(effectiveCard.confidence * 100)}% name confidence</p>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="min-h-[360px] flex items-center justify-center text-center text-zinc-600">
                          {t('micro.previewEmpty')}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-5 flex flex-col sm:flex-row gap-3">
                    <button onClick={handleDownloadPng} disabled={!effectiveCard} className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-zinc-300 inline-flex items-center justify-center gap-2 disabled:opacity-50">
                      <Download className="w-4 h-4" />
                      {t('micro.downloadPng')}
                    </button>
                    <button onClick={handleDownloadSvg} disabled={!effectiveCard} className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-zinc-300 inline-flex items-center justify-center gap-2 disabled:opacity-50">
                      <Download className="w-4 h-4" />
                      {t('micro.downloadSvg')}
                    </button>
                    <button onClick={handleCopyShareUrl} disabled={!shareUrl} className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-zinc-300 inline-flex items-center justify-center gap-2 disabled:opacity-50">
                      <Copy className="w-4 h-4" />
                      {t('micro.copyLink')}
                    </button>
                    <a href="#contact" onClick={onClose} className="rounded-2xl bg-white text-black px-5 py-3 font-medium text-center">
                      {t('micro.cta')}
                    </a>
                    <button onClick={() => setPrompt(defaultPrompt)} className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-zinc-300">
                      {t('micro.reset')}
                    </button>
                  </div>

                  {shareUrl ? (
                    <div className="mt-5 rounded-[1.5rem] border border-white/10 bg-black/40 p-4 md:p-5 flex flex-col md:flex-row gap-4 md:items-center">
                      <div className="w-[120px] h-[120px] rounded-2xl border border-white/10 bg-black/50 flex items-center justify-center shrink-0">
                        {qrDataUrl ? <img src={qrDataUrl} alt="Card QR code" className="w-[96px] h-[96px]" /> : <QrCode className="w-8 h-8 text-zinc-600" />}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm uppercase tracking-[0.3em] text-zinc-500 mb-2">{t('micro.qrTitle')}</p>
                        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-300 break-all">
                          {shareUrl}
                        </div>
                        <p className="mt-3 text-sm text-zinc-500">{t('micro.qrDesc')}</p>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
