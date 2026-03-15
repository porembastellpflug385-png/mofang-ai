export type MicroSkillCardData = {
  template?: 'tech-noir' | 'executive-minimal' | 'fashion-editorial';
  name: string | null;
  title: string | null;
  company: string | null;
  phone: string | null;
  email: string | null;
  social: string | null;
  insight: string;
  tagline?: string | null;
  motif?: string | null;
  typographyTone?: 'precision' | 'editorial' | 'monument';
  spacingDensity?: 'compact' | 'balanced' | 'airy';
  ornamentLevel?: 'subtle' | 'medium' | 'expressive';
  compositionType?: 'split' | 'stacked' | 'asymmetrical';
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

function parseModelJson<T>(text: string) {
  const extracted = extractJson(text);

  try {
    return JSON.parse(extracted) as T;
  } catch {
    const repaired = extracted
      .replace(/}\s*},\s*"ai_insight"/g, '},"ai_insight"')
      .replace(/}\s*},\s*"name_confidence"/g, '},"name_confidence"');
    return JSON.parse(repaired) as T;
  }
}

function normalizeHex(value: string | null | undefined, fallback: string) {
  if (!value) return fallback;
  const trimmed = value.trim();
  return /^#[0-9a-fA-F]{6}$/.test(trimmed) ? trimmed : fallback;
}

