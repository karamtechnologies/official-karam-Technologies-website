// Force IPv4 connection before anything else
const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");

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
  console.log("📩 Request payload received");
  console.log(req.body);
  console.log("=================================");


  const {
    name,
    email,
    phone,
    service,
    message
  } = req.body;


  // Validation
  if (!name || !email || !message) {

    return res.status(400).json({
      success: false,
      message: "Name, email and message are required"
    });

  }


  try {


    // Gmail SMTP Configuration
    const transporter = nodemailer.createTransport({

      host: "smtp.gmail.com",

      port: 587,

      secure: false, // STARTTLS

      family: 4, // Force IPv4 ⭐


      auth: {

        user: process.env.EMAIL_USER,

        pass: process.env.EMAIL_PASS

      },


      tls: {

        rejectUnauthorized: false

      },


      connectionTimeout: 30000,

      greetingTimeout: 15000,

      socketTimeout: 15000

    });



    // Send Email
    const info = await transporter.sendMail({

      from: process.env.EMAIL_USER,


      replyTo: email,


      to: "supportkaram@gmail.com",


      subject: `New Contact Form Submission - ${name}`,


      text: `

Name    : ${name}

Email   : ${email}

Phone   : ${phone || "Not Provided"}

Service : ${service || "Not Provided"}


Message :

${message}

      `

    });



    console.log("✅ Email Sent Successfully");

    console.log("Message ID:", info.messageId);



    return res.status(200).json({

      success: true,

      message: "Email sent successfully"

    });



  } catch (error) {


    console.error("❌ SMTP ERROR:");

    console.error(error);


    return res.status(500).json({

      success:false,

      message:error.message

    });


  }

});



// Health Check
app.get("/", (req,res)=>{

  res.send("Node Mail Server Running Successfully");

});



// Server Start
const PORT = process.env.PORT || 5000;


app.listen(PORT, ()=>{

  console.log(`🚀 Server running on port ${PORT}`);

});