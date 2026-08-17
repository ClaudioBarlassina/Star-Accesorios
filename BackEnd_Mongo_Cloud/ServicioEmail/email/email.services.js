import { Resend } from "resend"

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null

if (!resend) {
  console.warn("⚠️ RESEND_API_KEY no configurada — los emails no se enviarán")
}

export const sendEmail = async ({ to, subject, html }) => {

  try {

    if (!resend) {
      console.log("📭 Email omitido (sin RESEND_API_KEY):", to)
      return
    }

    console.log("📨 Enviando email a:", to)

    const { error } = await resend.emails.send({
      from: "Star Accesorios <onboarding@resend.dev>",
      to,
      subject,
      html,
    })

    if (error) {
      console.error("❌ Error Resend:", error)
      return
    }

    console.log("✅ Email enviado a:", to)

  } catch (error) {

    console.error("❌ ERROR EMAIL:", error.message)

  }

}