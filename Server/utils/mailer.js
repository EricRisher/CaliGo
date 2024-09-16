// utils/mailer.js
const nodemailer = require("nodemailer");

// Configure your mail transporter (e.g., using Gmail or SMTP)
const transporter = nodemailer.createTransport({
  service: "Gmail", // or use SMTP settings
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASSWORD, // Your email password
  },
});

// Define a function to send an email
async function sendPasswordResetEmail(to, resetUrl) {
  const mailOptions = {
    from: process.env.EMAIL_USER, // Sender address (can be from environment variables)
    to, // Receiver's email
    subject: "Password Reset Request",
    text: `You requested a password reset. Please click this link to reset your password: ${resetUrl}`,
    html: `<p>You requested a password reset. Please click this <a href="${resetUrl}">link</a> to reset your password.</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Password reset email sent to: ", to);
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw new Error("Failed to send email");
  }
}

module.exports = { sendPasswordResetEmail };
