const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");

const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());


app.post("/send-email", async (req, res) => {

  const { name, email, phone, service, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: "Required fields missing"
    });
  }


  try {

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });


    await transporter.verify();

    const info = await transporter.sendMail({

      from: process.env.EMAIL_USER,
      to: "supportkaram@gmail.com",
      replyTo: email,

      subject: `New Contact Form - ${name}`,

      text: `
Name: ${name}
Email: ${email}
Phone: ${phone}
Service: ${service}

Message:
${message}
`
    });


    console.log("✅ Email Sent:", info.messageId);


    res.json({
      success:true,
      message:"Email sent successfully"
    });


  } catch(error){

    console.log("❌ SMTP ERROR");
    console.log(error);

    res.status(500).json({
      success:false,
      message:error.message
    });

  }

});


app.get("/",(req,res)=>{
 res.send("Server running");
});


const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{
 console.log(`Server running on ${PORT}`);
});