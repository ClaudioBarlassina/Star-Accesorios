export const sendEmail = async ({ to, subject, html }) => {
  try {
    console.log("📨 Enviando email a:", to)
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": process.env.BREVO_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sender: { email: process.env.EMAIL_USER, name: "Star Accesorios" },
        to: [{ email: to }],
        subject,
        htmlContent: html,
      }),
    })
    if (!res.ok) {
      const err = await res.text()
      console.error("❌ Error Brevo:", err)
      return
    }
    console.log("✅ Email enviado a:", to)
  } catch (error) {
    console.error("❌ ERROR EMAIL:", error.message)
  }
}