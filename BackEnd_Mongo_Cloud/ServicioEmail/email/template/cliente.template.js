export const clienteTemplate = (pedido) => {
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
          max-width: 650px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .header {
          background-color: #111;
          color: white;
          padding: 30px 20px;
          text-align: center;
        }

        .header h1 {
          font-size: 28px;
          margin-bottom: 10px;
          font-weight: 600;
        }

        .header p {
          font-size: 16px;
          color: #ddd;
          line-height: 1.5;
        }

        .content {
          padding: 30px 20px;
        }

        .section-title {
          font-size: 22px;
          color: #222;
          margin-bottom: 20px;
          font-weight: 600;
        }

        .product-item {
          border: 1px solid #eee;
          border-radius: 10px;
          padding: 20px;
          margin-bottom: 20px;
        }

        .product-wrapper {
          display: flex;
          gap: 15px;
          align-items: flex-start;
        }

        .product-image {
          flex-shrink: 0;
          width: 100px;
          height: 100px;
          object-fit: cover;
          border-radius: 8px;
          border: 1px solid #ddd;
        }

        .product-info {
          flex-grow: 1;
          min-width: 0;
        }

        .product-info h3 {
          font-size: 18px;
          margin-bottom: 10px;
          color: #111;
          font-weight: 600;
        }

        .product-info p {
          font-size: 14px;
          margin-bottom: 8px;
          color: #333;
          line-height: 1.4;
        }

        .product-info strong {
          color: #111;
          font-weight: 600;
        }

        .description {
          margin-top: 10px;
          color: #666;
          font-size: 13px;
          line-height: 1.5;
        }

        .order-info {
          background-color: #fafafa;
          border-radius: 10px;
          padding: 20px;
          margin-top: 30px;
        }

        .order-info h2 {
          font-size: 18px;
          margin-bottom: 15px;
          color: #111;
          font-weight: 600;
        }

        .order-info p {
          font-size: 14px;
          margin-bottom: 12px;
          color: #333;
          line-height: 1.5;
        }

        .total {
          font-size: 20px;
          font-weight: 700;
          color: #111;
          margin-top: 20px;
          padding-top: 15px;
          border-top: 1px solid #e0e0e0;
        }

        .message {
          margin-top: 30px;
          color: #666;
          line-height: 1.6;
          font-size: 14px;
          text-align: center;
        }

        .footer {
          background-color: #111;
          color: #aaa;
          text-align: center;
          padding: 25px 20px;
          font-size: 14px;
          border-top: 1px solid #222;
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
            font-size: 24px;
          }

          .header p {
            font-size: 14px;
          }

          .content {
            padding: 20px 15px;
          }

          .section-title {
            font-size: 18px;
            margin-bottom: 15px;
          }

          .product-item {
            padding: 15px;
            margin-bottom: 15px;
          }

          .product-wrapper {
            flex-direction: column;
            gap: 12px;
          }

          .product-image {
            width: 100%;
            height: 200px;
            margin: 0 auto 15px;
          }

          .product-info {
            width: 100%;
          }

          .product-info h3 {
            font-size: 16px;
          }

          .product-info p {
            font-size: 13px;
            margin-bottom: 6px;
          }

          .description {
            font-size: 12px;
          }

          .order-info {
            padding: 15px;
            margin-top: 20px;
          }

          .order-info h2 {
            font-size: 16px;
            margin-bottom: 12px;
          }

          .order-info p {
            font-size: 13px;
            margin-bottom: 10px;
          }

          .total {
            font-size: 18px;
          }

          .message {
            font-size: 13px;
            margin-top: 20px;
          }

          .footer {
            padding: 20px 15px;
            font-size: 12px;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Header -->
        <div class="header">
          <h1>✨ Gracias por tu compra</h1>
          <p>Hola ${pedido.cliente.nombre}, recibimos tu pedido correctamente.</p>
        </div>

        <!-- Content -->
        <div class="content">
          <!-- Productos -->
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
              <div class="product-info">
                <h3>${producto.nombre}</h3>
                <p><strong>Categoría:</strong> ${producto.categoria}</p>
                <p><strong>Subcategoría:</strong> ${producto.subcategoria}</p>
                <p><strong>Precio:</strong> $${producto.precio}</p>
                <p class="description">${producto.descripcion}</p>
              </div>
            </div>
          </div>
            `,
            )
            .join('')}

          <!-- Información del pedido -->
          <div class="order-info">
            <h2>🧾 Información del pedido</h2>
            <p><strong>💳 Pago:</strong> ${pedido.pago}</p>
            <p><strong>🚚 Entrega:</strong> ${pedido.entrega}</p>
            <p><strong>📍 Dirección:</strong> ${pedido.cliente.direccion || 'No especificada'}</p>
            <div class="total">💰 Total: $${pedido.total}</div>
          </div>

          <!-- Mensaje Final -->
          <p class="message">
            Estamos preparando tu pedido ❤️<br/>
            Ante cualquier duda podés responder este email.
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
