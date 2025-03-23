const enviarEmail = async (pedido) => {
  const API_KEY = "key_star";

  const emailData = {
    from: "e40CelularMotorola2023@hotmail.com", // 📌 Requiere un email verificado en Resend
    to: pedido.cliente.email,
    subject: "Resumen de tu Pedido",
    text: `
      Hola ${pedido.cliente.nombre}, gracias por tu compra!
      📍 Dirección: ${pedido.cliente.direccion}
      📞 Teléfono: ${pedido.cliente.telefono}
      🏙 Ciudad: ${pedido.cliente.ciudad}
      💳 Método de Pago: ${pedido.cliente.metodoPago}
      🛒 Productos:
      ${pedido.productos.map(p => `🔹 ${p.nombre} x${p.cantidad} → $${p.total}`).join("\n")}
      💰 Total: $${pedido.total}
    `,
  };

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailData),
    });

    if (!response.ok) throw new Error("Error al enviar el email");

    alert("Correo enviado con éxito 🎉");
  } catch (error) {
    console.error("Error al enviar el email:", error);
    alert("Error al enviar el correo ❌");
  }
};
 export default enviarEmail;