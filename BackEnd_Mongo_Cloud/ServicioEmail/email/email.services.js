import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

export const sendEmail = async ({ to, subject, html }) => {
  try {
    console.log("📨 Enviando email a:", to)
    await transporter.sendMail({
      from: `"Star Accesorios" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    })
    console.log("✅ Email enviado a:", to)
  } catch (error) {
    console.error("❌ ERROR EMAIL:", error)
  }
}