import { sendEmail } from "./email.services.js";
import { clienteTemplate } from "../email/template/cliente.template.js";
import { adminTemplate } from "../email/template/admin.template.js";

export const enviarPedidoEmails = async (pedido) => {
  await sendEmail({
    to: pedido.cliente.email,
    subject: "Confirmación de compra - Star Accesorios",
    html: clienteTemplate(pedido)
  })

  await sendEmail({
    to: process.env.EMAIL_USER,
    subject: "Nuevo pedido recibido - Star Accesorios",
    html: adminTemplate(pedido)
  })
}