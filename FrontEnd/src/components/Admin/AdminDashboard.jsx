import { useState, useEffect, useMemo, useRef, useCallback } from "react"
import { getProducts, createProduct, updateProduct, deleteProduct } from "../../api/products.api"
import { getPedidos, updatePedidoEstado } from "../../api/orders.api"
import { getCarousel, uploadCarouselImages, deleteCarouselImage } from "../../api/carousel.api"
import { getUsers } from "../../api/users.api"
import { useNavigate } from "react-router-dom"
import { CATEGORIAS, getSubcategoriasDe } from "../../config/categories"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
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

// stock efectivo de un producto: suma de sus variantes si las tiene, si no su stock general
const stockEfectivo = (p) => {
  if (Array.isArray(p?.variantes) && p.variantes.length > 0) {
    return p.variantes.reduce((acc, v) => acc + (Number(v.stock) || 0), 0)
  }
  return p?.stock
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
  // cada variante: { nombre, stock, ref: "url:<imageUrl>" | "file:<index>" | "", }
  const [variantes, setVariantes] = useState(
    (product?.variantes || []).map((v) => ({
      nombre: v.nombre,
      stock: v.stock ?? 0,
      ref: v.imageUrl ? `url:${v.imageUrl}` : "",
    }))
  )
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

  const removeExisting = (id) => {
    const img = existingImages.find((i) => i.cloudinary_id === id)
    setExistingImages((prev) => prev.filter((i) => i.cloudinary_id !== id))
    if (img) {
      // si una variante usaba esa imagen, se desasocia
      const ref = `url:${img.url}`
      setVariantes((prev) => prev.map((v) => (v.ref === ref ? { ...v, ref: "" } : v)))
    }
  }
  const removeNew = (i) => {
    const removed = newFiles[i]
    if (removed) {
      URL.revokeObjectURL(removed.preview)
      previewUrlsRef.current = previewUrlsRef.current.filter((u) => u !== removed.preview)
    }
    // reindexar las referencias file: de las variantes
    setVariantes((vs) => vs.map((v) => {
      if (!v.ref.startsWith("file:")) return v
      const idx = Number(v.ref.slice(5))
      if (idx === i) return { ...v, ref: "" }
      if (idx > i) return { ...v, ref: `file:${idx - 1}` }
      return v
    }))
    setNewFiles((prev) => prev.filter((_, idx) => idx !== i))
  }

  const addVariante = () => setVariantes((prev) => [...prev, { nombre: "", stock: "", ref: "" }])
  const removeVariante = (i) => setVariantes((prev) => prev.filter((_, idx) => idx !== i))
  const updateVariante = (i, field, value) =>
    setVariantes((prev) => prev.map((v, idx) => (idx === i ? { ...v, [field]: value } : v)))

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

      // variantes: ref "url:x" → imageUrl directo; "file:n" → índice entre las imágenes nuevas
      const variantesPayload = variantes
        .filter((v) => v.nombre.trim())
        .map((v) => {
          const stock = Number(v.stock)
          const base = { nombre: v.nombre.trim(), stock: Number.isFinite(stock) ? stock : 0 }
          if (v.ref.startsWith("file:")) {
            return { ...base, fileIndex: Number(v.ref.slice(5)) }
          }
          if (v.ref.startsWith("url:")) {
            return { ...base, imageUrl: v.ref.slice(4) }
          }
          return base
        })
      fd.append("variantes", JSON.stringify(variantesPayload))

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
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
              <div style={s.label}>Variantes (tamaño / modelo) — opcional</div>
              <button type="button" onClick={addVariante} style={{ ...s.btn, background: "var(--border-light)", color: "var(--text)" }}>
                + Agregar variante
              </button>
            </div>
            {variantes.length === 0 && (
              <p style={{ fontFamily: "var(--ui)", fontSize: "12px", color: "var(--text-secondary)", margin: 0 }}>
                Ej: para un mismo aro en varios tamaños: "10 mm", "12 mm", "15 mm". El precio es compartido y cada variante tiene su propio stock.
              </p>
            )}
            {variantes.map((v, i) => (
              <div key={i} style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "8px" }}>
                <input
                  style={{ ...s.input, flex: 1 }}
                  placeholder="Ej: 10 mm"
                  value={v.nombre}
                  onChange={(e) => updateVariante(i, "nombre", e.target.value)}
                />
                <input
                  style={{ ...s.input, flex: 0.4, minWidth: "70px" }}
                  type="number"
                  step="1"
                  min="0"
                  placeholder="Stock"
                  title="Stock de esta variante"
                  value={v.stock}
                  onChange={(e) => updateVariante(i, "stock", e.target.value)}
                />
                <select
                  style={{ ...s.select, flex: 1 }}
                  value={v.ref}
                  onChange={(e) => updateVariante(i, "ref", e.target.value)}
                >
                  <option value="">Sin imagen propia</option>
                  {existingImages.map((img, idx) => (
                    <option key={img.cloudinary_id} value={`url:${img.url}`}>Foto {idx + 1}</option>
                  ))}
                  {newFiles.map((f, idx) => (
                    <option key={idx} value={`file:${idx}`}>Nueva foto {idx + 1}</option>
                  ))}
                </select>
                {(() => {
                  const thumb = v.ref.startsWith("file:")
                    ? newFiles[Number(v.ref.slice(5))]?.preview
                    : v.ref.startsWith("url:") ? v.ref.slice(4) : null
                  return thumb
                    ? <img src={thumb} alt="" style={{ width: "32px", height: "32px", objectFit: "cover", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)" }} />
                    : null
                })()}
                <button type="button" onClick={() => removeVariante(i)} style={{ ...s.btn, background: "#fee2e2", color: "#dc2626" }}>✕</button>
              </div>
            ))}
          </div>
          <button type="submit" disabled={saving} style={{ ...s.btn, background: "var(--gold)", color: "white", padding: "12px", fontSize: "14px", marginTop: "8px" }}>
            {saving ? "Guardando..." : product ? "Actualizar Producto" : "Crear Producto"}
          </button>
        </form>
      </div>
    </div>
  )
}

