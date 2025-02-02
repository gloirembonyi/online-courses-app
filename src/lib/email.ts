import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(email: string, token: string) {
  try {
    await resend.emails.send({
      from: 'Course Platform <noreply@courseplatform.com>',
      to: email,
      subject: 'Your verification code',
      html: `
        <h1>Verification Code</h1>
        <p>Your verification code is: <strong>${token}</strong></p>
        <p>This code will expire in 10 minutes.</p>
        <p>If you didn't request this code, please ignore this email.</p>
      `,
    });
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw new Error('Failed to send verification email');
  }
} 