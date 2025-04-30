import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import './PedidosList.css'
import { jsPDF } from 'jspdf'
import {LogoBase64}  from "../assets/LogoBase64.js";

const PedidosList = () => {
  const [pedidos, setPedidos] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchPedidos = async () => {
      const { data, error } = await supabase.from('Pedidos').select('*')
      if (error) {
        console.error('Error al obtener pedidos:', error)
      } else {
        setPedidos(data)
      }
    }
    fetchPedidos()
  }, [])

  const handleDelete = async (id) => {
    const { error } = await supabase.from('Pedidos').delete().eq('id', id)
    if (!error) {
      setPedidos(pedidos.filter((pedido) => pedido.id !== id))
    } else {
      console.error('Error al eliminar pedido:', error)
    }
  }

  const handleCheckChange = async (id) => {
    const pedido = pedidos.find((p) => p.id === id)
    const { error } = await supabase
      .from('Pedidos')
      .update({ tomado: !pedido.tomado })
      .eq('id', id)

    if (!error) {
      setPedidos(
        pedidos.map((p) => (p.id === id ? { ...p, tomado: !p.tomado } : p))
      )
    } else {
      console.error('Error al actualizar el estado de toma:', error)
    }
  }

  const generarPDF = (pedido, esTransferencia) => {
    // Aquí tienes la función adaptada para generar el recibo

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
    doc.text(`Pedido N°: ${pedido.id || '0001'}`, 10, 35)
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 150, 35)
    doc.line(10, 40, 200, 40)

    let y = 50 // Reacomodamos el contenido para no superponer
    // === Datos del Cliente ===
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

    // === Tabla de productos ===
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

    // === Detalles de transferencia ===
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
    <div className="orders-list-container">
      <h2 className="titulo">Lista de Pedidos</h2>
      <button className="boton-volver" onClick={() => navigate('/Admin')}>
        Volver
      </button>
      <ul className="lista-pedidos">
        {pedidos.map((pedido) => (
          <li
            key={pedido.id}
            className={`pedido-item ${pedido.tomado ? 'leido' : ''}`}
          >
            <div className="info-pedido">
              <p>
                <strong>Fecha:</strong>{' '}
                {new Date(pedido.created_at).toLocaleString()}
              </p>
              <p>
                <strong>Cliente:</strong> {pedido.Cliente[0].nombre}
              </p>
              <p>
                <strong>Localidad:</strong> {pedido.Cliente[0].ciudad}
              </p>
              <p>
                <strong>Dirección:</strong> {pedido.Cliente[0].direccion}
              </p>
            </div>
            <div className="productos-pedido">
              <p>
                <strong>Productos:</strong>
              </p>
              <table className="tabla-productos">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Cantidad</th>
                    <th>Precio</th>
                  </tr>
                </thead>
                <tbody>
                  {pedido.Productos.map((producto) => (
                    <tr key={producto.id}>
                      <td>{producto.nombre}</td>
                      <td>{producto.cantidad}</td>
                      <td>${producto.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button
              className="boton eliminar"
              onClick={() => handleDelete(pedido.id)}
            >
              Eliminar
            </button>
            <label>
              <input
                type="checkbox"
                checked={pedido.tomado || false}
                onChange={() => handleCheckChange(pedido.id)}
              />
              Leído
            </label>
            <p>
              <strong>Total Pedido:</strong> ${pedido.Total}
            </p>
            <button
              className="boton descargar"
              onClick={() => generarPDF(pedido)}
            >
              Descargar Recibo
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default PedidosList
