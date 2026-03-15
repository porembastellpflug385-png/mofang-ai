import { FormEvent, useState } from 'react';
import { Bot, SendHorizonal } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

type ChatItem = {
  role: 'user' | 'assistant';
  content: string;
};

export default function SmartChatWidget({ onNewMessage }: { onNewMessage?: () => Promise<void> | void }) {
  const { t } = useLanguage();
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState<ChatItem[]>([
    {
      role: 'assistant',
      content: '您好，我是魔方AI客服助手，可以帮您了解产品能力、项目报价、接口集成与部署流程。',
    },
  ]);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!draft.trim()) return;

    const userMessage = draft.trim();
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setDraft('');
    setSending(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversationId,
          message: userMessage,
        }),
      });

      const result = (await response.json()) as {
        ok: boolean;
        conversationId: string;
        reply: string;
        needsHuman?: boolean;
      };

      if (!response.ok || !result.ok) {
        throw new Error('Chat failed');
      }

      setConversationId(result.conversationId);
      setMessages((prev) => [...prev, { role: 'assistant', content: result.reply }]);
      await onNewMessage?.();
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: '当前智能回复暂时不可用，但您的留言已经进入后台收件箱，团队会尽快联系您。',
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="glass-panel rounded-[2rem] p-6 md:p-8">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
          <Bot className="w-6 h-6 text-cyan-300" />
        </div>
        <h3 className="text-2xl font-semibold">{t('ops.chatTitle')}</h3>
      </div>
      <p className="text-zinc-400 mb-6">{t('ops.chatDesc')}</p>

      <div className="space-y-3 rounded-[1.5rem] border border-white/10 bg-black/30 p-4 h-[24rem] md:h-[26rem] overflow-auto">
        {messages.map((item, index) => (
          <div
            key={`${item.role}-${index}`}
            className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-6 ${
              item.role === 'assistant'
                ? 'bg-white/5 border border-white/10 text-zinc-200'
                : 'ml-auto bg-cyan-500/15 border border-cyan-500/30 text-cyan-50'
            }`}
          >
            {item.content}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="mt-4 flex gap-3">
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder={t('ops.chatPlaceholder')}
          className="flex-1 bg-black/50 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500/50 transition-colors"
        />
        <button disabled={sending} className="rounded-2xl bg-white text-black px-5 py-4 font-medium hover:bg-zinc-200 transition-colors disabled:opacity-60 inline-flex items-center justify-center gap-2 min-w-[88px]">
          <SendHorizonal className="w-4 h-4" />
          <span className="hidden sm:inline">{t('ops.chatButton')}</span>
        </button>
      </form>
    </div>
  );
}
