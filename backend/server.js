const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Contact Form API
app.post("/send-email", async (req, res) => {
  console.log("=================================");
  console.log("📩 Request received");
  console.log(req.body);
  console.log("=================================");

  const { name, email, phone, service, message } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",

      port: 587,

      secure: false,

      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Verify SMTP Connection
    await transporter.verify();

    console.log("✅ Gmail SMTP Connected");

    // Send Mail
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,

      replyTo: email,

      to: "supportkaram@gmail.com",

      subject: `New Contact Form Submission - ${name}`,

      text: `
Name    : ${name}

Email   : ${email}

Phone   : ${phone}

Service : ${service}

Message :
${message}
            `,
    });

    console.log("✅ Email Sent");
    console.log("Message ID:", info.messageId);

    res.status(200).json({
      success: true,

      message: "Email sent successfully",
    });
  } catch (error) {
    console.error("❌ SMTP ERROR");
    console.error(error);
    console.error("Message:", error.message);

    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
});

// Test Route
app.get("/", (req, res) => {
  res.send("Node Mail Server Running");
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀Karam Backend Running on port: ${PORT}`);
});
