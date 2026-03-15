import { Copy, Download, Mail, MessageSquare, Phone, QrCode } from 'lucide-react';
import { useEffect } from 'react';
import { parseCardSharePayload } from '../lib/microSkillShare';

type Props = {
  payload: string;
};

export default function SharedCardPage({ payload }: Props) {
  const card = parseCardSharePayload(payload);
  const cardId = payload.slice(0, 16);

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
            background: `radial-gradient(circle at top left, ${card.primaryColor}22, transparent 36%), linear-gradient(135deg, #111114 0%, #050505 100%)`,
          }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.06),transparent_30%)]" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-14 h-14 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center">
                <QrCode className="w-6 h-6" style={{ color: card.primaryColor }} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">MOFANG AI CARD</p>
                <p className="text-sm text-zinc-400">{card.insight}</p>
              </div>
            </div>

            <div className="mb-10">
              <h1 className="text-5xl md:text-7xl font-semibold tracking-tight text-white">{card.name || 'Name Pending'}</h1>
              <p className="mt-4 text-xl md:text-2xl text-zinc-300">{card.title || 'Role Pending'}</p>
              <p className="mt-2 text-zinc-500 text-lg">{card.company || 'Independent Builder'}</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-[1.5rem] border border-white/10 bg-black/40 p-5">
                <p className="text-xs uppercase tracking-[0.3em] text-zinc-500 mb-3">Contact</p>
                <p className="text-zinc-200 break-all">{card.email || 'email@placeholder.ai'}</p>
                <p className="text-zinc-400 mt-2 break-all">{card.phone || card.social || 'WeChat / Phone pending'}</p>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-black/40 p-5">
                <p className="text-xs uppercase tracking-[0.3em] text-zinc-500 mb-3">Design System</p>
                <p className="text-zinc-200">{card.layout} / {card.background}</p>
                <p className="text-zinc-400 mt-2">{Math.round(card.confidence * 100)}% name confidence</p>
              </div>
            </div>

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