function CarouselTab({ toast }) {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [newFiles, setNewFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const [confirm, setConfirm] = useState(null)
  const previewUrlsRef = useRef([])

  const load = useCallback(() => {
    setLoading(true)
    getCarousel()
      .then((res) => setImages(res.data || []))
      .catch(() => toast("error", "No se pudo cargar el carrusel"))
      .finally(() => setLoading(false))
  }, [toast])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load()
  }, [load])

  useEffect(() => {
    return () => {
      previewUrlsRef.current.forEach((u) => URL.revokeObjectURL(u))
      previewUrlsRef.current = []
    }
  }, [])

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

  const removeNew = (i) => {
    setNewFiles((prev) => {
      URL.revokeObjectURL(prev[i].preview)
      previewUrlsRef.current = previewUrlsRef.current.filter((u) => u !== prev[i].preview)
      return prev.filter((_, idx) => idx !== i)
    })
  }

  const handleUpload = async () => {
    if (newFiles.length === 0) return
    setUploading(true)
    try {
      const fd = new FormData()
      newFiles.forEach(({ file }) => fd.append("images", file))
      await uploadCarouselImages(fd)
      toast("success", "Imágenes subidas al carrusel")
      newFiles.forEach(({ preview }) => {
        URL.revokeObjectURL(preview)
        previewUrlsRef.current = previewUrlsRef.current.filter((u) => u !== preview)
      })
      setNewFiles([])
      load()
    } catch {
      toast("error", "Error al subir imágenes")
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = (img) => {
    setConfirm({
      text: "¿Eliminar esta imagen del carrusel? Esta acción no se puede deshacer.",
      action: async () => {
        try {
          await deleteCarouselImage(img.cloudinary_id)
          setImages((prev) => prev.filter((i) => i.cloudinary_id !== img.cloudinary_id))
          toast("success", "Imagen eliminada")
        } catch {
          toast("error", "Error al eliminar la imagen")
        } finally {
          setConfirm(null)
        }
      },
    })
  }

  return (
    <div>
      <div className={styles.carouselHeader}>
        <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: 0 }}>
          {loading ? "" : `${images.length} imagen(es) en el carrusel principal`}
        </p>
        <div className={styles.carouselActions}>
          <input type="file" multiple accept="image/*" onChange={addFiles} style={{ fontFamily: "var(--body)", fontSize: "13px" }} />
          <button
            onClick={handleUpload}
            disabled={uploading || newFiles.length === 0}
            style={{ ...s.btn, background: "var(--gold)", color: "white", opacity: uploading || newFiles.length === 0 ? 0.5 : 1, cursor: uploading || newFiles.length === 0 ? "not-allowed" : "pointer" }}
          >
            {uploading ? `Subiendo (${newFiles.length})...` : `+ Subir imágenes${newFiles.length > 0 ? ` (${newFiles.length})` : ""}`}
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: "24px 0" }}>
          {[0, 1, 2].map((i) => <div key={i} className={`${styles.card} ${styles.skeleton}`} />)}
        </div>
      ) : (
        <>
          {images.length === 0 && (
            <div className={styles.resumenEmpty}>
              No hay imágenes guardadas. La tienda muestra las imágenes locales por defecto hasta que subas las primeras.
            </div>
          )}
          {(images.length > 0 || newFiles.length > 0) && (
            <div className={styles.imgGrid}>
              {images.map((img) => (
                <div key={img.cloudinary_id} className={styles.imgThumb}>
                  <img src={img.url} alt="Carrusel" />
                  <button type="button" className={styles.imgRemove} onClick={() => handleDelete(img)}>✕</button>
                </div>
              ))}
              {newFiles.map((f, i) => (
                <div key={`new-${i}`} className={styles.imgThumb}>
                  <img src={f.preview} alt="" style={{ opacity: 0.7 }} />
                  <button type="button" className={styles.imgRemove} onClick={() => removeNew(i)}>✕</button>
                  <span style={{ position: "absolute", bottom: "4px", left: "4px", background: "rgba(0,0,0,0.65)", color: "white", fontSize: "10px", padding: "2px 6px", borderRadius: "4px", fontFamily: "var(--ui)" }}>nueva</span>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {confirm && (
        <ConfirmDialog text={confirm.text} onConfirm={confirm.action} onCancel={() => setConfirm(null)} />
      )}
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
                <span>{p.nombre}{p.variante && <span style={{ color: "var(--text-secondary)" }}> · {p.variante}</span>} <span style={{ color: "var(--text-muted)" }}>x{p.cantidad}</span></span>
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
  const [mesFiltro, setMesFiltro] = useState("")
  const [catFiltro, setCatFiltro] = useState("")
  const [prodFiltro, setProdFiltro] = useState("")

  const mesesDisponibles = useMemo(() => {
    const mapa = {}
    orders.forEach((o) => {
      const f = new Date(o.fecha)
      const key = `${f.getFullYear()}-${String(f.getMonth() + 1).padStart(2, "0")}`
      const label = f.toLocaleDateString("es-AR", { year: "numeric", month: "long" })
      if (!mapa[key]) mapa[key] = label
    })
    return Object.entries(mapa).sort((a, b) => b[0].localeCompare(a[0])).map(([value, label]) => ({ value, label }))
  }, [orders])

  const productosDisponibles = useMemo(() => {
    const set = new Set()
    orders.forEach((o) => o.productos?.forEach((p) => { if (p.nombre) set.add(p.nombre) }))
    return [...set].sort()
  }, [orders])

  const pedidosFiltrados = useMemo(() => {
    return orders.filter((o) => {
      if (o.estado === "cancelado") return false
      if (mesFiltro) {
        const f = new Date(o.fecha)
        const key = `${f.getFullYear()}-${String(f.getMonth() + 1).padStart(2, "0")}`
        if (key !== mesFiltro) return false
      }
      if (catFiltro) {
        const tiene = o.productos?.some((p) => p.categoria === catFiltro)
        if (!tiene) return false
      }
      if (prodFiltro) {
        const q = prodFiltro.toLowerCase()
        const tiene = o.productos?.some((p) => (p.nombre || "").toLowerCase().includes(q))
        if (!tiene) return false
      }
      return true
    })
  }, [orders, mesFiltro, catFiltro, prodFiltro])

  const ventas = pedidosFiltrados.reduce((acc, o) => acc + (o.total || 0), 0)
  const pendientes = pedidosFiltrados.filter((o) => o.estado === "pendiente").length
  const stockBajo = products.filter((p) => { const s = stockEfectivo(p); return Number.isFinite(s) && s > 0 && s <= 5 }).length
  const agotados = products.filter((p) => { const s = stockEfectivo(p); return Number.isFinite(s) && s <= 0 }).length

  const chartData = useMemo(() => {
    if (pedidosFiltrados.length === 0) return []
    const mapa = {}
    pedidosFiltrados.forEach((o) => {
      const f = new Date(o.fecha)
      const key = `${f.getFullYear()}-${String(f.getMonth() + 1).padStart(2, "0")}`
      const label = f.toLocaleDateString("es-AR", { month: "short", year: "2-digit" })
      if (!mapa[key]) mapa[key] = { mes: label, total: 0 }
      mapa[key].total += o.total || 0
    })
    return Object.values(mapa).sort((a, b) => {
      const ka = Object.keys(mapa).find((k) => mapa[k] === a)
      const kb = Object.keys(mapa).find((k) => mapa[k] === b)
      return ka.localeCompare(kb)
    })
  }, [pedidosFiltrados])

  const hayFiltro = mesFiltro || catFiltro || prodFiltro

  if (loading) return <div style={{ textAlign: "center", padding: "40px", color: "var(--text-secondary)" }}>Cargando...</div>

  return (
    <>
      <div className={styles.resumenFilters}>
        <select className={styles.resumenSelect} value={mesFiltro} onChange={(e) => setMesFiltro(e.target.value)}>
          <option value="">Todos los meses</option>
          {mesesDisponibles.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
        </select>
        <select className={styles.resumenSelect} value={catFiltro} onChange={(e) => setCatFiltro(e.target.value)}>
          <option value="">Todas las categorías</option>
          {CATEGORIAS.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select className={styles.resumenSelect} value={prodFiltro} onChange={(e) => setProdFiltro(e.target.value)}>
          <option value="">Todos los productos</option>
          {productosDisponibles.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
        {hayFiltro && (
          <button className={styles.resumenClear} onClick={() => { setMesFiltro(""); setCatFiltro(""); setProdFiltro("") }}>
            Limpiar filtros
          </button>
        )}
      </div>

      <div className={styles.statsGrid}>
        <StatCard label="Ventas totales" value={`$${ventas.toLocaleString()}`} sub={`${pedidosFiltrados.length} pedidos`} color="var(--gold-dark)" />
        <StatCard label="Pedidos pendientes" value={pendientes} sub="Esperando gestión" color="#d97706" />
        <StatCard label="Productos" value={products.length} sub={`${stockBajo} con stock bajo`} color="#2563eb" />
        <StatCard label="Sin stock" value={agotados} sub="Productos sin unidades disponibles" color="#dc2626" />
      </div>

      {chartData.length > 0 && (
        <div className={styles.resumenChart}>
          <h3 style={{ fontFamily: "var(--heading)", fontSize: "16px", margin: "0 0 14px" }}>Ventas por mes</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={chartData} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
              <XAxis dataKey="mes" tick={{ fontSize: 11, fill: "var(--text-secondary)" }} />
              <YAxis tick={{ fontSize: 11, fill: "var(--text-secondary)" }} />
              <Tooltip formatter={(v) => `$${v.toLocaleString()}`} labelStyle={{ fontSize: 12 }} />
              <Bar dataKey="total" fill="var(--gold)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {pedidosFiltrados.length === 0 && hayFiltro && (
        <div className={styles.resumenEmpty}>No hay ventas con los filtros seleccionados</div>
      )}
    </>
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
    const s = stockEfectivo(p)
    if (s === undefined || s === null) return { label: "1 uni", cls: styles.stockOk }
    if (!s || s <= 0) return { label: "Agotado", cls: styles.stockOut }
    if (s === 1) return { label: "Última unidad", cls: styles.stockLow }
    if (s <= 5) return { label: `${s} uni`, cls: styles.stockLow }
    return { label: `${s} uni`, cls: styles.stockOk }
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

function UsersTab({ toast }) {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    setLoading(true)
    getUsers()
      .then((res) => setUsers(res.data || []))
      .catch(() => toast("error", "No se pudieron cargar los usuarios"))
      .finally(() => setLoading(false))
  }, [toast])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return users
    return users.filter((u) => (u.email || "").toLowerCase().includes(q) || (u.displayName || "").toLowerCase().includes(q))
  }, [users, search])

  const isActive = (lastSignInTime) => {
    if (!lastSignInTime) return false
    const diff = Date.now() - new Date(lastSignInTime).getTime()
    return diff < 30 * 24 * 60 * 60 * 1000
  }

  return (
    <div>
      <div className={styles.searchBar}>
        <input
          style={{ ...s.input, maxWidth: "340px" }}
          placeholder="Buscar por email o nombre..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div style={{ padding: "24px 0" }}>
          {[0, 1, 2].map((i) => <div key={i} className={`${styles.card} ${styles.skeleton}`} />)}
        </div>
      ) : (
        <>
          <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: "8px 0 12px" }}>{filtered.length} usuario(s) registrado(s)</p>
          {filtered.length === 0 && <p style={{ color: "var(--text-secondary)" }}>No se encontraron usuarios</p>}
          {filtered.map((u) => (
            <div key={u.uid} style={s.card}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
                <div style={{ flex: 1, minWidth: "200px" }}>
                  <div style={{ fontFamily: "var(--body)", fontWeight: 600, fontSize: "14px" }}>{u.email}</div>
                  {u.displayName && <div style={{ fontSize: "13px", color: "var(--text-secondary)" }}>{u.displayName}</div>}
                </div>
                <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
                  <span style={{ ...s.badge, background: isActive(u.lastSignInTime) ? "#d4edda" : "#f8f9fa", color: isActive(u.lastSignInTime) ? "#155724" : "#6c757d" }}>
                    {isActive(u.lastSignInTime) ? "Activo" : "Inactivo"}
                  </span>
                  <div style={{ fontSize: "12px", color: "var(--text-secondary)", textAlign: "right" }}>
                    <div>Registro: {u.creationTime ? new Date(u.creationTime).toLocaleDateString("es-AR") : "—"}</div>
                    <div>Último login: {u.lastSignInTime ? new Date(u.lastSignInTime).toLocaleString("es-AR") : "Nunca"}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
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
        <button style={{ ...s.tab, ...(tab === "carousel" ? s.tabActive : {}) }} onClick={() => setTab("carousel")}>Carrusel</button>
        <button style={{ ...s.tab, ...(tab === "users" ? s.tabActive : {}) }} onClick={() => setTab("users")}>Usuarios</button>
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

      {tab === "carousel" && <CarouselTab toast={toast} />}

      {tab === "users" && <UsersTab toast={toast} />}

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
