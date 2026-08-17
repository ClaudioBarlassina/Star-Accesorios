import { useState, useEffect, useMemo, useRef, useCallback } from "react"
import { getProducts, createProduct, updateProduct, deleteProduct } from "../../api/products.api"
import { getPedidos, updatePedidoEstado } from "../../api/orders.api"
import { useNavigate } from "react-router-dom"
import { CATEGORIAS, getSubcategoriasDe } from "../../config/categories"
import CajaVenta from "./POS/CajaVenta"
import BulkProductForm from "./BulkProductForm"
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

const ESTADOS = ["pendiente", "procesando", "enviado", "entregado", "cancelado"]
const ESTADO_COLORS = {
  pendiente: { bg: "#fff3cd", fg: "#856404" },
  procesando: { bg: "#cce5ff", fg: "#004085" },
  enviado: { bg: "#d1ecf1", fg: "#0c5460" },
  entregado: { bg: "#d4edda", fg: "#155724" },
  cancelado: { bg: "#f8d7da", fg: "#721c24" },
}

function Toast({ toast, onClose }) {
  if (!toast) return null
  return (
    <div className={`${styles.toast} ${toast.type === "error" ? styles.toastError : styles.toastSuccess}`} onClick={onClose}>
      {toast.msg}
    </div>
  )
}

function ConfirmDialog({ text, onConfirm, onCancel }) {
  return (
    <div style={s.overlay} onClick={onCancel}>
      <div className={styles.confirmBox} onClick={(e) => e.stopPropagation()}>
        <p style={{ fontFamily: "var(--body)", fontSize: "15px", margin: 0 }}>{text}</p>
        <div className={styles.confirmActions}>
          <button onClick={onCancel} style={{ ...s.btn, background: "var(--border-light)", color: "var(--text)" }}>Cancelar</button>
          <button onClick={onConfirm} style={{ ...s.btn, background: "#dc2626", color: "white" }}>Confirmar</button>
        </div>
      </div>
    </div>
  )
}

function sonidoPedido() {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext
    if (!Ctx) return
    const ctx = new Ctx()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = "sine"
    osc.frequency.value = 880
    gain.gain.setValueAtTime(0.1, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4)
    osc.start()
    osc.stop(ctx.currentTime + 0.4)
  } catch {
    // el navegador puede bloquear el audio hasta una interacción; se ignora
  }
}

function StatCard({ label, value, sub, color }) {  return (
    <div className={styles.statCard}>
      <div className={styles.statValue} style={{ color }}>{value}</div>
      <div className={styles.statLabel}>{label}</div>
      {sub && <div className={styles.statSub}>{sub}</div>}
    </div>
  )
}

