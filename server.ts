import 'dotenv/config';
import express, { NextFunction, Request, Response } from 'express';
import multer from 'multer';
import nodemailer from 'nodemailer';
import { GoogleGenAI } from '@google/genai';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import crypto from 'node:crypto';

type AssetRecord = {
  id: string;
  originalName: string;
  storedName: string;
  mimeType: string;
  size: number;
  url: string;
  createdAt: string;
  storage: 'local' | 's3';
};

type InboxRecord = {
  id: string;
  type: 'contact' | 'chat';
  name?: string;
  company?: string;
  email?: string;
  message: string;
  createdAt: string;
};

type ChatTurn = {
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
};

type ChatConversation = {
  id: string;
  email?: string;
  name?: string;
  createdAt: string;
  updatedAt: string;
  turns: ChatTurn[];
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = __dirname;
const dataDir = path.join(rootDir, 'data');
const uploadsDir = path.join(rootDir, 'uploads');
const assetsFile = path.join(dataDir, 'assets.json');
const inboxFile = path.join(dataDir, 'messages.json');
const chatsFile = path.join(dataDir, 'chats.json');
const publicAppUrl = process.env.PUBLIC_APP_URL || 'http://localhost:3000';
const storageProvider = process.env.STORAGE_PROVIDER === 's3' ? 's3' : 'local';
const adminUsername = process.env.ADMIN_USERNAME || 'admin';
const adminPassword = process.env.ADMIN_PASSWORD || 'change_this_password';
const adminSessionSecret = process.env.ADMIN_SESSION_SECRET || 'change_this_session_secret';

const app = express();
const port = Number(process.env.PORT || 3001);

app.use(express.json({ limit: '2mb' }));
app.use('/uploads', express.static(uploadsDir));

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 },
});

async function ensureStorage() {
  await fs.mkdir(dataDir, { recursive: true });
  await fs.mkdir(uploadsDir, { recursive: true });
  await ensureJsonFile<AssetRecord[]>(assetsFile, []);
  await ensureJsonFile<InboxRecord[]>(inboxFile, []);
  await ensureJsonFile<ChatConversation[]>(chatsFile, []);
}

async function ensureJsonFile<T>(filePath: string, initialValue: T) {
  try {
    await fs.access(filePath);
  } catch {
    await fs.writeFile(filePath, JSON.stringify(initialValue, null, 2), 'utf8');
  }
}

async function readJson<T>(filePath: string): Promise<T> {
  const content = await fs.readFile(filePath, 'utf8');
  return JSON.parse(content) as T;
}

async function writeJson<T>(filePath: string, value: T) {
  await fs.writeFile(filePath, JSON.stringify(value, null, 2), 'utf8');
}

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

async function sendEmail(options: { to: string; subject: string; text: string; html?: string }) {
  const transporter = createTransporter();
  if (!transporter) {
    throw new Error('SMTP is not configured.');
  }

  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    ...options,
  });
}

function signAdminToken(issuedAt: number) {
  const payload = `${adminUsername}:${issuedAt}`;
  const signature = crypto.createHmac('sha256', adminSessionSecret).update(payload).digest('hex');
  return Buffer.from(`${payload}:${signature}`).toString('base64url');
}

function verifyAdminToken(token?: string) {
  if (!token) {
    return false;
  }

  try {
    const decoded = Buffer.from(token, 'base64url').toString('utf8');
    const [username, issuedAtRaw, signature] = decoded.split(':');
    if (!username || !issuedAtRaw || !signature || username !== adminUsername) {
      return false;
    }

    const payload = `${username}:${issuedAtRaw}`;
    const expectedSignature = crypto.createHmac('sha256', adminSessionSecret).update(payload).digest('hex');
    if (signature !== expectedSignature) {
      return false;
    }

    const issuedAt = Number(issuedAtRaw);
    return Number.isFinite(issuedAt) && Date.now() - issuedAt < 1000 * 60 * 60 * 24;
  } catch {
    return false;
  }
}

function requireAdmin(request: Request, response: Response, next: NextFunction) {
  const token = request.header('x-admin-token');
  if (!verifyAdminToken(token)) {
    response.status(401).json({ ok: false, message: 'Unauthorized admin request.' });
    return;
  }
  next();
}

