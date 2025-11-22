const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

// Common email styles
const getEmailTemplate = (content) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>StockMaster IMS</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f7; line-height: 1.6;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f5f5f7;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
          
          <!-- Header -->
          <tr>
            <td style="padding: 48px 48px 32px; text-align: center; border-bottom: 1px solid #e8e8ed;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 600; color: #1d1d1f; letter-spacing: -0.5px;">
                StockMaster IMS
              </h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 48px;">
              ${content}
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 32px 48px; text-align: center; border-top: 1px solid #e8e8ed; background-color: #fafafa;">
              <p style="margin: 0; font-size: 13px; color: #86868b; line-height: 1.5;">
                © ${new Date().getFullYear()} StockMaster IMS. All rights reserved.
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

// Send welcome email
const sendWelcomeEmail = async (email, name) => {
  const transporter = createTransporter();
  
  const content = `
    <h2 style="margin: 0 0 16px; font-size: 28px; font-weight: 600; color: #1d1d1f; letter-spacing: -0.5px;">
      Welcome, ${name}
    </h2>
    
    <p style="margin: 0 0 24px; font-size: 16px; color: #424245; line-height: 1.6;">
      Your account has been successfully created. You now have access to our inventory management system.
    </p>
    
    <table role="presentation" style="margin: 32px 0;">
      <tr>
        <td style="border-radius: 8px; background-color: #007aff;">
          <a href="${process.env.FRONTEND_URL || 'https://stockmaster.com'}/login" 
             style="display: inline-block; padding: 14px 32px; font-size: 15px; font-weight: 500; color: #ffffff; text-decoration: none; letter-spacing: 0.2px;">
            Get Started
          </a>
        </td>
      </tr>
    </table>
    
    <p style="margin: 32px 0 0; font-size: 14px; color: #86868b; line-height: 1.5;">
      If you have any questions, feel free to reach out to our support team.
    </p>
  `;
  
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Welcome to StockMaster IMS',
    html: getEmailTemplate(content),
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
  
  const content = `
    <h2 style="margin: 0 0 16px; font-size: 28px; font-weight: 600; color: #1d1d1f; letter-spacing: -0.5px;">
      Password Reset
    </h2>
    
    <p style="margin: 0 0 32px; font-size: 16px; color: #424245; line-height: 1.6;">
      Use the verification code below to reset your password:
    </p>
    
    <table role="presentation" style="width: 100%; margin: 0 0 32px;">
      <tr>
        <td align="center">
          <div style="display: inline-block; padding: 24px 48px; background-color: #f5f5f7; border-radius: 12px; border: 2px solid #e8e8ed;">
            <span style="font-size: 36px; font-weight: 600; color: #1d1d1f; letter-spacing: 8px; font-family: 'Courier New', monospace;">
              ${otp}
            </span>
          </div>
        </td>
      </tr>
    </table>
    
    <p style="margin: 0 0 8px; font-size: 14px; color: #86868b; line-height: 1.5;">
      This code will expire in 10 minutes.
    </p>
    
    <p style="margin: 0; font-size: 14px; color: #86868b; line-height: 1.5;">
      If you didn't request this code, please ignore this email.
    </p>
  `;
  
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Password Reset Code',
    html: getEmailTemplate(content),
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
  
  const content = `
    <h2 style="margin: 0 0 16px; font-size: 28px; font-weight: 600; color: #1d1d1f; letter-spacing: -0.5px;">
      Password Updated
    </h2>
    
    <p style="margin: 0 0 24px; font-size: 16px; color: #424245; line-height: 1.6;">
      Hi ${name}, your password has been successfully reset. You can now log in with your new password.
    </p>
    
    <table role="presentation" style="margin: 32px 0;">
      <tr>
        <td style="border-radius: 8px; background-color: #007aff;">
          <a href="${process.env.FRONTEND_URL || 'https://stockmaster.com'}/login" 
             style="display: inline-block; padding: 14px 32px; font-size: 15px; font-weight: 500; color: #ffffff; text-decoration: none; letter-spacing: 0.2px;">
            Log In
          </a>
        </td>
      </tr>
    </table>
    
    <p style="margin: 32px 0 0; font-size: 14px; color: #86868b; line-height: 1.5;">
      If you didn't make this change, please contact our support team immediately.
    </p>
  `;
  
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Password Reset Successful',
    html: getEmailTemplate(content),
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
  sendPasswordResetConfirmation,
};