function ProductForm({ product, onSave, onClose }) {
  const [form, setForm] = useState({
    nombre: product?.nombre || "",
    precio: product?.precio ?? "",
    descripcion: product?.descripcion || "",
    categoria: product?.categoria || "",
    subcategoria: product?.subcategoria || "",
    stock: product?.stock ?? 1,
  })
  const [existingImages, setExistingImages] = useState(product?.images || [])
  const [newFiles, setNewFiles] = useState([])
  const [saving, setSaving] = useState(false)
  const previewUrlsRef = useRef([])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleCategoria = (e) => {
    const cat = e.target.value
    setForm((f) => ({ ...f, categoria: cat, subcategoria: "" }))
  }

  const addFiles = (e) => {
    const files = Array.from(e.target.files || [])
    const next = files.map((file) => {
      const preview = URL.createObjectURL(file)
      previewUrlsRef.current.push(preview)
      return { file, preview }
    })
    setNewFiles((prev) => [...prev, ...next])
    e.target.value = ""
  }

  const removeExisting = (id) => setExistingImages((prev) => prev.filter((img) => img.cloudinary_id !== id))
  const removeNew = (i) => {
    setNewFiles((prev) => {
      URL.revokeObjectURL(prev[i].preview)
      previewUrlsRef.current = previewUrlsRef.current.filter((u) => u !== prev[i].preview)
      return prev.filter((_, idx) => idx !== i)
    })
  }

  useEffect(() => {
    return () => {
      previewUrlsRef.current.forEach((u) => URL.revokeObjectURL(u))
      previewUrlsRef.current = []
    }
  }, [])

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
      fd.append("stock", form.stock)
      existingImages.forEach((img) => fd.append("keepImageIds", img.cloudinary_id))
      newFiles.forEach(({ file }) => fd.append("images", file))

      if (product) {
        await updateProduct(product._id, fd)
      } else {
        await createProduct(fd)
      }
      onSave()
    } catch {
      onSave({ error: true })
    } finally {
      setSaving(false)
    }
  }

  const subcategorias = getSubcategoriasDe(form.categoria)

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
          <div className={styles.formGrid}>
            <div>
              <div style={s.label}>Precio</div>
              <input style={s.input} name="precio" type="number" step="0.01" min="0" value={form.precio} onChange={handleChange} required />
            </div>
            <div>
              <div style={s.label}>Stock</div>
              <input style={s.input} name="stock" type="number" step="1" min="0" value={form.stock} onChange={handleChange} required />
            </div>
          </div>
          <div>
            <div style={s.label}>Descripción</div>
            <textarea style={{ ...s.input, minHeight: "80px", resize: "vertical" }} name="descripcion" value={form.descripcion} onChange={handleChange} />
          </div>
          <div className={styles.formGrid}>
            <div>
              <div style={s.label}>Categoría</div>
              <select style={s.select} name="categoria" value={form.categoria} onChange={handleCategoria} required>
                <option value="">Seleccionar</option>
                {CATEGORIAS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <div style={s.label}>Subcategoría</div>
              <select style={s.select} name="subcategoria" value={form.subcategoria} onChange={handleChange} required disabled={!form.categoria}>
                <option value="">Seleccionar</option>
                {subcategorias.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div>
            <div style={s.label}>Imágenes</div>
            <input type="file" multiple accept="image/*" onChange={addFiles} style={{ fontFamily: "var(--body)", fontSize: "13px" }} />
            {(existingImages.length > 0 || newFiles.length > 0) && (
              <div className={styles.imgGrid}>
                {existingImages.map((img) => (
                  <div key={img.cloudinary_id} className={styles.imgThumb}>
                    <img src={img.url} alt={form.nombre} />
                    <button type="button" className={styles.imgRemove} onClick={() => removeExisting(img.cloudinary_id)}>✕</button>
                  </div>
                ))}
                {newFiles.map((f, i) => (
                  <div key={i} className={styles.imgThumb}>
                    <img src={f.preview} alt="" />
                    <button type="button" className={styles.imgRemove} onClick={() => removeNew(i)}>✕</button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <button type="submit" disabled={saving} style={{ ...s.btn, background: "var(--gold)", color: "white", padding: "12px", fontSize: "14px", marginTop: "8px" }}>
            {saving ? "Guardando..." : product ? "Actualizar Producto" : "Crear Producto"}
          </button>
        </form>
      </div>
    </div>
  )
}

function OrderCard({ order, onEstadoChange }) {
  const [expanded, setExpanded] = useState(false)
  const [updating, setUpdating] = useState(false)
  const colors = ESTADO_COLORS[order.estado] || ESTADO_COLORS.pendiente

  const handleEstado = async (e) => {
    const nuevo = e.target.value
    if (nuevo === order.estado) return
    setUpdating(true)
    try {
      await onEstadoChange(order._id, nuevo)
    } finally {
      setUpdating(false)
    }
  }

  return (
    <div style={s.card}>
      <div className={styles.orderHeader} onClick={() => setExpanded(!expanded)}>
        <div>
          <strong style={{ fontFamily: "var(--ui)", fontSize: "13px" }}>#{order._id.slice(-8)}</strong>
          <span style={{ marginLeft: "8px", fontSize: "13px", color: "var(--text-secondary)" }}>
            {new Date(order.fecha).toLocaleDateString("es-AR")}
          </span>
        </div>
        <div className={styles.orderHeaderRight} onClick={(e) => e.stopPropagation()}>
          {order.origen === "presencial" && (
            <span style={{ ...s.badge, background: "#e0e7ff", color: "#3730a3" }}>Presencial</span>
          )}
          <select
            style={{ ...s.select, width: "auto", padding: "6px 10px", fontSize: "12px", fontWeight: 600, background: colors.bg, color: colors.fg, borderColor: colors.fg }}
            value={order.estado}
            onChange={handleEstado}
            disabled={updating}
          >
            {ESTADOS.map((est) => <option key={est} value={est} style={{ color: "initial" }}>{est}</option>)}
          </select>
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

function Resumen({ orders, products, loading }) {
  const ventas = orders
    .filter((o) => o.estado !== "cancelado")
    .reduce((acc, o) => acc + (o.total || 0), 0)

  const pendientes = orders.filter((o) => o.estado === "pendiente").length
  const stockBajo = products.filter((p) => Number.isFinite(p.stock) && p.stock > 0 && p.stock <= 5).length
  const agotados = products.filter((p) => Number.isFinite(p.stock) && p.stock <= 0).length

  if (loading) return <div style={{ textAlign: "center", padding: "40px", color: "var(--text-secondary)" }}>Cargando...</div>

  return (
    <div className={styles.statsGrid}>
      <StatCard label="Ventas totales" value={`$${ventas.toLocaleString()}`} sub={`${orders.filter((o) => o.estado !== "cancelado").length} pedidos`} color="var(--gold-dark)" />
      <StatCard label="Pedidos pendientes" value={pendientes} sub="Esperando gestión" color="#d97706" />
      <StatCard label="Productos" value={products.length} sub={`${stockBajo} con stock bajo`} color="#2563eb" />
      <StatCard label="Sin stock" value={agotados} sub="Productos sin unidades disponibles" color="#dc2626" />
    </div>
  )
}

function ProductsTab({ onEdit, onDelete, toast, refreshKey }) {
  const [products, setProducts] = useState([])
  const [total, setTotal] = useState(0)
  const [pages, setPages] = useState(1)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [searchInput, setSearchInput] = useState("")
  const [loading, setLoading] = useState(true)

  const load = useCallback(() => {
    setLoading(true)
    getProducts({ search, page, limit: 10 })
      .then((res) => {
        setProducts(res.data.products || [])
        setTotal(res.data.total || 0)
        setPages(res.data.pages || 1)
      })
      .catch(() => toast("error", "No se pudieron cargar los productos"))
      .finally(() => setLoading(false))
  }, [search, page, toast, refreshKey])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load()
  }, [load])

  const submitSearch = (e) => {
    e.preventDefault()
    setPage(1)
    setSearch(searchInput.trim())
  }

  const stockBadge = (p) => {
    if (p.stock === undefined || p.stock === null) return { label: "1 uni", cls: styles.stockOk }
    if (!p.stock || p.stock <= 0) return { label: "Agotado", cls: styles.stockOut }
    if (p.stock === 1) return { label: "Última unidad", cls: styles.stockLow }
    if (p.stock <= 5) return { label: `${p.stock} uni`, cls: styles.stockLow }
    return { label: `${p.stock} uni`, cls: styles.stockOk }
  }

  return (
    <div>
      <form onSubmit={submitSearch} className={styles.searchBar}>
        <input
          style={{ ...s.input, maxWidth: "340px" }}
          placeholder="Buscar por nombre..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button type="submit" style={{ ...s.btn, background: "var(--gold)", color: "white" }}>Buscar</button>
        {search && (
          <button
            type="button"
            style={{ ...s.btn, background: "transparent", color: "var(--text-secondary)", border: "1px solid var(--border)" }}
            onClick={() => { setSearchInput(""); setSearch(""); setPage(1) }}
          >
            Limpiar
          </button>
        )}
      </form>

      {loading ? (
        <div style={{ padding: "24px 0" }}>
          {[0, 1, 2, 3].map((i) => <div key={i} className={`${styles.card} ${styles.skeleton}`} />)}
        </div>
      ) : (
        <>
          <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: "8px 0 12px" }}>{total} productos</p>
          {products.length === 0 && <p style={{ color: "var(--text-secondary)" }}>No hay productos</p>}
          {products.map((p) => {
            const stock = stockBadge(p)
            return (
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
                  <span className={stock.cls}>{stock.label}</span>
                  <span style={s.badge}>{p.subcategoria}</span>
                  <div className={styles.productActions}>
                    <button onClick={() => onEdit(p)} style={{ ...s.btn, background: "var(--border-light)", color: "var(--text)" }}>Editar</button>
                    <button onClick={() => onDelete(p)} style={{ ...s.btn, background: "#fee2e2", color: "#dc2626" }}>Eliminar</button>
                  </div>
                </div>
              </div>
            )
          })}

          {pages > 1 && (
            <div className={styles.pagination}>
              <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} style={{ ...s.btn, background: "var(--border-light)", color: "var(--text)" }}>← Anterior</button>
              <span style={{ fontFamily: "var(--ui)", fontSize: "13px", color: "var(--text-secondary)" }}>Página {page} de {pages}</span>
              <button disabled={page >= pages} onClick={() => setPage((p) => p + 1)} style={{ ...s.btn, background: "var(--border-light)", color: "var(--text)" }}>Siguiente →</button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

function OrdersTab({ orders, loading, onEstadoChange }) {
  const [search, setSearch] = useState("")
  const [estadoFilter, setEstadoFilter] = useState("")

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const q = search.trim().toLowerCase()
      const matchQ = !q ||
        (o.cliente?.nombre || "").toLowerCase().includes(q) ||
        (o.cliente?.apellido || "").toLowerCase().includes(q) ||
        (o.cliente?.email || "").toLowerCase().includes(q)
      const matchE = !estadoFilter || o.estado === estadoFilter
      return matchQ && matchE
    })
  }, [orders, search, estadoFilter])

  return (
    <div>
      <div className={styles.searchBar}>
        <input
          style={{ ...s.input, maxWidth: "300px" }}
          placeholder="Buscar por cliente o email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          style={{ ...s.select, width: "auto" }}
          value={estadoFilter}
          onChange={(e) => setEstadoFilter(e.target.value)}
        >
          <option value="">Todos los estados</option>
          {ESTADOS.map((est) => <option key={est} value={est}>{est}</option>)}
        </select>
      </div>

      {loading ? (
        <div style={{ padding: "24px 0" }}>
          {[0, 1, 2].map((i) => <div key={i} className={`${styles.card} ${styles.skeleton}`} />)}
        </div>
      ) : (
        <>
          <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: "8px 0 12px" }}>{filtered.length} pedidos</p>
          {filtered.length === 0 && <p style={{ color: "var(--text-secondary)" }}>No hay pedidos</p>}
          {filtered.map((o) => <OrderCard key={o._id} order={o} onEstadoChange={onEstadoChange} />)}
        </>
      )}
    </div>
  )
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [tab, setTab] = useState("resumen")
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [loadingOrders, setLoadingOrders] = useState(true)
  const [loadingResumen, setLoadingResumen] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [showBulk, setShowBulk] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [toastMsg, setToastMsg] = useState(null)
  const [confirm, setConfirm] = useState(null)
  const [refreshKey, setRefreshKey] = useState(0)
  const prevOrdersRef = useRef([])
  const firstLoadDoneRef = useRef(false)

  const toast = useCallback((type, msg) => {
    setToastMsg({ type, msg })
    window.setTimeout(() => setToastMsg(null), 3500)
  }, [])

  const loadOrders = useCallback(() => {
    setLoadingOrders(true)
    getPedidos()
      .then((res) => {
        const data = res.data || []
        setOrders(data)
        prevOrdersRef.current = data
        firstLoadDoneRef.current = true
      })
      .catch(() => toast("error", "No se pudieron cargar los pedidos"))
      .finally(() => setLoadingOrders(false))
  }, [toast])

  const pollOrders = useCallback(() => {
    getPedidos()
      .then((res) => {
        const data = res.data || []
        setOrders(data)

        if (firstLoadDoneRef.current) {
          const prevIds = new Set(prevOrdersRef.current.map((o) => o._id))
          const nuevos = data.filter((o) => !prevIds.has(o._id))
          if (nuevos.length > 0) {
            const numeros = nuevos.map((o) => `#${String(o._id).slice(-8)}`).join(", ")
            toast("success", `📦 ${nuevos.length} pedido${nuevos.length > 1 ? "s" : ""} nuevo${nuevos.length > 1 ? "s" : ""}: ${numeros}`)
            sonidoPedido()
          }
        }

        prevOrdersRef.current = data
      })
      .catch(() => {})
  }, [toast])

  const loadResumenProducts = useCallback(() => {
    setLoadingResumen(true)
    getProducts({ limit: 1000 })
      .then((res) => setProducts(res.data.products || []))
      .catch(() => toast("error", "No se pudieron cargar los productos"))
      .finally(() => setLoadingResumen(false))
  }, [toast])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadOrders()
  }, [loadOrders])

  useEffect(() => {
    const id = window.setInterval(() => {
      if (document.visibilityState === "hidden") return
      pollOrders()
    }, 25000)
    return () => window.clearInterval(id)
  }, [pollOrders])

  useEffect(() => {
    if (tab === "resumen") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      loadResumenProducts()
    }
  }, [tab, loadResumenProducts])

  const handleDelete = async (p) => {
    setConfirm({
      text: `¿Eliminar "${p.nombre}"? Esta acción no se puede deshacer.`,
      action: async () => {
        try {
          await deleteProduct(p._id)
          toast("success", "Producto eliminado")
          setConfirm(null)
          if (tab === "resumen") loadResumenProducts()
        } catch {
          setConfirm(null)
          toast("error", "Error al eliminar producto")
        }
      },
    })
  }

  const handleEstadoChange = async (id, estado) => {
    try {
      await updatePedidoEstado(id, estado)
      setOrders((prev) => prev.map((o) => o._id === id ? { ...o, estado } : o))
      toast("success", "Estado actualizado")
    } catch {
      toast("error", "No se pudo actualizar el estado")
    }
  }

  const handleSaveProduct = ({ error } = {}) => {
    setShowForm(false)
    setEditingProduct(null)
    if (error) {
      toast("error", "Error al guardar producto")
    } else {
      toast("success", "Producto guardado")
      setRefreshKey((k) => k + 1)
      if (tab === "resumen") loadResumenProducts()
    }
  }

  return (
    <div className={styles.adminContainer}>
      <Toast toast={toastMsg} onClose={() => setToastMsg(null)} />

      <div className={styles.adminHeader}>
        <h1 style={s.title}>Panel de Administración</h1>
        <div className={styles.headerButtons}>
          <button onClick={() => { setShowForm(true); setEditingProduct(null) }} style={{ ...s.btn, background: "var(--gold)", color: "white" }}>
            + Nuevo Producto
          </button>
          <button onClick={() => setShowBulk(true)} style={{ ...s.btn, background: "white", color: "var(--gold-dark)", border: "2px solid var(--gold)" }}>
            Carga múltiple
          </button>
          <button onClick={() => navigate("/")} style={{ ...s.btn, background: "transparent", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>
            ← Tienda
          </button>
        </div>
      </div>

      <div className={styles.adminTabs}>
        <button style={{ ...s.tab, ...(tab === "resumen" ? s.tabActive : {}) }} onClick={() => setTab("resumen")}>Resumen</button>
        <button style={{ ...s.tab, ...(tab === "products" ? s.tabActive : {}) }} onClick={() => setTab("products")}>Productos</button>
        <button style={{ ...s.tab, ...(tab === "orders" ? s.tabActive : {}) }} onClick={() => setTab("orders")}>Pedidos</button>
        <button style={{ ...s.tab, ...(tab === "venta" ? s.tabActive : {}) }} onClick={() => setTab("venta")}>Venta</button>
      </div>

      {tab === "resumen" && <Resumen orders={orders} products={products} loading={loadingResumen} />}

      {tab === "products" && (
        <ProductsTab
          toast={toast}
          refreshKey={refreshKey}
          onEdit={(p) => { setEditingProduct(p); setShowForm(true) }}
          onDelete={handleDelete}
        />
      )}

      {tab === "orders" && (
        <OrdersTab orders={orders} loading={loadingOrders} onEstadoChange={handleEstadoChange} />
      )}

      {tab === "venta" && <CajaVenta toast={toast} />}

      {showForm && (
        <ProductForm
          product={editingProduct}
          onSave={() => { setShowForm(false); setRefreshKey((k) => k + 1) }}
          onClose={() => { setShowForm(false); setEditingProduct(null) }}
        />
      )}

      {showBulk && (
        <BulkProductForm
          onSave={() => setRefreshKey((k) => k + 1)}
          onClose={() => setShowBulk(false)}
        />
      )}

      {confirm && (
        <ConfirmDialog
          text={confirm.text}
          onConfirm={confirm.action}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  )
}
