import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});


// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to email server:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});


// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Your Name" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

async function sendOtp(userEmail, name, otp) {
  
 
  const subject = 'Your OTP Code';
  const text = `Hello ${name}, /n/n Your OTP code is ${otp}. It will expire in 10 minutes. Please do not share this code with anyone./n/nBest regards,/nThe Bank-server team`;
  const html = `<p>Hello ${name},</p><p>Your OTP code is <strong>${otp}</strong>. It will expire in 10 minutes. Please do not share this code with anyone!<p>Best reagards, <br>The Bank-Server Team</p>`;
  await sendEmail(userEmail, subject, text, html);
  
}

async function sendRegistrationEmail(userEmail, name) {
  
  const subject = 'Welcome to Back-Server!';
  const text = `Hello ${name}, /n/n Thank you for register at Bank-server. We're excited to have you on board!/n/nBest regards,/nThe Bank-server team`;
  const html = `<p>Hello ${name},</p><p>Thank you for register at Back-server. We're excited to have you on board!<p>Best reagards, <br>The Bank-Server Team</p>`;
  
  
  await sendEmail(userEmail, subject, text, html);
}

export default { sendRegistrationEmail , sendOtp};