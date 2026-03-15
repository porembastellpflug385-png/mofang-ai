export type MicroSkillCardData = {
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

const TEST_BASE_URL = 'https://ai.scd666.com/v1/chat/completions';
const TEST_API_KEY = 'sk-12a7BPJym4RJSfqoVq5EHEEAs4ohQjIAZOA8QWVMNmFA0Fru';
const TEST_MODEL = 'gemini-3.1-flash-image-preview';

function extractJson(text: string) {
  const codeBlockMatch = text.match(/```json\s*([\s\S]*?)```/i);
  if (codeBlockMatch?.[1]) {
    return codeBlockMatch[1].trim();
  }

  const firstBrace = text.indexOf('{');
  const lastBrace = text.lastIndexOf('}');
  if (firstBrace >= 0 && lastBrace > firstBrace) {
    return text.slice(firstBrace, lastBrace + 1);
  }

  throw new Error('Model did not return valid JSON.');
}

function normalizeHex(value: string | null | undefined, fallback: string) {
  if (!value) return fallback;
  const trimmed = value.trim();
  return /^#[0-9a-fA-F]{6}$/.test(trimmed) ? trimmed : fallback;
}

export function createMicroSkillPrompt(userPrompt: string, imageColor?: string | null) {
  return [
    '# Role',
    '你是 MOFANG AI 的 Intent-to-UI Engine，要把用户的非结构化自我介绍解析成电子名片 UI 所需的 JSON。',
    '',
    '# Rules',
    '1. 精准提取姓名、职位、公司、电话、邮箱、社交信息。',
    '2. 如果用户没有明确提供姓名，name 必须输出 null，不能臆造。',
    '3. 如果用户使用昵称如“小李”“张哥”“Kevin老师”，请剥离尊称，只保留核心名字。',
    '4. 根据用户语气和职业推断视觉风格。',
    `5. 如果提供了参考色，请优先把 primary_color 设为 ${imageColor || 'null'} 或与其接近。`,
    '',
    '# Few-Shot',
    '输入: 我是做前端开发的，叫我小李就行，手机号是13900000000',
    '输出: {"personal_data":{"name":"李","title":"前端开发","company":null,"contact":{"phone":"13900000000","email":null,"social_link":null}},"design_system":{"theme_mode":"dark","primary_color":"#22d3ee","secondary_color":"#a78bfa","layout_style":"tech","background_effect":"gradient"},"ai_insight":"已匹配深色极客主题","name_confidence":0.91}',
    '输入: 帮我弄个极简风的名片，我是产品经理，邮箱是 admin@test.com',
    '输出: {"personal_data":{"name":null,"title":"产品经理","company":null,"contact":{"phone":null,"email":"admin@test.com","social_link":null}},"design_system":{"theme_mode":"light","primary_color":"#0f766e","secondary_color":"#e2e8f0","layout_style":"minimal","background_effect":"glassmorphism"},"ai_insight":"检测到称呼有歧义，请确认姓名","name_confidence":0.42}',
    '',
    '# Output',
    '只输出 JSON，不要输出解释。',
    '',
    JSON.stringify({
      personal_data: {
        name: '提取的姓名或 null',
        title: '提取的职位或 null',
        company: '提取的公司或 null',
        contact: {
          phone: '电话号码或 null',
          email: '邮箱或 null',
          social_link: '微信/推特/其他社交信息或 null',
        },
      },
      design_system: {
        theme_mode: 'dark or light',
        primary_color: '#HEX',
        secondary_color: '#HEX',
        layout_style: 'minimal or bold or tech',
        background_effect: 'glassmorphism or solid or gradient',
      },
      ai_insight: '15字以内的解释',
      name_confidence: 0.88,
    }),
    '',
    `用户输入：${userPrompt}`,
  ].join('\n');
}

export async function generateMicroSkillCard(options: {
  prompt: string;
  imageColor?: string | null;
  imageDataUrl?: string | null;
}) {
  const userContent = options.imageDataUrl
    ? [
        {
          type: 'text',
          text: options.prompt,
        },
        {
          type: 'image_url',
          image_url: {
            url: options.imageDataUrl,
          },
        },
      ]
    : options.prompt;

  const response = await fetch(process.env.MICRO_SKILL_BASE_URL || TEST_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.MICRO_SKILL_API_KEY || TEST_API_KEY}`,
    },
    body: JSON.stringify({
      model: process.env.MICRO_SKILL_MODEL || TEST_MODEL,
      temperature: 0.2,
      messages: [
        {
          role: 'system',
          content: createMicroSkillPrompt(options.prompt, options.imageColor),
        },
        {
          role: 'user',
          content: userContent,
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`Micro-skill API failed with ${response.status}`);
  }

  const payload = (await response.json()) as {
    choices?: Array<{
      message?: {
        content?: string;
      };
    }>;
  };

  const content = payload.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error('Micro-skill API returned empty content.');
  }

  const parsed = JSON.parse(extractJson(content)) as {
    personal_data?: {
      name?: string | null;
      title?: string | null;
      company?: string | null;
      contact?: {
        phone?: string | null;
        email?: string | null;
        social_link?: string | null;
      };
    };
    design_system?: {
      theme_mode?: 'dark' | 'light';
      primary_color?: string;
      secondary_color?: string;
      layout_style?: 'minimal' | 'bold' | 'tech';
      background_effect?: 'glassmorphism' | 'solid' | 'gradient';
    };
    ai_insight?: string;
    name_confidence?: number;
  };

  return {
    name: parsed.personal_data?.name ?? null,
    title: parsed.personal_data?.title ?? null,
    company: parsed.personal_data?.company ?? null,
    phone: parsed.personal_data?.contact?.phone ?? null,
    email: parsed.personal_data?.contact?.email ?? null,
    social: parsed.personal_data?.contact?.social_link ?? null,
    insight: parsed.ai_insight || '已生成电子名片方案',
    confidence: typeof parsed.name_confidence === 'number' ? parsed.name_confidence : 0.78,
    themeMode: parsed.design_system?.theme_mode || 'dark',
    primaryColor: normalizeHex(parsed.design_system?.primary_color, options.imageColor || '#22d3ee'),
    secondaryColor: normalizeHex(parsed.design_system?.secondary_color, '#a78bfa'),
    layout: parsed.design_system?.layout_style || 'tech',
    background: parsed.design_system?.background_effect || 'gradient',
  } satisfies MicroSkillCardData;
}
