import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import "../Components/OrderSummary.css";

const OrderSummary = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { pedido } = location.state || {};

  if (!pedido) {
    return <div>No hay información de la compra.</div>;
  }
  const esTransferencia = pedido.Cliente[0].metodoPago === "Transferencia";
  
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
  
    // Encabezado del documento
    doc.setFontSize(18);
    doc.text("Recibo de Compra", 10, 10);
    doc.setFontSize(12);
    doc.text(`Pedido N°: ${pedido.id || "0001"}`, 10, 20);
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 150, 20);
    doc.line(10, 25, 200, 25);
  
    // Datos del Cliente
    doc.setFontSize(14);
    doc.text("Datos del Cliente:", 10, 35);
    doc.setFontSize(12);
    doc.text(`Nombre: ${pedido.Cliente[0].nombre}`, 10, 45);
    doc.text(`Dirección: ${pedido.Cliente[0].direccion}`, 10, 55);
    doc.text(`Teléfono: ${pedido.Cliente[0].telefono}`, 10, 65);
    doc.text(`Email: ${pedido.Cliente[0].email}`, 10, 75);
    doc.text(`Ciudad: ${pedido.Cliente[0].ciudad}`, 10, 85);
    doc.text(`Método de Pago: ${pedido.Cliente[0].metodoPago}`, 10, 95);
    doc.line(10, 100, 200, 100);
  
    // Tabla de productos
    doc.setFontSize(14);
    doc.text("Productos:", 10, 110);
    doc.setFontSize(12);
  
    let y = 120;
    
    // Encabezados de la tabla
    doc.setFont("helvetica", "bold");
    doc.text("Producto", 10, y);
    doc.text("Cant", 80, y);
    
    doc.text("Total", 160, y);
    doc.setFont("helvetica", "normal");
    y += 5;
  
    // Línea separadora
    doc.line(10, y, 200, y);
    y += 5;
  
    // Recorrer productos y agregarlos a la tabla
    pedido.Productos.forEach((prod) => {
      doc.text(prod.nombre, 10, y);
      doc.text(prod.cantidad.toString(), 85, y);
      
      doc.text(`$${prod.total}`, 160, y);
      y += 10;
    });
  
    // Línea final de la tabla
    doc.line(10, y + 5, 200, y + 5);
  
    // Total a pagar
    doc.setFont("helvetica", "bold");
    doc.text(`Total a Pagar:    $${pedido.Total.toFixed(2)}`, 125, y += 10);
    
    // Agregar datos de transferencia si el método de pago es "transferencia"
    if (esTransferencia) {
      y += 25;
      doc.setFontSize(14);
      doc.text("Detalles para la Transferencia:", 10, y);
      doc.setFontSize(12);
      y += 10;
      doc.text(`Alias de Cuenta: MiAliasDeCuenta`, 10, y);
      y += 10;
      doc.text(`Banco: Banco XYZ`, 10, y);
      y += 10;
      doc.text(`CBU: 1234567890123456789012`, 10, y);
      y += 10;
      doc.text(`Concepto: Compra en tienda online`, 10, y);
      y += 10;
      doc.text(`Valor a Transferir: $${pedido.Total.toFixed(2)}`, 10, y);
      y += 10;
      doc.setFontSize(10);
      doc.text(
        "Realiza la transferencia con los datos anteriores. Una vez realizada, espera la confirmación de tu compra.",
        10,
        y,
        { maxWidth: 180 }
      );
    }



    // Guardar el PDF
    doc.save(`Factura_${pedido.id || "0001"}.pdf`);
  };
  

  return (
    <div className="order-summary-container">
      <h2 className="order-summary-title">Recibo de Compra</h2>
      <p><strong>Pedido N°:</strong> {pedido.id || "0001"}</p>
      <p><strong>Fecha:</strong> {new Date().toLocaleDateString()}</p>

      <h3 className="order-summary-subtitle">Datos del Cliente</h3>
      <p><strong>Nombre:</strong> {pedido.Cliente[0].nombre}</p>
      <p><strong>Dirección:</strong> {pedido.Cliente[0].direccion}</p>
      <p><strong>Teléfono:</strong> {pedido.Cliente[0].telefono}</p>
      <p><strong>Email:</strong> {pedido.Cliente[0].email}</p>
      <p><strong>Ciudad:</strong> {pedido.Cliente[0].ciudad}</p>
      <p><strong>Método de Pago:</strong> {pedido.Cliente[0].metodoPago}</p>

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
        <button className="order-summary-button download" onClick={handleDownloadPDF}>
          Descargar recibo
        </button>
        <button className="order-summary-button back" onClick={() => navigate("/")}>
          Volver a la tienda
        </button>
      </div>
    </div>
  );
};

export default OrderSummary;
