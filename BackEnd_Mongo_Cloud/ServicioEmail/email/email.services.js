import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

export const sendEmail = async ({
  to,
  subject,
  html
}) => {

  try {

    console.log("📨 Enviando email a:");

    console.log(to);

    const info =
    await transporter.sendMail({
      from: `"Star Accesorios" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    });

    console.log("✅ Email enviado");

    console.log(info.response);

  } catch (error) {

    console.log("❌ ERROR EMAIL");

    console.log(error);
  }
}