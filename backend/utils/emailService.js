const nodemailer = require('nodemailer');
require('dotenv').config();

// Create email transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
    auth: {
      // user: process.env.EMAIL_USER
      user: 'yugam1102@gmail.com',
      // pass: process.env.EMAIL_PASS || 'bzrx zqvg zydh guhp',
      pass: 'bzrx zqvg zydh guhp',
    },
  });
};

// Verify email configuration
const verifyEmailConfig = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log('✅ Email service is ready to send emails');
    return true;
  } catch (error) {
    console.error('❌ Email service configuration error:', error.message);
    return false;
  }
};

// Send welcome email
const sendWelcomeEmail = async (userEmail, userName) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: userEmail,
      subject: 'Welcome to Zestio! 🍕',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #ff6b6b, #ff8e53); padding: 30px; border-radius: 10px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 32px;">Welcome to Zestio!</h1>
            <p style="margin: 10px 0; font-size: 18px;">Your food delivery adventure begins here 🚀</p>
          </div>
          
          <div style="padding: 30px 0;">
            <h2 style="color: #333; margin-bottom: 20px;">Hi ${userName},</h2>
            <p style="color: #666; line-height: 1.6;">Thank you for joining Zestio! We're excited to help you discover amazing food from the best restaurants in your area.</p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">What's next?</h3>
              <ul style="color: #666; line-height: 1.8;">
                <li>🍔 Browse restaurants and order your favorite food</li>
                <li>🚚 Track your orders in real-time</li>
                <li>⭐ Rate and review your experiences</li>
                <li>🎉 Enjoy exclusive deals and offers</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL}" style="background: linear-gradient(135deg, #ff6b6b, #ff8e53); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
                Start Ordering Now
              </a>
            </div>
            
            <p style="color: #999; font-size: 14px; text-align: center; margin-top: 30px;">
              If you have any questions, feel free to contact our support team.<br>
              Best regards,<br>
              The Zestio Team
            </p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Welcome email sent to ${userEmail}`);
    return true;
  } catch (error) {
    console.error('❌ Error sending welcome email:', error.message);
    return false;
  }
};

// Send order confirmation email
const sendOrderConfirmationEmail = async (userEmail, orderDetails) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: userEmail,
      subject: `Order Confirmation #${orderDetails.orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #ff6b6b, #ff8e53); padding: 30px; border-radius: 10px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 32px;">Order Confirmed! 🎉</h1>
            <p style="margin: 10px 0; font-size: 18px;">Your order has been received and is being prepared</p>
          </div>
          
          <div style="padding: 30px 0;">
            <h2 style="color: #333; margin-bottom: 20px;">Order Details</h2>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 5px 0;"><strong>Order ID:</strong> ${orderDetails.orderId}</p>
              <p style="margin: 5px 0;"><strong>Restaurant:</strong> ${orderDetails.restaurantName}</p>
              <p style="margin: 5px 0;"><strong>Total Amount:</strong> ₹${orderDetails.totalAmount}</p>
              <p style="margin: 5px 0;"><strong>Estimated Delivery:</strong> ${orderDetails.estimatedDelivery}</p>
            </div>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">Order Items</h3>
              ${orderDetails.items.map(item => `
                <p style="margin: 5px 0; color: #666;">${item.quantity}x ${item.name} - ₹${item.price}</p>
              `).join('')}
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL}/track-order/${orderDetails.orderId}" style="background: linear-gradient(135deg, #ff6b6b, #ff8e53); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
                Track Your Order
              </a>
            </div>
            
            <p style="color: #999; font-size: 14px; text-align: center; margin-top: 30px;">
              Thank you for ordering with Zestio!<br>
              Best regards,<br>
              The Zestio Team
            </p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Order confirmation email sent to ${userEmail}`);
    return true;
  } catch (error) {
    console.error('❌ Error sending order confirmation email:', error.message);
    return false;
  }
};

// Send password reset email
const sendPasswordResetEmail = async (userEmail, resetToken) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: userEmail,
      subject: 'Password Reset Request - Zestio',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #ff6b6b, #ff8e53); padding: 30px; border-radius: 10px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 32px;">Password Reset</h1>
            <p style="margin: 10px 0; font-size: 18px;">Reset your Zestio account password</p>
          </div>
          
          <div style="padding: 30px 0;">
            <h2 style="color: #333; margin-bottom: 20px;">Reset Your Password</h2>
            <p style="color: #666; line-height: 1.6;">We received a request to reset your password. Click the button below to reset it:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL}/reset-password?token=${resetToken}" style="background: linear-gradient(135deg, #ff6b6b, #ff8e53); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
                Reset Password
              </a>
            </div>
            
            <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
              <p style="margin: 0; color: #856404;">
                <strong>Security Note:</strong> This link will expire in 1 hour. If you didn't request this password reset, please ignore this email.
              </p>
            </div>
            
            <p style="color: #999; font-size: 14px; text-align: center; margin-top: 30px;">
              If you have any issues, contact our support team.<br>
              Best regards,<br>
              The Zestio Team
            </p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Password reset email sent to ${userEmail}`);
    return true;
  } catch (error) {
    console.error('❌ Error sending password reset email:', error.message);
    return false;
  }
};

// Send support ticket confirmation
const sendSupportTicketEmail = async (userEmail, ticketDetails) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: userEmail,
      subject: `Support Ticket #${ticketDetails.ticketId} - We've received your message`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #ff6b6b, #ff8e53); padding: 30px; border-radius: 10px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 32px;">Support Ticket Received</h1>
            <p style="margin: 10px 0; font-size: 18px;">We'll get back to you soon! 🎯</p>
          </div>
          
          <div style="padding: 30px 0;">
            <h2 style="color: #333; margin-bottom: 20px;">Ticket Details</h2>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 5px 0;"><strong>Ticket ID:</strong> ${ticketDetails.ticketId}</p>
              <p style="margin: 5px 0;"><strong>Issue Type:</strong> ${ticketDetails.issueType}</p>
              <p style="margin: 5px 0;"><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
            </div>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">Your Message</h3>
              <p style="color: #666; line-height: 1.6;">${ticketDetails.message}</p>
            </div>
            
            <div style="background: #d4edda; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
              <p style="margin: 0; color: #155724;">
                <strong>What happens next?</strong><br>
                Our support team will review your ticket and respond within 24 hours. We'll send updates to your email address.
              </p>
            </div>
            
            <p style="color: #999; font-size: 14px; text-align: center; margin-top: 30px;">
              Thank you for contacting Zestio Support!<br>
              Best regards,<br>
              The Zestio Team
            </p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Support ticket email sent to ${userEmail}`);
    return true;
  } catch (error) {
    console.error('❌ Error sending support ticket email:', error.message);
    return false;
  }
};

module.exports = {
  createTransporter,
  verifyEmailConfig,
  sendWelcomeEmail,
  sendOrderConfirmationEmail,
  sendPasswordResetEmail,
  sendSupportTicketEmail,
};
