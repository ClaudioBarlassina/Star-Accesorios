export const adminTemplate = (pedido) => {
  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f4f4f4;
          padding: 20px 10px;
        }

        .container {
          max-width: 700px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .header {
          background-color: #d32f2f;
          color: white;
          padding: 30px 20px;
          text-align: center;
        }

        .header h1 {
          font-size: 28px;
          margin-bottom: 5px;
          font-weight: 600;
        }

        .content {
          padding: 30px 20px;
        }

        .section {
          margin-bottom: 30px;
        }

        .section-title {
          font-size: 18px;
          color: #222;
          border-bottom: 2px solid #d32f2f;
          padding-bottom: 12px;
          margin-bottom: 20px;
          font-weight: 600;
        }

        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          margin-bottom: 20px;
        }

        .info-item {
          background-color: #fafafa;
          padding: 12px;
          border-radius: 8px;
        }

        .info-item p {
          margin: 0;
          font-size: 13px;
          color: #333;
          line-height: 1.5;
        }

        .info-item strong {
          color: #111;
          font-weight: 600;
        }

        .full-width {
          grid-column: 1 / -1;
        }

        .product-item {
          border: 1px solid #eee;
          border-radius: 8px;
          padding: 15px;
          margin-bottom: 15px;
          background-color: #fafafa;
        }

        .product-wrapper {
          display: flex;
          gap: 15px;
          align-items: flex-start;
        }

        .product-image {
          flex-shrink: 0;
          width: 80px;
          height: 80px;
          object-fit: cover;
          border-radius: 6px;
          border: 1px solid #ddd;
        }

        .product-details {
          flex-grow: 1;
          min-width: 0;
        }

        .product-details p {
          font-size: 13px;
          margin-bottom: 10px;
          color: #333;
          line-height: 1.5;
        }

        .product-details strong {
          color: #111;
          font-weight: 600;
        }

        .total-box {
          margin-top: 30px;
          padding: 25px;
          background: linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%);
          border-radius: 8px;
          text-align: right;
          color: white;
        }

        .total-box h2 {
          font-size: 24px;
          margin: 0;
          font-weight: 700;
        }

        .footer-message {
          margin-top: 30px;
          text-align: center;
          color: #777;
          font-size: 12px;
          border-top: 1px solid #eee;
          padding-top: 20px;
        }

        .footer {
          background-color: #111;
          color: #aaa;
          text-align: center;
          padding: 20px;
          font-size: 13px;
        }

        /* Responsive Design */
        @media (max-width: 480px) {
          body {
            padding: 10px 5px;
          }

          .header {
            padding: 20px 15px;
          }

          .header h1 {
            font-size: 22px;
          }

          .content {
            padding: 20px 15px;
          }

          .section-title {
            font-size: 16px;
            margin-bottom: 15px;
          }

          .info-grid {
            grid-template-columns: 1fr;
            gap: 12px;
            margin-bottom: 15px;
          }

          .info-item {
            padding: 10px;
          }

          .info-item p {
            font-size: 12px;
          }

          .product-item {
            padding: 12px;
            margin-bottom: 12px;
          }

          .product-wrapper {
            flex-direction: column;
            gap: 12px;
          }

          .product-image {
            width: 100%;
            height: 150px;
            margin: 0 auto 10px;
          }

          .product-details {
            width: 100%;
          }

          .product-details p {
            font-size: 12px;
            margin-bottom: 8px;
          }

          .total-box {
            margin-top: 20px;
            padding: 20px;
          }

          .total-box h2 {
            font-size: 20px;
          }

          .footer-message {
            margin-top: 20px;
            padding-top: 15px;
            font-size: 11px;
          }

          .footer {
            padding: 15px;
            font-size: 11px;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Header -->
        <div class="header">
          <h1>🛒 Nuevo pedido recibido</h1>
        </div>

        <!-- Content -->
        <div class="content">
          <!-- Datos del cliente -->
          <div class="section">
            <h2 class="section-title">👤 Datos del cliente</h2>
            <div class="info-grid">
              <div class="info-item">
                <p><strong>Nombre:</strong> ${pedido.cliente.nombre} ${pedido.cliente.apellido}</p>
              </div>
              <div class="info-item">
                <p><strong>Email:</strong> ${pedido.cliente.email}</p>
              </div>
              <div class="info-item">
                <p><strong>Teléfono:</strong> ${pedido.cliente.telefono}</p>
              </div>
              <div class="info-item">
                <p><strong>Método de pago:</strong> ${pedido.pago}</p>
              </div>
              <div class="info-item full-width">
                <p><strong>📍 Dirección:</strong> ${pedido.cliente.direccion || 'No especificada'}</p>
              </div>
              <div class="info-item full-width">
                <p><strong>🚚 Entrega:</strong> ${pedido.entrega}</p>
              </div>
            </div>
          </div>

          <!-- Productos -->
          <div class="section">
            <h2 class="section-title">📦 Productos</h2>
            ${pedido.productos
              .map(
                (producto) => `
            <div class="product-item">
              <div class="product-wrapper">
                <img
                  class="product-image"
                  src="${producto.images}"
                  alt="${producto.nombre}"
                />
                <div class="product-details">
                  <p><strong>Producto:</strong> ${producto.nombre}</p>
                  <p><strong>Categoría:</strong> ${producto.categoria}</p>
                  <p><strong>Precio:</strong> $${producto.precio}</p>
                  <p><strong>Descripción:</strong> ${producto.descripcion}</p>
                </div>
              </div>
            </div>
            `,
              )
              .join('')}
          </div>

          <!-- Total -->
          <div class="total-box">
            <h2>💰 Total: $${pedido.total}</h2>
          </div>

          <!-- Footer Message -->
          <p class="footer-message">
            Pedido generado automáticamente desde Star Accesorios
          </p>
        </div>

        <!-- Footer -->
        <div class="footer">
          Star Accesorios ✨
        </div>
      </div>
    </body>
    </html>
  `
}
