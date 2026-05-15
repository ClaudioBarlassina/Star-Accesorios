import { useState, useEffect } from "react"
import { getProducts, createProduct, updateProduct, deleteProduct } from "../../api/products.api"
import { getPedidos } from "../../api/orders.api"
import { useNavigate } from "react-router-dom"
import styles from "./AdminDashboard.module.css"

const s = {
  title: { fontFamily: "var(--heading)", fontSize: "28px", color: "var(--text)", margin: 0 },
  tab: { padding: "10px 20px", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", background: "var(--surface)", cursor: "pointer", fontFamily: "var(--ui)", fontSize: "14px", fontWeight: 600, transition: "all 200ms ease" },
  tabActive: { background: "var(--gold)", color: "white", borderColor: "var(--gold)" },
  card: { background: "var(--surface)", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", padding: "20px", marginBottom: "12px" },
  badge: { background: "var(--gold-bg)", color: "var(--gold-dark)", padding: "4px 10px", borderRadius: "var(--radius-sm)", fontSize: "12px", fontWeight: 600, fontFamily: "var(--ui)" },
  btn: { padding: "8px 16px", border: "none", borderRadius: "var(--radius-sm)", fontFamily: "var(--ui)", fontSize: "13px", fontWeight: 600, cursor: "pointer", transition: "all 200ms ease" },
  input: { width: "100%", padding: "10px 12px", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", fontFamily: "var(--body)", fontSize: "14px", outline: "none", boxSizing: "border-box" },
  select: { width: "100%", padding: "10px 12px", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", fontFamily: "var(--body)", fontSize: "14px", outline: "none", background: "white", boxSizing: "border-box" },
  label: { fontFamily: "var(--ui)", fontSize: "13px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "4px" },
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 300 },
}

const categorias = ['Acero Quirurgico', 'Acero Dorado', 'Fantasia', 'Perfumes', 'Accesorios']
const subcategorias = ['Aros', 'Anillos', 'Pulseras', 'Colgantes', 'Cadenas', 'Tobilleras', 'Perfumes', 'Cabello']

function ProductForm({ product, onSave, onClose }) {
  const [form, setForm] = useState({
    nombre: product?.nombre || "",
    precio: product?.precio || "",
    descripcion: product?.descripcion || "",
    categoria: product?.categoria || "",
    subcategoria: product?.subcategoria || "",
  })
  const [files, setFiles] = useState(null)
  const [saving, setSaving] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const fd = new FormData()
      fd.append("nombre", form.nombre)
      fd.append("precio", form.precio)
      fd.append("descripcion", form.descripcion)
      fd.append("categoria", form.categoria)
      fd.append("subcategoria", form.subcategoria)
      if (files) {
        Array.from(files).forEach((f) => fd.append("images", f))
      }
      if (product) {
        await updateProduct(product._id, fd)
      } else {
        await createProduct(fd)
      }
      onSave()
    } catch (err) {
      alert("Error al guardar producto")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={s.overlay} onClick={onClose}>
      <div className={styles.adminModal} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2 style={{ fontFamily: "var(--heading)", fontSize: "22px", margin: 0 }}>
            {product ? "Editar Producto" : "Nuevo Producto"}
          </h2>
          <button onClick={onClose} style={{ ...s.btn, background: "transparent", fontSize: "18px" }}>✕</button>
        </div>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div>
            <div style={s.label}>Nombre</div>
            <input style={s.input} name="nombre" value={form.nombre} onChange={handleChange} required />
          </div>
          <div>
            <div style={s.label}>Precio</div>
            <input style={s.input} name="precio" type="number" step="0.01" value={form.precio} onChange={handleChange} required />
          </div>
          <div>
            <div style={s.label}>Descripción</div>
            <textarea style={{ ...s.input, minHeight: "80px", resize: "vertical" }} name="descripcion" value={form.descripcion} onChange={handleChange} />
          </div>
          <div className={styles.formGrid}>
            <div>
              <div style={s.label}>Categoría</div>
              <select style={s.select} name="categoria" value={form.categoria} onChange={handleChange} required>
                <option value="">Seleccionar</option>
                {categorias.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <div style={s.label}>Subcategoría</div>
              <select style={s.select} name="subcategoria" value={form.subcategoria} onChange={handleChange} required>
                <option value="">Seleccionar</option>
                {subcategorias.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div>
            <div style={s.label}>Imágenes</div>
            <input type="file" multiple accept="image/*" onChange={(e) => setFiles(e.target.files)} style={{ fontFamily: "var(--body)", fontSize: "13px" }} />
          </div>
          <button type="submit" disabled={saving} style={{ ...s.btn, background: "var(--gold)", color: "white", padding: "12px", fontSize: "14px", marginTop: "8px" }}>
            {saving ? "Guardando..." : product ? "Actualizar Producto" : "Crear Producto"}
          </button>
        </form>
      </div>
    </div>
  )
}

function OrderCard({ order }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div style={s.card}>
      <div className={styles.orderHeader} onClick={() => setExpanded(!expanded)}>
        <div>
          <strong style={{ fontFamily: "var(--ui)", fontSize: "13px" }}>#{order._id.slice(-8)}</strong>
          <span style={{ marginLeft: "8px", fontSize: "13px", color: "var(--text-secondary)" }}>
            {new Date(order.fecha).toLocaleDateString("es-AR")}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{
            ...s.badge,
            background: order.estado === "pendiente" ? "#fff3cd" : "#d4edda",
            color: order.estado === "pendiente" ? "#856404" : "#155724",
          }}>{order.estado}</span>
          <span style={s.badge}>${order.total?.toLocaleString()}</span>
          <span style={{ fontSize: "12px", color: "var(--text-muted)", transition: "transform 200ms", transform: expanded ? "rotate(180deg)" : "none" }}>▼</span>
        </div>
      </div>

      {expanded && (
        <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px solid var(--border)", fontSize: "14px" }}>
          <div style={{ marginBottom: "12px" }}>
            <strong style={{ fontFamily: "var(--ui)", fontSize: "13px", color: "var(--text-secondary)" }}>CLIENTE</strong>
            <p style={{ margin: "4px 0" }}>{order.cliente?.nombre} {order.cliente?.apellido}</p>
            <p style={{ margin: "4px 0", color: "var(--text-secondary)" }}>{order.cliente?.email} — {order.cliente?.telefono}</p>
            <p style={{ margin: "4px 0", color: "var(--text-secondary)" }}>{order.cliente?.direccion}</p>
          </div>

          <div style={{ marginBottom: "12px" }}>
            <strong style={{ fontFamily: "var(--ui)", fontSize: "13px", color: "var(--text-secondary)" }}>PRODUCTOS</strong>
            {order.productos?.map((p, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: i < order.productos.length - 1 ? "1px solid var(--border-light)" : "none" }}>
                <span>{p.nombre} <span style={{ color: "var(--text-muted)" }}>x{p.cantidad}</span></span>
                <span style={{ fontWeight: 600 }}>${(p.precio * p.cantidad).toLocaleString()}</span>
              </div>
            ))}
          </div>

          <div className={styles.orderDetailsGrid}>
            <span>Entrega: <strong style={{ color: "var(--text)" }}>{order.entrega}</strong></span>
            <span>Pago: <strong style={{ color: "var(--text)" }}>{order.pago}</strong></span>
          </div>

          <div style={{ marginTop: "12px", textAlign: "right" }}>
            <strong style={{ fontSize: "18px", fontFamily: "var(--subheading)" }}>Total: ${order.total?.toLocaleString()}</strong>
          </div>
        </div>
      )}
    </div>
  )
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [tab, setTab] = useState("products")
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)

  const loadData = () => {
    setLoading(true)
    if (tab === "products") {
      getProducts({ limit: 50 })
        .then((res) => setProducts(res.data.products || []))
        .finally(() => setLoading(false))
    } else {
      getPedidos()
        .then((res) => setOrders(res.data || []))
        .finally(() => setLoading(false))
    }
  }

  useEffect(() => { loadData() }, [tab])

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar este producto?")) return
    try {
      await deleteProduct(id)
      loadData()
    } catch (err) {
      alert("Error al eliminar producto")
    }
  }

  return (
    <div className={styles.adminContainer}>
      <div className={styles.adminHeader}>
        <h1 style={s.title}>Panel de Administración</h1>
        <div className={styles.headerButtons}>
          <button onClick={() => { setShowForm(true); setEditingProduct(null) }} style={{ ...s.btn, background: "var(--gold)", color: "white" }}>
            + Nuevo Producto
          </button>
          <button onClick={() => navigate("/")} style={{ ...s.btn, background: "transparent", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>
            ← Tienda
          </button>
        </div>
      </div>

      <div className={styles.adminTabs}>
        <button style={{ ...s.tab, ...(tab === "products" ? s.tabActive : {}) }} onClick={() => setTab("products")}>Productos</button>
        <button style={{ ...s.tab, ...(tab === "orders" ? s.tabActive : {}) }} onClick={() => setTab("orders")}>Pedidos</button>
      </div>

      {loading && <div style={{ textAlign: "center", padding: "40px", color: "var(--text-secondary)" }}>Cargando...</div>}

      {!loading && tab === "products" && (
        <div>
          {products.length === 0 && <p style={{ color: "var(--text-secondary)" }}>No hay productos</p>}
          {products.map((p) => (
            <div key={p._id} style={s.card}>
              <div className={styles.productRow}>
                <div className={styles.productInfo}>
                  {p.images?.[0] && (
                    <img src={p.images[0].url} alt={p.nombre} style={{ width: "48px", height: "48px", objectFit: "cover", borderRadius: "6px" }} />
                  )}
                  <div style={{ flex: 1 }}>
                    <strong style={{ fontFamily: "var(--body)" }}>{p.nombre}</strong>
                    <div style={{ fontSize: "13px", color: "var(--text-secondary)" }}>${p.precio} — {p.categoria}</div>
                  </div>
                </div>
                <span style={s.badge}>{p.subcategoria}</span>
                <div className={styles.productActions}>
                  <button onClick={() => { setEditingProduct(p); setShowForm(true) }} style={{ ...s.btn, background: "var(--border-light)", color: "var(--text)" }}>Editar</button>
                  <button onClick={() => handleDelete(p._id)} style={{ ...s.btn, background: "#fee2e2", color: "#dc2626" }}>Eliminar</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && tab === "orders" && (
        <div>
          {orders.length === 0 && <p style={{ color: "var(--text-secondary)" }}>No hay pedidos</p>}
          {orders.map((o) => <OrderCard key={o._id} order={o} />)}
        </div>
      )}

      {showForm && (
        <ProductForm
          product={editingProduct}
          onSave={() => { setShowForm(false); setEditingProduct(null); loadData() }}
          onClose={() => { setShowForm(false); setEditingProduct(null) }}
        />
      )}
    </div>
  )
}