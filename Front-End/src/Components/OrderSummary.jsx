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

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Factura de Compra", 10, 10);
    doc.setFontSize(12);
    doc.text(`Pedido N°: ${pedido.id || "0001"}`, 10, 20);
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 150, 20);
    doc.line(10, 25, 200, 25);

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

    doc.setFontSize(14);
    doc.text("Productos:", 10, 110);
    doc.setFontSize(12);
    let y = 120;
    pedido.Productos.forEach((prod, index) => {
      doc.text(
        `${index + 1}. ${prod.nombre} - ${prod.cantidad} unidades - $${prod.total}`,
        10,
        y
      );
      y += 10;
    });

    doc.line(10, y + 5, 200, y + 5);
    doc.text(`Total a Pagar: $${pedido.Total}`, 10, y + 15);
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
      <ul className="order-summary-list">
        {pedido.Productos.map((item, index) => (
          <li key={index} className="order-summary-item">
            {item.nombre} - {item.cantidad} unidades - ${item.total}
          </li>
        ))}
      </ul>

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
