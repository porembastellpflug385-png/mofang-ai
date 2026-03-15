import { Copy, Download, Mail, MessageSquare, Phone, QrCode } from 'lucide-react';
import { useEffect } from 'react';
import { parseCardSharePayload } from '../lib/microSkillShare';

type Props = {
  payload: string;
};

export default function SharedCardPage({ payload }: Props) {
  const card = parseCardSharePayload(payload);
  const cardId = payload.slice(0, 16);
  const template = card.template || 'tech-noir';
  const templateLabel = template === 'tech-noir' ? 'Tech Noir' : template === 'executive-minimal' ? 'Executive Minimal' : 'Fashion Editorial';
  const sectionGap = card.spacingDensity === 'airy' ? 'mb-10' : card.spacingDensity === 'compact' ? 'mb-6' : 'mb-8';
  const compositionGrid = template === 'fashion-editorial'
    ? 'md:grid-cols-[1.15fr_0.85fr]'
    : template === 'executive-minimal'
      ? (card.compositionType === 'stacked' ? 'md:grid-cols-1' : 'md:grid-cols-[0.9fr_1.1fr]')
      : (card.compositionType === 'stacked' ? 'md:grid-cols-1' : card.compositionType === 'asymmetrical' ? 'md:grid-cols-[1.2fr_0.8fr]' : 'md:grid-cols-2');

  const track = async (action: string) => {
    try {
      await fetch('/api/share-track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cardId,
          action,
          name: card.name,
          title: card.title,
        }),
      });
    } catch {
      // Best-effort analytics only.
    }
  };

  useEffect(() => {
    void track('page_open');
  }, []);

  const copySocial = async () => {
    if (!card.social) return;
    await navigator.clipboard.writeText(card.social);
    await track('copy_social');
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white px-4 py-10">
      <div className="mx-auto max-w-4xl">
        <div
          className="rounded-[2.5rem] border border-white/10 p-8 md:p-12 relative overflow-hidden"
          style={{
            background:
              template === 'executive-minimal'
                ? 'linear-gradient(180deg, #12141b 0%, #0a0c11 100%)'
                : template === 'fashion-editorial'
                  ? `radial-gradient(circle at 18% 18%, ${card.primaryColor}22, transparent 28%), radial-gradient(circle at 82% 16%, ${card.secondaryColor}18, transparent 22%), linear-gradient(145deg, #140f13 0%, #08080b 100%)`
                  : `radial-gradient(circle at top left, ${card.primaryColor}26, transparent 34%), radial-gradient(circle at 82% 14%, ${card.secondaryColor}16, transparent 22%), linear-gradient(145deg, #121218 0%, #050505 100%)`,
          }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.06),transparent_30%)]" />
          {template !== 'fashion-editorial' ? (
            <div className="absolute left-8 top-10 bottom-10 w-[6px] rounded-full" style={{ background: `linear-gradient(180deg, ${card.primaryColor}, ${card.secondaryColor})` }} />
          ) : null}
          {template === 'fashion-editorial' ? (
            <div className={`absolute right-8 top-8 ${card.ornamentLevel === 'expressive' ? 'h-[20rem] w-[20rem] opacity-40' : 'h-[16rem] w-[16rem] opacity-25'} rounded-full blur-3xl`} style={{ background: `radial-gradient(circle, ${card.primaryColor}, transparent 68%)` }} />
          ) : null}
          {template === 'executive-minimal' ? (
            <div className="absolute left-10 right-10 top-14 h-px" style={{ background: `linear-gradient(90deg, transparent, ${card.primaryColor}, ${card.secondaryColor}, transparent)` }} />
          ) : null}
          <div className="relative z-10">
            <div className={`flex items-center gap-3 mb-10 ${template === 'fashion-editorial' ? '' : 'pl-6'}`}>
              <div className="w-14 h-14 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center">
                <QrCode className="w-6 h-6" style={{ color: card.primaryColor }} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">MOFANG AI CARD</p>
                <p className="text-sm text-zinc-400">{card.insight}</p>
              </div>
            </div>

            <div className={`${sectionGap} ${template === 'fashion-editorial' ? '' : 'pl-6'}`}>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] uppercase tracking-[0.35em] text-zinc-400">
                <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: card.primaryColor }} />
                {templateLabel}
              </div>
              <h1 className={`${card.typographyTone === 'precision' ? 'tracking-[0.02em]' : card.typographyTone === 'editorial' ? 'tracking-[-0.04em]' : 'tracking-tight'} text-5xl md:text-7xl font-semibold text-white`}>{card.name || 'Name Pending'}</h1>
              <p className={`${template === 'fashion-editorial' ? 'mt-4 text-2xl md:text-3xl' : template === 'executive-minimal' ? 'mt-4 text-xl uppercase tracking-[0.25em]' : 'mt-4 text-xl md:text-2xl'} text-zinc-300`}>{card.title || 'Role Pending'}</p>
              <p className="mt-2 text-zinc-500 text-lg">{card.company || '独立创作者'}</p>
              {card.tagline ? (
                <p className={`${template === 'fashion-editorial' ? 'mt-6 text-3xl md:text-4xl max-w-lg leading-tight' : 'mt-5 text-sm uppercase tracking-[0.35em]'} text-zinc-300`}>
                  {card.tagline}
                </p>
              ) : null}
            </div>

            <div className={`grid ${card.spacingDensity === 'airy' ? 'gap-5' : card.spacingDensity === 'compact' ? 'gap-3' : 'gap-4'} ${compositionGrid}`}>
              <div className="rounded-[1.5rem] border border-white/10 bg-black/40 p-5">
                <p className="text-xs uppercase tracking-[0.3em] text-zinc-500 mb-3">{template === 'fashion-editorial' ? 'DIRECT CHANNEL' : 'Contact'}</p>
                <p className="text-zinc-200 break-all">{card.email || 'email@placeholder.ai'}</p>
                <p className="text-zinc-400 mt-2 break-all">{card.phone || card.social || 'WeChat / Phone pending'}</p>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-black/40 p-5">
                <p className="text-xs uppercase tracking-[0.3em] text-zinc-500 mb-3">{template === 'executive-minimal' ? 'BRAND RATIONALE' : 'Design Logic'}</p>
                <p className="text-zinc-200">{card.insight}</p>
                <p className="text-zinc-400 mt-2">{card.typographyTone} / {card.spacingDensity} / {card.compositionType} / {Math.round(card.confidence * 100)}% name confidence</p>
              </div>
            </div>

            {template === 'fashion-editorial' ? (
              <div className={`mt-4 grid gap-4 ${card.compositionType === 'stacked' ? 'md:grid-cols-1' : 'md:grid-cols-[1fr_10rem]'}`}>
                <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-5 py-4 text-sm text-zinc-400">
                  {card.motif ? `Visual motif: ${card.motif}` : 'Visual motif: premium editorial composition'}
                </div>
                <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-5 py-4 text-right">
                  <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Edition</p>
                  <p className="mt-2 text-2xl font-semibold text-white">03</p>
                </div>
              </div>
            ) : (
              <div className="mt-4 rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-5 py-4 text-sm text-zinc-400">
                {card.motif ? `Visual motif: ${card.motif}` : 'Visual motif: premium tech composition'}
              </div>
            )}

            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <a
                href={card.phone ? `tel:${card.phone}` : undefined}
                onClick={() => void track('click_phone')}
                className={`rounded-2xl border border-white/10 bg-white/5 px-4 py-4 inline-flex items-center justify-center gap-2 ${card.phone ? 'text-white' : 'text-zinc-600 pointer-events-none'}`}
              >
                <Phone className="w-4 h-4" />
                拨打电话
              </a>
              <a
                href={card.email ? `mailto:${card.email}` : undefined}
                onClick={() => void track('click_email')}
                className={`rounded-2xl border border-white/10 bg-white/5 px-4 py-4 inline-flex items-center justify-center gap-2 ${card.email ? 'text-white' : 'text-zinc-600 pointer-events-none'}`}
              >
                <Mail className="w-4 h-4" />
                发送邮件
              </a>
              <button
                onClick={() => void copySocial()}
                disabled={!card.social}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 inline-flex items-center justify-center gap-2 text-white disabled:text-zinc-600"
              >
                <Copy className="w-4 h-4" />
                复制微信
              </button>
              <a
                href="/#contact"
                onClick={() => void track('continue_consult')}
                className="rounded-2xl bg-white text-black px-4 py-4 inline-flex items-center justify-center gap-2 font-medium"
              >
                <MessageSquare className="w-4 h-4" />
                继续咨询
              </a>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <a href="#/" className="rounded-2xl bg-white text-black px-5 py-3 font-medium text-center">返回首页</a>
          <button onClick={() => window.print()} className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-zinc-300 inline-flex items-center justify-center gap-2">
            <Download className="w-4 h-4" />
            保存 / 打印
          </button>
        </div>
      </div>
    </div>
  );
}
