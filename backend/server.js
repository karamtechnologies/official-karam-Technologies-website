const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();

// Global Middleware Configs
app.use(cors());
app.use(express.json());

// Contact Form SMTP Endpoint Route Mapping
app.post("/send-email", async (req, res) => {
  console.log("=================================");
  console.log("📩 Request payload packet received");
  console.log(req.body);
  console.log("=================================");

  const { name, email, phone, service, message } = req.body;

  // Defensive Server Validation Guard
  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: "Required content-data fields are completely missing (name, email, message)."
    });
  }

  try {
    const transporter = nodemailer.createTransport({
host: "smtp.gmail.com",
      port: 587,
      secure: false, // TLS standard connection configuration 
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Needs 16-Character Google App Password
      },
      // Timeout rules to avoid hanging Render system instances
      connectionTimeout: 15000,
      greetingTimeout: 15000,
      socketTimeout: 15000,
    });

    // Single unified, non-blocking asynchronous verification execution
    await transporter.verify();
    console.log("✅ Gmail SMTP Channel Verified & Ready");

    // Mail Payload Envelope Configuration Setup
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      replyTo: email,
      to: "supportkaram@gmail.com",
      subject: `New Contact Form Submission - ${name}`,
      text: `
Name    : ${name}
Email   : ${email}
Phone   : ${phone || 'Not Provided'}
Service : ${service || 'Not Provided'}

Message :
${message}
            `,
    });

    console.log("✅ Email Relayed Successfully");
    console.log("Message ID Token:", info.messageId);

    return res.status(200).json({
      success: true,
      message: "Email sent successfully",
    });

  } catch (error) {
    console.error("❌ INTERNAL CRITICAL SMTP SERVER ERROR:");
    console.error(error.message);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// App Health Check Probe Endpoint Route
app.get("/", (req, res) => {
  res.send("Node Mail Server Running Successfully");
});

// Listen Handler Init
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Karam Backend System Live on port: ${PORT}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Terminal Port ${PORT} is occupied by another local service script process!`);
  } else {
    console.error("Server execution crash trace:", err);
  }
});