async function appendInboxItem(item: InboxRecord) {
  const inbox = await readJson<InboxRecord[]>(inboxFile);
  inbox.unshift(item);
  await writeJson(inboxFile, inbox);
}

function getS3Client() {
  if (
    !process.env.S3_BUCKET ||
    !process.env.S3_REGION ||
    !process.env.S3_ACCESS_KEY_ID ||
    !process.env.S3_SECRET_ACCESS_KEY
  ) {
    throw new Error('S3 storage is selected but S3 credentials are incomplete.');
  }

  return new S3Client({
    region: process.env.S3_REGION,
    endpoint: process.env.S3_ENDPOINT || undefined,
    forcePathStyle: Boolean(process.env.S3_ENDPOINT),
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    },
  });
}

async function persistUpload(file: Express.Multer.File) {
  const storedName = `${Date.now()}-${crypto.randomUUID()}${path.extname(file.originalname)}`;

  if (storageProvider === 's3') {
    const client = getS3Client();
    const bucket = process.env.S3_BUCKET as string;
    await client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: storedName,
        Body: file.buffer,
        ContentType: file.mimetype,
      })
    );

    const baseUrl =
      process.env.S3_PUBLIC_BASE_URL ||
      (process.env.S3_ENDPOINT
        ? `${process.env.S3_ENDPOINT.replace(/\/$/, '')}/${bucket}`
        : `https://${bucket}.s3.${process.env.S3_REGION}.amazonaws.com`);

    return {
      storedName,
      url: `${baseUrl.replace(/\/$/, '')}/${storedName}`,
      storage: 's3' as const,
    };
  }

  await fs.writeFile(path.join(uploadsDir, storedName), file.buffer);
  return {
    storedName,
    url: `${publicAppUrl}/uploads/${storedName}`,
    storage: 'local' as const,
  };
}

async function generateAssistantReply(message: string, history: ChatTurn[]) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return `已收到您的需求：“${message}”。我们建议先确认业务目标、所需上传资料类型，以及是否需要邮件通知和智能客服联动。`;
  }

  const client = new GoogleGenAI({ apiKey });
  const prompt = [
    '你是 MOFANG AI 官网的商务客服助手。',
    '用简洁、专业、友好的中文回答，重点介绍 AI 网站、后台上传、邮件通知、智能客服、项目交付。',
    '如果用户在询价或咨询项目，鼓励对方留下邮箱与需求。',
    '',
    '历史对话：',
    ...history.slice(-6).map((turn) => `${turn.role === 'user' ? '用户' : '助手'}: ${turn.content}`),
    '',
    `当前用户消息：${message}`,
  ].join('\n');

  const response = await client.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  });

  return response.text || '我们已经收到您的消息，稍后会由团队继续跟进。';
}

app.get('/api/health', (_request, response) => {
  response.json({ ok: true, storageProvider });
});

app.post('/api/admin/login', (request, response) => {
  const { username, password } = request.body as { username?: string; password?: string };
  if (username !== adminUsername || password !== adminPassword) {
    response.status(401).json({ ok: false, message: 'Invalid username or password.' });
    return;
  }

  response.json({ ok: true, token: signAdminToken(Date.now()) });
});

app.get('/api/admin/assets', requireAdmin, async (_request, response) => {
  const items = await readJson<AssetRecord[]>(assetsFile);
  response.json({ items, storageProvider });
});

app.get('/api/admin/messages', requireAdmin, async (_request, response) => {
  const items = await readJson<InboxRecord[]>(inboxFile);
  response.json({ items });
});

app.post('/api/admin/upload', requireAdmin, upload.array('files', 12), async (request, response) => {
  const files = request.files as Express.Multer.File[] | undefined;
  if (!files?.length) {
    response.status(400).json({ ok: false, message: 'No files uploaded.' });
    return;
  }

  try {
    const existingAssets = await readJson<AssetRecord[]>(assetsFile);
    const newAssets = await Promise.all(
      files.map(async (file) => {
        const stored = await persistUpload(file);
        return {
          id: crypto.randomUUID(),
          originalName: file.originalname,
          storedName: stored.storedName,
          mimeType: file.mimetype,
          size: file.size,
          url: stored.url,
          createdAt: new Date().toISOString(),
          storage: stored.storage,
        } satisfies AssetRecord;
      })
    );

    await writeJson(assetsFile, [...newAssets, ...existingAssets]);
    response.json({ ok: true, items: newAssets, storageProvider });
  } catch (error) {
    response.status(500).json({ ok: false, message: error instanceof Error ? error.message : 'Upload failed.' });
  }
});

