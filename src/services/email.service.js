const nodeMailer = require("nodemailer");
require("dotenv").config();

const transporter = nodeMailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.log("EMAIL_USER:", process.env.EMAIL_USER);
    console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "Loaded" : "Missing");
    console.debug("Error Connecting to gmail services: " + error);
  } else {
    console.debug("Email services is ready to send message");
  }
});

async function sendEmail(to, subject, text, html) {
  try {
    const info = await transporter.sendMail({
      from: `"Ai Career Assistance Backend" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodeMailer.getTestMessageUrl(info));
  } catch (error) {
    console.error("error sending email: ", error);
  }
}

async function sendRegistrationEmail(userEmail, userName) {
  const subject = " Welcome to AI Career Assistant";
  const text = ` Hi ${userName}, \n\t\t Thank you for registering with Ai Career Assistance Backend, We are Excited to have you on board! `;
  const html = `<p>Hi ${userName},</p><p>Thank you for registering with Ai Career Assistance Backend, We are Excited to have you on board!</p>`;
  await sendEmail(userEmail, subject, text, html);
}

async function sendLoginRegistrationEmail(userEmail, userName) {
  const subject = " Welcome Back to AI Career Assistant";
  const text = ` Hi ${userName}, \n\t\t You Have Successfully login with Ai Career Assistance Backend, We are Excited to have you on board! `;
  const html = `<p>Hi ${userName},</p><p>You Have Successfully  login with Ai Career Assistance Backend, We are Excited to have you on board!</p>`;
  await sendEmail(userEmail, subject, text, html);
}

module.exports = {
  sendRegistrationEmail,
  sendLoginRegistrationEmail
};
