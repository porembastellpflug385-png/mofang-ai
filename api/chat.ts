import nodemailer from 'nodemailer';

const humanKeywords = ['人工', '真人', '人工客服', 'real person', 'stall'];

function createTransporter() {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 465),
    secure: process.env.SMTP_SECURE !== 'false',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

function requiresHuman(message: string) {
  const normalized = message.toLowerCase();
  return humanKeywords.some((keyword) => normalized.includes(keyword.toLowerCase()));
}

export default async function handler(request: any, response: any) {
  if (request.method !== 'POST') {
    response.status(405).json({ ok: false, message: 'Method not allowed.' });
    return;
  }

  const message = String(request.body?.message || '').trim();
  if (!message) {
    response.status(400).json({ ok: false, message: 'Message is required.' });
    return;
  }

  const needsHuman = requiresHuman(message);
  const reply = needsHuman
    ? '已为您切换到人工客服优先队列，后台会立即收到提醒。为了更快处理，请补充您的邮箱、公司名称和核心需求。'
    : '您好，我已收到您的消息。您可以继续告诉我预算、功能目标、上线时间或接口需求，我会先给您一版快速建议。';

  const transporter = createTransporter();
  const recipient = process.env.CONTACT_RECEIVER_EMAIL;
  if (transporter && recipient) {
    try {
      await transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: recipient,
        subject: needsHuman ? 'Urgent: MOFANG AI human-support request' : 'New MOFANG AI chat message',
        text: `Needs human: ${needsHuman ? 'Yes' : 'No'}\n\n${message}`,
      });
    } catch {
      // Keep chat responsive even if mail delivery fails.
    }
  }

  response.status(200).json({
    ok: true,
    conversationId: `chat-${Date.now()}`,
    reply,
    needsHuman,
  });
}