function cleanTextValue(value: string | null | undefined) {
  if (!value) return null;
  const normalized = value.trim().replace(/^["'「」]/g, '').replace(/["'「」]$/g, '');
  return normalized || null;
}

function pickFirstString(...values: Array<string | null | undefined>) {
  for (const value of values) {
    const cleaned = cleanTextValue(value);
    if (cleaned) return cleaned;
  }
  return null;
}

function clampConfidence(value: unknown, fallback = 0.82) {
  if (typeof value !== 'number' || Number.isNaN(value)) return fallback;
  return Math.max(0, Math.min(1, value));
}

function normalizeName(value: string | null | undefined) {
  const cleaned = cleanTextValue(value);
  if (!cleaned) return null;
  const normalized = cleaned.replace(/^(姓名|名字|称呼)[:：]?\s*/i, '').replace(/老师|总|先生|女士|小姐|老板|哥|姐$/g, '');
  if (!normalized) return null;
  if (/^(全栈开发者|设计师|产品经理|程序员|开发者|创始人|顾问)$/u.test(normalized)) return null;
  if (normalized.length > 24) return null;
  return normalized;
}

function inferName(prompt: string) {
  const patterns = [
    /我叫\s*([A-Za-z\u4e00-\u9fa5·]+)/u,
    /我是\s*([A-Za-z\u4e00-\u9fa5·]{1,24})/u,
    /叫我\s*([A-Za-z\u4e00-\u9fa5·]+)/u,
    /name[:：]?\s*([A-Za-z\u4e00-\u9fa5·]+)/iu,
  ];

  for (const pattern of patterns) {
    const match = prompt.match(pattern);
    if (match?.[1]) {
      const result = normalizeName(match[1]);
      if (result) return result;
    }
  }

  return null;
}

function inferField(prompt: string, patterns: RegExp[]) {
  for (const pattern of patterns) {
    const match = prompt.match(pattern);
    if (match?.[1]) return cleanTextValue(match[1]);
  }
  return null;
}

export function createMicroSkillPrompt(userPrompt: string, imageColor?: string | null) {
  return [
    '# Role',
    '你是 MOFANG AI 的 Card Art Director + Intent-to-UI Engine，要把用户的自然语言介绍转成一张高审美、高完成度的电子名片设计 JSON。',
    '',
    '# Rules',
    '1. 精准提取姓名、职位、公司、电话、邮箱、社交信息。',
    '2. 如果用户没有明确提供姓名，name 必须输出 null，不能臆造，更不能把职位当作姓名。',
    '3. 如果用户使用昵称如“小李”“张哥”“Kevin老师”，请剥离尊称，只保留核心名字。',
    '4. 名片必须体现高级设计感，不要做成普通表单卡片。要根据职业、气质、行业推断适配的排版、材质和视觉母题。',
    '5. 设计风格允许是 tech / minimal / bold，但都必须具有高级、简洁、可落地的视觉语言。',
    `6. 如果提供了参考色，请优先围绕 ${imageColor || 'null'} 推导主色，并保证配色协调。`,
    '7. ai_insight 请写成一句自然、专业、可读的中文说明，告诉用户为什么这样设计。',
    '',
    '# Few-Shot',
    '输入: 我是做前端开发的，叫我小李就行，手机号是13900000000',
    '输出: {"personal_data":{"name":"李","title":"前端开发","company":null,"contact":{"phone":"13900000000","email":null,"social_link":null}},"design_system":{"theme_mode":"dark","primary_color":"#22d3ee","secondary_color":"#7c3aed","layout_style":"tech","background_effect":"gradient","template_name":"tech-noir","tagline":"Code in motion","motif":"neon grid","typography_tone":"precision","spacing_density":"balanced","ornament_level":"medium","composition_type":"split"},"ai_insight":"已匹配深色极客氛围与霓虹信息层次","name_confidence":0.91}',
    '输入: 帮我弄个极简风的名片，我是产品经理，邮箱是 admin@test.com',
    '输出: {"personal_data":{"name":null,"title":"产品经理","company":null,"contact":{"phone":null,"email":"admin@test.com","social_link":null}},"design_system":{"theme_mode":"light","primary_color":"#0f766e","secondary_color":"#d9e4ec","layout_style":"minimal","background_effect":"glassmorphism","template_name":"executive-minimal","tagline":"Structured clarity","motif":"soft border","typography_tone":"precision","spacing_density":"airy","ornament_level":"subtle","composition_type":"stacked"},"ai_insight":"检测到称呼有歧义，因此保留极简商务布局等待确认","name_confidence":0.42}',
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
        template_name: 'tech-noir or executive-minimal or fashion-editorial',
        tagline: '一句简短英文或中文标语，8词以内',
        motif: '视觉母题，如 neon grid / premium stripe / glass frame',
        typography_tone: 'precision or editorial or monument',
        spacing_density: 'compact or balanced or airy',
        ornament_level: 'subtle or medium or expressive',
        composition_type: 'split or stacked or asymmetrical',
      },
      ai_insight: '一句自然中文设计说明',
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

  const parsed = parseModelJson<{
    personal_data?: {
      name?: string | null;
      title?: string | null;
      company?: string | null;
      contact?: {
        phone?: string | null;
        email?: string | null;
        social_link?: string | null;
        wechat?: string | null;
        social?: string | null;
      };
    };
    design_system?: {
      theme_mode?: 'dark' | 'light';
      theme?: 'dark' | 'light';
      primary_color?: string;
      secondary_color?: string;
      layout_style?: 'minimal' | 'bold' | 'tech';
      layout?: 'minimal' | 'bold' | 'tech';
      background_effect?: 'glassmorphism' | 'solid' | 'gradient';
      background?: 'glassmorphism' | 'solid' | 'gradient';
      template_name?: 'tech-noir' | 'executive-minimal' | 'fashion-editorial';
      tagline?: string | null;
      motif?: string | null;
      typography_tone?: 'precision' | 'editorial' | 'monument';
      spacing_density?: 'compact' | 'balanced' | 'airy';
      ornament_level?: 'subtle' | 'medium' | 'expressive';
      composition_type?: 'split' | 'stacked' | 'asymmetrical';
    };
    ai_insight?: string;
    name_confidence?: number;
  }>(content);

  const fallbackName = inferName(options.prompt);
  const fallbackEmail = inferField(options.prompt, [/([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})/i]);
  const fallbackPhone = inferField(options.prompt, [/(1[3-9]\d{9})/, /(\+?\d[\d\s-]{7,}\d)/]);
  const fallbackSocial = inferField(options.prompt, [/微信[是:： ]?([A-Za-z0-9_-]+)/u, /wechat[是:： ]?([A-Za-z0-9_-]+)/iu]);
  const fallbackCompany = inferField(options.prompt, [/在(.+?)工作/u, /来自(.+?)(?:，|。|,)/u]);
  const normalizedName = normalizeName(parsed.personal_data?.name) || fallbackName;

  return {
    name: normalizedName,
    template: parsed.design_system?.template_name || (parsed.design_system?.layout_style === 'minimal' ? 'executive-minimal' : parsed.design_system?.layout_style === 'bold' ? 'fashion-editorial' : 'tech-noir'),
    title: pickFirstString(parsed.personal_data?.title) ?? null,
    company: pickFirstString(parsed.personal_data?.company, fallbackCompany) ?? null,
    phone: pickFirstString(parsed.personal_data?.contact?.phone, fallbackPhone) ?? null,
    email: pickFirstString(parsed.personal_data?.contact?.email, fallbackEmail) ?? null,
    social: pickFirstString(parsed.personal_data?.contact?.social_link, parsed.personal_data?.contact?.wechat, parsed.personal_data?.contact?.social, fallbackSocial) ?? null,
    insight: pickFirstString(parsed.ai_insight) || '已根据身份信息生成高完成度电子名片方案',
    tagline: pickFirstString(parsed.design_system?.tagline),
    motif: pickFirstString(parsed.design_system?.motif),
    typographyTone: parsed.design_system?.typography_tone || (parsed.design_system?.template_name === 'fashion-editorial' ? 'editorial' : parsed.design_system?.template_name === 'executive-minimal' ? 'precision' : 'monument'),
    spacingDensity: parsed.design_system?.spacing_density || (parsed.design_system?.template_name === 'executive-minimal' ? 'airy' : 'balanced'),
    ornamentLevel: parsed.design_system?.ornament_level || (parsed.design_system?.template_name === 'fashion-editorial' ? 'expressive' : parsed.design_system?.template_name === 'executive-minimal' ? 'subtle' : 'medium'),
    compositionType: parsed.design_system?.composition_type || (parsed.design_system?.template_name === 'fashion-editorial' ? 'asymmetrical' : parsed.design_system?.template_name === 'executive-minimal' ? 'stacked' : 'split'),
    confidence: clampConfidence(parsed.name_confidence, normalizedName ? 0.9 : 0.46),
    themeMode: parsed.design_system?.theme_mode || parsed.design_system?.theme || 'dark',
    primaryColor: normalizeHex(parsed.design_system?.primary_color, options.imageColor || '#22d3ee'),
    secondaryColor: normalizeHex(parsed.design_system?.secondary_color, '#a78bfa'),
    layout: parsed.design_system?.layout_style || parsed.design_system?.layout || 'tech',
    background: parsed.design_system?.background_effect || parsed.design_system?.background || 'gradient',
  } satisfies MicroSkillCardData;
}
