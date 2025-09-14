// backend/utils/email.js
const nodemailer = require('nodemailer');

// Create transporter with better error handling
let transporter;
try {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
} catch (error) {
  console.error('Failed to create email transporter:', error);
  transporter = null;
}

async function sendOtpEmail(to, otp, userName) {
  // Validate recipient email - more lenient for development
  if (!to || typeof to !== 'string') {
    console.error('Invalid recipient email address:', to);
    throw new Error('Invalid recipient email address');
  }

  const recipient = to.trim();
  if (recipient.length === 0) {
    console.error('Empty recipient email address');
    throw new Error('Empty recipient email address');
  }

  // If no SMTP configured, log the OTP instead
  if (!transporter) {
    console.log('SMTP not configured. OTP would be:', otp);
    throw new Error('Email service not configured');
  }

  const mailOptions = {
    from: process.env.EMAIL_FROM || 'noreply@anomalyguard.ai',
    to: recipient,
    subject: 'Your Login OTP — valid for 30 minutes',
    text: `Hello ${userName || ''},

We detected a login attempt to your account that needs additional verification.

Your one-time code (valid for ${process.env.OTP_EXPIRES_MINUTES || 30} minutes): ${otp}

If you did not request this, please contact support immediately.
`,
    html: `<p>Hello ${userName || ''},</p>
<p>We detected a login attempt to your account that needs additional verification.</p>
<p><strong>Your one-time code (valid for ${process.env.OTP_EXPIRES_MINUTES || 30} minutes): ${otp}</strong></p>
<p>If you did not request this, please contact support immediately.</p>`
  };

  try {
    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully to:', recipient);
    return result;
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
}

module.exports = { sendOtpEmail };