# Star Accesorios - E-commerce

Tienda online de accesorios y joyería construida con React + Vite (frontend) y Express + MongoDB (backend).

## Stack

| Capa | Tecnología |
|---|---|
| Frontend | React 19, Vite 8, React Router 7, Zustand 5, Swiper 12 |
| Backend | Express 5, Mongoose 9, MongoDB Atlas |
| Autenticación | Firebase (email/password + Google OAuth) |
| Imágenes | Cloudinary |
| Emails | Nodemailer (Gmail SMTP) |

## Requisitos

- Node.js 18+
- MongoDB Atlas URI
- Firebase project
- Cloudinary account
- Gmail account (para envío de emails)

## Instalación

### Backend

```bash
cd BackEnd_Mongo_Cloud
cp .env.example .env   # completar con tus credenciales
npm install
npm run dev            # http://localhost:3002
```

### Frontend

```bash
cd FrontEnd
npm install
npm run dev            # http://localhost:5173
```

## Variables de Entorno

### BackEnd_Mongo_Cloud/.env

- `MONGO_URI` — conexión a MongoDB Atlas
- `DB_NAME` — nombre de la base de datos
- `COLLECTION` — nombre de la colección de productos
- `CLOUDINARY_URL` — credenciales de Cloudinary
- `EMAIL_USER` — email Gmail para enviar notificaciones
- `EMAIL_PASS` — contraseña de aplicación de Gmail

### FrontEnd

La configuración de Firebase se encuentra en `src/components/layoudShopLogM/firebase/firebase.js`.

## Rutas

| Ruta | Descripción |
|---|---|
| `/` | Home — catálogo con filtros, búsqueda y paginación |
| `/product/:id` | Detalle de producto |
| `/order` | Resumen del carrito |
| `/checkout` | Formulario de compra |
| `/success` | Confirmación de pedido |
| `/admin` | Panel de administración |

## API

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/products` | Lista productos (filtros: category, subcategory, search, page) |
| GET | `/api/products/:id` | Producto por ID |
| POST | `/api/products` | Crear producto (multipart) |
| PUT | `/api/products/:id` | Actualizar producto |
| DELETE | `/api/products/:id` | Eliminar producto |
| POST | `/api/pedidos` | Crear pedido (envía emails) |
| GET | `/api/pedidos` | Lista pedidos |
| GET | `/api/pedidos/:id` | Pedido por ID |
