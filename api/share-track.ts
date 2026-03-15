import fs from 'node:fs/promises';
import path from 'node:path';

const dataDir = path.join(process.cwd(), 'data');
const eventsFile = path.join(dataDir, 'share-events.json');

async function ensureFile() {
  await fs.mkdir(dataDir, { recursive: true });
  try {
    await fs.access(eventsFile);
  } catch {
    await fs.writeFile(eventsFile, JSON.stringify([], null, 2), 'utf8');
  }
}

export default async function handler(request: any, response: any) {
  if (request.method !== 'POST') {
    response.status(405).json({ ok: false, message: 'Method not allowed.' });
    return;
  }

  const { cardId, action, name, title } = request.body || {};
  if (!cardId || !action) {
    response.status(400).json({ ok: false, message: 'cardId and action are required.' });
    return;
  }

  await ensureFile();
  const content = await fs.readFile(eventsFile, 'utf8');
  const items = JSON.parse(content) as Array<Record<string, string>>;
  items.unshift({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    cardId: String(cardId),
    action: String(action),
    name: name ? String(name) : '',
    title: title ? String(title) : '',
    createdAt: new Date().toISOString(),
  });
  await fs.writeFile(eventsFile, JSON.stringify(items, null, 2), 'utf8');
  response.status(200).json({ ok: true });
}
