import env from '../config/env.js';

export async function sendResetEmail({ email, rawToken, name }) {
  const resetLink = `${env.RESET_LINK_BASE}?token=${rawToken}`;

  console.log(`[DEV] Password reset link for ${email}: ${resetLink}`);

  if (!env.SMTP_HOST) {
    console.warn('SMTP not configured. Skipping email send.');
    return;
  }

  try {
    const nodemailer = await import('nodemailer');
    const transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_PORT === 465,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Via-Trip" <${env.SMTP_USER}>`,
      to: email,
      subject: 'Reset Your Via-Trip Password',
      text: `Hi ${name},\n\nYou requested a password reset. Click the link below:\n${resetLink}\n\nThis link expires in 30 minutes.\n\nIf you did not request this, please ignore this email.`,
      html: `<p>Hi ${name},</p><p>You requested a password reset. Click the link below:</p><p><a href="${resetLink}">${resetLink}</a></p><p>This link expires in 30 minutes.</p><p>If you did not request this, please ignore this email.</p>`,
    });
  } catch (err) {
    console.error('Failed to send password reset email:', err.message);
  }
}