app.post('/api/admin/send-email', requireAdmin, async (request, response) => {
  const { to, subject, message } = request.body as { to?: string; subject?: string; message?: string };
  if (!to || !subject || !message) {
    response.status(400).json({ ok: false, message: 'Missing email fields.' });
    return;
  }

  try {
    await sendEmail({
      to,
      subject,
      text: message,
      html: `<div style="font-family:Arial,sans-serif;line-height:1.7;"><p>${message.replace(/\n/g, '<br/>')}</p></div>`,
    });
    response.json({ ok: true });
  } catch (error) {
    response.status(500).json({ ok: false, message: error instanceof Error ? error.message : 'Email failed.' });
  }
});

app.post('/api/contact', async (request, response) => {
  const { name, company, email, message } = request.body as {
    name?: string;
    company?: string;
    email?: string;
    message?: string;
  };

  if (!name || !email || !message) {
    response.status(400).json({ ok: false, message: 'Name, email, and message are required.' });
    return;
  }

  const record: InboxRecord = {
    id: crypto.randomUUID(),
    type: 'contact',
    name,
    company,
    email,
    message,
    createdAt: new Date().toISOString(),
  };

  await appendInboxItem(record);

  const recipient = process.env.CONTACT_RECEIVER_EMAIL;
  if (recipient) {
    try {
      await sendEmail({
        to: recipient,
        subject: `New MOFANG AI lead from ${name}`,
        text: `Name: ${name}\nCompany: ${company || '-'}\nEmail: ${email}\n\nMessage:\n${message}`,
      });
    } catch (error) {
      response.status(500).json({ ok: false, message: error instanceof Error ? error.message : 'Email failed.' });
      return;
    }
  }

  response.json({ ok: true });
});

app.post('/api/chat', async (request, response) => {
  const { conversationId, message, email, name } = request.body as {
    conversationId?: string;
    message?: string;
    email?: string;
    name?: string;
  };

  if (!message?.trim()) {
    response.status(400).json({ ok: false, message: 'Message is required.' });
    return;
  }

  const chats = await readJson<ChatConversation[]>(chatsFile);
  let conversation = chats.find((item) => item.id === conversationId);

  if (!conversation) {
    conversation = {
      id: crypto.randomUUID(),
      email,
      name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      turns: [],
    };
    chats.unshift(conversation);
  }

  conversation.turns.push({
    role: 'user',
    content: message.trim(),
    createdAt: new Date().toISOString(),
  });
  conversation.updatedAt = new Date().toISOString();

  await appendInboxItem({
    id: crypto.randomUUID(),
    type: 'chat',
    name,
    email,
    message: message.trim(),
    createdAt: new Date().toISOString(),
  });

  const recipient = process.env.CONTACT_RECEIVER_EMAIL;
  if (recipient) {
    try {
      await sendEmail({
        to: recipient,
        subject: 'New MOFANG AI chat message',
        text: `Conversation: ${conversation.id}\nVisitor: ${name || email || 'anonymous'}\n\n${message.trim()}`,
      });
    } catch {
      // Keep chat available even if notification email fails.
    }
  }

  const reply = await generateAssistantReply(message.trim(), conversation.turns);
  conversation.turns.push({
    role: 'assistant',
    content: reply,
    createdAt: new Date().toISOString(),
  });
  conversation.updatedAt = new Date().toISOString();

  await writeJson(chatsFile, chats);
  response.json({ ok: true, conversationId: conversation.id, reply });
});

ensureStorage()
  .then(() => {
    app.listen(port, () => {
      console.log(`MOFANG AI backend running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error('Failed to initialize backend storage.', error);
    process.exit(1);
  });
