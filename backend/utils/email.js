// backend/utils/email.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 465),
  secure: (process.env.SMTP_SECURE === 'true'), // true for 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

async function sendOtpEmail(to, otp, userName) {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to,
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

  return transporter.sendMail(mailOptions);
}

module.exports = { sendOtpEmail };
