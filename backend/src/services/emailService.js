const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

// Send welcome email
const sendWelcomeEmail = async (email, name) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: '🎉 Welcome to StockMaster IMS!',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.3); }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; color: white; }
            .header h1 { margin: 0; font-size: 28px; font-weight: 700; }
            .content { padding: 40px 30px; }
            .content h2 { color: #333; font-size: 24px; margin-bottom: 20px; }
            .content p { color: #666; line-height: 1.6; font-size: 16px; }
            .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; margin-top: 20px; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #999; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📦 StockMaster IMS</h1>
            </div>
            <div class="content">
              <h2>Welcome aboard, ${name}! 👋</h2>
              <p>Thank you for joining StockMaster IMS. Your account has been successfully created!</p>
              <p>You can now access our powerful inventory management system to streamline your operations.</p>
              <a href="${process.env.FRONTEND_URL}/login" class="button">Get Started</a>
            </div>
            <div class="footer">
              <p>© 2024 StockMaster IMS. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Welcome email sent to ${email}`);
  } catch (error) {
    console.error(`❌ Error sending welcome email: ${error.message}`);
    throw error;
  }
};

// Send OTP email
const sendOTPEmail = async (email, otp) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: '🔐 Password Reset OTP - StockMaster IMS',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.3); }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; color: white; }
            .header h1 { margin: 0; font-size: 28px; font-weight: 700; }
            .content { padding: 40px 30px; text-align: center; }
            .content h2 { color: #333; font-size: 24px; margin-bottom: 20px; }
            .content p { color: #666; line-height: 1.6; font-size: 16px; }
            .otp-box { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; font-size: 36px; font-weight: 700; padding: 20px; border-radius: 12px; letter-spacing: 8px; margin: 30px 0; display: inline-block; }
            .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; text-align: left; border-radius: 8px; }
            .warning p { color: #856404; margin: 0; font-size: 14px; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #999; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 Password Reset</h1>
            </div>
            <div class="content">
              <h2>Your OTP Code</h2>
              <p>Use the following OTP to reset your password:</p>
              <div class="otp-box">${otp}</div>
              <div class="warning">
                <p><strong>⚠️ Important:</strong> This OTP will expire in 10 minutes. If you didn't request this, please ignore this email.</p>
              </div>
            </div>
            <div class="footer">
              <p>© 2024 StockMaster IMS. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ OTP email sent to ${email}`);
  } catch (error) {
    console.error(`❌ Error sending OTP email: ${error.message}`);
    throw error;
  }
};

// Send password reset confirmation email
const sendPasswordResetConfirmation = async (email, name) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: '✅ Password Reset Successful - StockMaster IMS',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.3); }
            .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 20px; text-align: center; color: white; }
            .header h1 { margin: 0; font-size: 28px; font-weight: 700; }
            .content { padding: 40px 30px; }
            .content h2 { color: #333; font-size: 24px; margin-bottom: 20px; }
            .content p { color: #666; line-height: 1.6; font-size: 16px; }
            .success-icon { font-size: 64px; margin: 20px 0; }
            .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; margin-top: 20px; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #999; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ Password Reset Successful</h1>
            </div>
            <div class="content">
              <div class="success-icon">🎉</div>
              <h2>Hi ${name},</h2>
              <p>Your password has been successfully reset!</p>
              <p>You can now log in to your account using your new password.</p>
              <a href="${process.env.FRONTEND_URL}/login" class="button">Login Now</a>
            </div>
            <div class="footer">
              <p>© 2024 StockMaster IMS. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Password reset confirmation sent to ${email}`);
  } catch (error) {
    console.error(`❌ Error sending confirmation email: ${error.message}`);
    throw error;
  }
};

module.exports = {
  sendWelcomeEmail,
  sendOTPEmail,
  sendPasswordResetConfirmation
};
