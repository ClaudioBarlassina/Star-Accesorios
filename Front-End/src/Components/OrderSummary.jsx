import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { jsPDF } from 'jspdf'
import '../Components/OrderSummary.css'
import{  LogoBase64  }from '../assets/LogoBase64.js'

const OrderSummary = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { pedido } = location.state || {}

  if (!pedido) {
    return <div>No hay información de la compra.</div>
  }
  const esTransferencia = pedido.Cliente[0].metodoPago === 'Transferencia'

  const handleDownloadPDF = () => {
    const doc = new jsPDF()

    // === Logo ===

    doc.addImage(LogoBase64, 'PNG', 150, 5, 25, 25) // (x, y, width, height)

    // === Membrete de la empresa ===
    doc.setFontSize(22)
    doc.setTextColor(40, 40, 40)
    doc.setFont('helvetica', 'bold')
    doc.text('Star-Accesorios', 10, 15) // Ajustado para dejar espacio al logo

    // === Encabezado del documento ===
    doc.setFontSize(18)
    doc.setTextColor(0, 0, 0)
    doc.setFont('helvetica', 'normal')
    doc.text('Recibo de Compra', 10, 25)
    doc.setFontSize(12)
    doc.text(`Pedido N°: ${'0001'}`, 10, 35)
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 150, 35)
    doc.line(10, 40, 200, 40)

    let y = 50 // Reacomodamos el contenido para no superponer
    // ... el resto de tu contenido sigue desde acá ...

    doc.setFontSize(14)
    doc.text('Datos del Cliente:', 10, y)
    doc.setFontSize(12)
    doc.text(`Nombre: ${pedido.Cliente[0].nombre}`, 10, (y += 10))
    doc.text(`Dirección: ${pedido.Cliente[0].direccion}`, 10, (y += 10))
    doc.text(`Teléfono: ${pedido.Cliente[0].telefono}`, 10, (y += 10))
    doc.text(`Email: ${pedido.Cliente[0].email}`, 10, (y += 10))
    doc.text(`Ciudad: ${pedido.Cliente[0].ciudad}`, 10, (y += 10))
    doc.text(`Método de Pago: ${pedido.Cliente[0].metodoPago}`, 10, (y += 10))
    doc.line(10, (y += 5), 200, y)

    // Tabla de productos
    doc.setFontSize(14)
    doc.text('Productos:', 10, (y += 10))
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('Producto', 10, (y += 10))
    doc.text('Cant', 80, y)
    doc.text('Total', 160, y)
    doc.setFont('helvetica', 'normal')
    doc.line(10, (y += 5), 200, y)
    y += 5

    pedido.Productos.forEach((prod) => {
      doc.text(prod.nombre, 10, y)
      doc.text(prod.cantidad.toString(), 85, y)
      doc.text(`$${prod.total}`, 160, y)
      y += 10
    })

    doc.line(10, y + 5, 200, y + 5)
    doc.setFont('helvetica', 'bold')
    doc.text(`Total a Pagar:    $${pedido.Total.toFixed(2)}`, 125, (y += 10))

    if (esTransferencia) {
      y += 25
      doc.setFontSize(14)
      doc.text('Detalles para la Transferencia:', 10, y)
      doc.setFontSize(12)
      y += 10
      doc.text(`Alias de Cuenta: MiAliasDeCuenta`, 10, y)
      y += 10
      doc.text(`Banco: Banco XYZ`, 10, y)
      y += 10
      doc.text(`CBU: 1234567890123456789012`, 10, y)
      y += 10
      doc.text(`Concepto: Compra en tienda online`, 10, y)
      y += 10
      doc.text(`Valor a Transferir: $${pedido.Total.toFixed(2)}`, 10, y)
      y += 10
      doc.setFontSize(10)
      doc.text(
        'Realiza la transferencia con los datos anteriores. Una vez realizada, espera la confirmación de tu compra.',
        10,
        y,
        { maxWidth: 180 }
      )
    }

    // Guardar el PDF
    doc.save(`Factura_${pedido.id || '0001'}.pdf`)
  }

  return (
    <div className="order-summary-container">
      <h2 className="order-summary-title">Recibo de Compra</h2>
      <p>
        <strong>Pedido N°:</strong> {pedido.id || '0001'}
      </p>
      <p>
        <strong>Fecha:</strong> {new Date().toLocaleDateString()}
      </p>

      <h3 className="order-summary-subtitle">Datos del Cliente</h3>
      <p>
        <strong>Nombre:</strong> {pedido.Cliente[0].nombre}
      </p>
      <p>
        <strong>Dirección:</strong> {pedido.Cliente[0].direccion}
      </p>
      <p>
        <strong>Teléfono:</strong> {pedido.Cliente[0].telefono}
      </p>
      <p>
        <strong>Email:</strong> {pedido.Cliente[0].email}
      </p>
      <p>
        <strong>Ciudad:</strong> {pedido.Cliente[0].ciudad}
      </p>
      <p>
        <strong>Método de Pago:</strong> {pedido.Cliente[0].metodoPago}
      </p>

      <h3 className="order-summary-subtitle">Detalle de la Compra</h3>
      <table className="order-summary-table">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Cant</th>

            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {pedido.Productos.map((item, index) => (
            <tr key={index}>
              <td>{item.nombre}</td>
              <td>{item.cantidad}</td>

              <td>${item.total}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 className="order-summary-total">Total a Pagar: ${pedido.Total}</h3>

      <div className="order-summary-buttons">
        <button
          className="order-summary-button download"
          onClick={handleDownloadPDF}
        >
          Descargar recibo
        </button>
        <button
          className="order-summary-button back"
          onClick={() => navigate('/')}
        >
          Volver a la tienda
        </button>
      </div>
    </div>
  )
}

export default OrderSummary
