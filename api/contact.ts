import nodemailer from 'nodemailer';

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

export default async function handler(request: any, response: any) {
  if (request.method !== 'POST') {
    response.status(405).json({ ok: false, message: 'Method not allowed.' });
    return;
  }

  const { name, company, email, message } = request.body || {};
  if (!name || !email || !message) {
    response.status(400).json({ ok: false, message: 'Name, email, and message are required.' });
    return;
  }

  const transporter = createTransporter();
  const recipient = process.env.CONTACT_RECEIVER_EMAIL;

  if (!transporter || !recipient) {
    response.status(200).json({
      ok: true,
      message: 'Lead received. SMTP not configured, so this submission was accepted without email delivery.',
    });
    return;
  }

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: recipient,
      subject: `New MOFANG AI lead from ${name}`,
      text: `Name: ${name}\nCompany: ${company || '-'}\nEmail: ${email}\n\nMessage:\n${message}`,
    });
    response.status(200).json({ ok: true });
  } catch (error) {
    response.status(500).json({
      ok: false,
      message: error instanceof Error ? error.message : 'Email delivery failed.',
    });
  }
}
