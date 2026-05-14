
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export const sendEmail = async ({
  to,
  subject,
  html
}) => {

  try {

    console.log("📨 Enviando email a:", to);

    const { error } = await resend.emails.send({
      from: "Star Accesorios <onboarding@resend.dev>",
      to,
      subject,
      html
    });

    if (error) {
      console.error("❌ Error Resend:", error);
      return;
    }

    console.log("✅ Email enviado a:", to);

  } catch (error) {

    console.error("❌ ERROR EMAIL:", error);
  }
}