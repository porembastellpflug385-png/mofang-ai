export type ShareableCardData = {
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

function toBase64Url(value: string) {
  return btoa(unescape(encodeURIComponent(value)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

function fromBase64Url(value: string) {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized + '==='.slice((normalized.length + 3) % 4);
  return decodeURIComponent(escape(atob(padded)));
}

export function createCardSharePayload(card: ShareableCardData) {
  return toBase64Url(JSON.stringify(card));
}

export function parseCardSharePayload(payload: string) {
  return JSON.parse(fromBase64Url(payload)) as ShareableCardData;
}

export function createCardShareUrl(card: ShareableCardData) {
  const payload = createCardSharePayload(card);
  return `${window.location.origin}/#/card/${payload}`;
}
