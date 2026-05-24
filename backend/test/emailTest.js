const { verifyEmailConfig, sendWelcomeEmail } = require('../utils/emailService');

// Test email configuration
const testEmailConfig = async () => {
  console.log('🔧 Testing email configuration...');
  
  const isValid = await verifyEmailConfig();
  
  if (isValid) {
    console.log('✅ Email configuration is valid!');
    
    // Test sending a welcome email
    console.log('📧 Sending test welcome email...');
    const testEmail = await sendWelcomeEmail(
      'divyam224488@gmail.com', // Replace with your test email
      'Divyam Kakkar'
    );
    
    if (testEmail) {
      console.log('✅ Test email sent successfully!');
    } else {
      console.log('❌ Failed to send test email');
    }
  } else {
    console.log('❌ Email configuration is invalid. Please check your .env file.');
    console.log('\n📋 Required email configuration:');
    console.log('EMAIL_HOST=smtp.gmail.com');
    console.log('EMAIL_PORT=587');
    console.log('EMAIL_SECURE=false');
    console.log('EMAIL_USER=your-email@gmail.com');
    console.log('EMAIL_PASS=your-app-password');
    console.log('EMAIL_FROM=noreply@zestio.com');
  }
};

// Run the test
testEmailConfig().catch(console.error);
