import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(email: string, token: string) {
  try {
    console.log(`Sending verification email to ${email}`);
    const result = await resend.emails.send({
      from: 'Course Platform <onboarding@resend.dev>',
      to: email,
      subject: 'Your verification code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2563eb; margin-bottom: 24px;">Verification Code</h1>
          <p style="font-size: 16px; line-height: 24px;">Your verification code is:</p>
          <div style="background-color: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <p style="font-size: 24px; font-weight: bold; text-align: center; margin: 0; letter-spacing: 4px;">${token}</p>
          </div>
          <p style="font-size: 14px; color: #6b7280;">This code will expire in 10 minutes.</p>
          <p style="font-size: 14px; color: #6b7280;">If you didn't request this code, please ignore this email.</p>
        </div>
      `,
    });

    if (result.error) {
      console.error('Error sending verification email:', result.error);
      throw new Error(result.error.message || 'Failed to send verification email');
    }

    console.log('Verification email sent successfully:', result);
    return result;
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw error;
  }
} 