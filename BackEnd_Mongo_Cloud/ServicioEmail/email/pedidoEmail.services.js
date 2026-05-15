import { sendEmail } from "./email.services.js"
import { clienteTemplate} from "./template/cliente.template.js"
import { adminTemplate } from "./template/admin.template.js"

export const enviarPedidoEmails = async (pedido) => {

  console.log("📦 Pedido recibido:")
  console.log(pedido)

  console.log("📩 Email cliente:")
  console.log(pedido.cliente.email)

  console.log("🔔 Email admin:")
  console.log(process.env.ADMIN_EMAIL)

  // Cliente
  await sendEmail({
    to: pedido.cliente.email,
    subject: "Confirmación de compra",
    html: clienteTemplate(pedido)
  })

  // Admin
  await sendEmail({
    to: process.env.ADMIN_EMAIL,
    subject: "Nuevo pedido recibido",
    html: adminTemplate(pedido)
  })
}