<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# MOFANG AI

## Local development

1. Run `npm install`
2. Copy `.env.example` to `.env.local` or your deploy environment
3. Start the app with `npm run dev`

This starts:
- `vite` on `http://localhost:3000`
- the Express backend on `http://localhost:3001`

## Vercel deployment

This project now includes serverless handlers for:
- `/api/contact`
- `/api/chat`

They are configured in [vercel.json](/Users/kevin/Documents/code/mofang-ai/vercel.json).

Set these environment variables in Vercel:
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_SECURE`
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_FROM`
- `CONTACT_RECEIVER_EMAIL`
- `GEMINI_API_KEY` (optional)

## Admin access

Admin login is restricted to:
- username: `kevin`
- password: `Nowwhat7`

## Notes

- If SMTP is not configured, contact submissions will still return success on the serverless endpoint, but no email will be sent.
- Image analysis in the admin console uses `GEMINI_API_KEY` when available.
