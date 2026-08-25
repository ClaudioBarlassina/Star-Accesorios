import { jsPDF } from "jspdf"

const ANCHO = 80
const MARGEN = 4
const LINEA = 5

const formatMoney = (n) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
  }).format(Number(n) || 0)

const formatPago = (pago) => {
  const mapa = { efectivo: "Efectivo", transferencia: "Transferencia" }
  return mapa[pago] || pago || "—"
}

function dibujar(doc, pedido, { montoRecibido, vuelto, titulo } = {}) {
  const numVenta = pedido._id ? String(pedido._id).slice(-8) : ""
  const fecha = new Date(pedido.fecha || Date.now())
  const fechaTexto = fecha.toLocaleString("es-AR", { dateStyle: "short", timeStyle: "short" })

  const clienteNombre = String(pedido.cliente?.nombre || "").trim()

  const items = (pedido.productos || []).map((p) => ({
    nombre: String(p.nombre || "Producto") + (p.variante ? ` (${p.variante})` : ""),
    cantidad: Number(p.cantidad) || 1,
    subtotal: (Number(p.precio) || 0) * (Number(p.cantidad) || 1),
  }))

  const total = items.reduce((acc, it) => acc + it.subtotal, 0)

  let y = MARGEN + 2

  doc.setFont("helvetica", "bold")
  doc.setFontSize(14)
  doc.text("STAR ACCESORIOS", ANCHO / 2, y, { align: "center" })
  y += 7

  doc.setFont("helvetica", "normal")
  doc.setFontSize(10)
  doc.text(titulo || (pedido.origen === "presencial" ? "Venta presencial" : "Comprobante de compra"), ANCHO / 2, y, { align: "center" })
  y += LINEA

  if (clienteNombre) {
    doc.setFontSize(9)
    doc.text(`Cliente: ${clienteNombre}`, ANCHO / 2, y, { align: "center" })
    y += LINEA
  }

  doc.setFontSize(8)
  doc.text(fechaTexto, ANCHO / 2, y, { align: "center" })
  y += LINEA
  doc.text(`Ticket N° ${numVenta}`, ANCHO / 2, y, { align: "center" })
  y += LINEA

  doc.setDrawColor(0, 0, 0)
  doc.line(MARGEN, y, ANCHO - MARGEN, y)
  y += LINEA

  doc.setFontSize(9)
  items.forEach((it) => {
    const lineas = doc.splitTextToSize(`${it.cantidad} x ${it.nombre}`, 48)
    lineas.forEach((linea, i) => {
      doc.text(linea, MARGEN, y)
      if (i === 0) {
        doc.text(formatMoney(it.subtotal), ANCHO - MARGEN, y, { align: "right" })
      }
      y += LINEA
    })
  })

  doc.line(MARGEN, y, ANCHO - MARGEN, y)
  y += LINEA + 1

  doc.setFont("helvetica", "bold")
  doc.setFontSize(12)
  doc.text("TOTAL", MARGEN, y)
  doc.text(formatMoney(total), ANCHO - MARGEN, y, { align: "right" })
  y += LINEA + 2

  doc.setFont("helvetica", "normal")
  doc.setFontSize(9)
  doc.text(`Pago: ${formatPago(pedido.pago)}`, MARGEN, y)
  y += LINEA

  if (montoRecibido != null) {
    doc.text(`Recibido: ${formatMoney(montoRecibido)}`, MARGEN, y)
    y += LINEA
    doc.text(`Vuelto: ${formatMoney(vuelto)}`, MARGEN, y)
    y += LINEA
  }

  doc.line(MARGEN, y, ANCHO - MARGEN, y)
  y += LINEA + 1

  doc.text("Gracias por su compra", ANCHO / 2, y, { align: "center" })
  y += LINEA
  doc.setFontSize(8)
  doc.text("Star Accesorios", ANCHO / 2, y, { align: "center" })

  return y
}

export function generarTicketPDF(pedido, opciones = {}) {
  const numVenta = pedido._id ? String(pedido._id).slice(-8) : Date.now()

  const medidor = new jsPDF({ unit: "mm", format: [ANCHO, 400] })
  const altoFinal = dibujar(medidor, pedido, opciones) + MARGEN

  const doc = new jsPDF({ unit: "mm", format: [ANCHO, Math.ceil(altoFinal)] })
  dibujar(doc, pedido, opciones)

  doc.save(`ticket-${numVenta}.pdf`)
}
