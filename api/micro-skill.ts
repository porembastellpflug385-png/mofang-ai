import { generateMicroSkillCard } from '../lib/micro-skill-engine';

export default async function handler(request: any, response: any) {
  if (request.method !== 'POST') {
    response.status(405).json({ ok: false, message: 'Method not allowed.' });
    return;
  }

  const prompt = String(request.body?.prompt || '').trim();
  const imageColor = request.body?.imageColor ? String(request.body.imageColor) : null;
  const imageDataUrl = request.body?.imageDataUrl ? String(request.body.imageDataUrl) : null;

  if (!prompt) {
    response.status(400).json({ ok: false, message: 'prompt is required.' });
    return;
  }

  try {
    const card = await generateMicroSkillCard({ prompt, imageColor, imageDataUrl });
    response.status(200).json({ ok: true, card });
  } catch (error) {
    response.status(500).json({
      ok: false,
      message: error instanceof Error ? error.message : 'Micro-skill generation failed.',
    });
  }
}
