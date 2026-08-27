import { useState, useEffect, useMemo, useCallback } from "react"
import { getProducts } from "../../../api/products.api"
import { crearPedido } from "../../../api/orders.api"
import { generarTicketPDF } from "./posTicket"
import styles from "../AdminDashboard.module.css"

const s = {
  search: { width: "100%", padding: "10px 12px", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", fontFamily: "var(--body)", fontSize: "14px", outline: "none", boxSizing: "border-box" },
  btn: { padding: "10px 16px", border: "none", borderRadius: "var(--radius-sm)", fontFamily: "var(--ui)", fontSize: "13px", fontWeight: 600, cursor: "pointer", transition: "all 200ms ease" },
  qty: { width: "34px", height: "30px", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", background: "white", fontFamily: "var(--body)", fontSize: "14px", textAlign: "center", outline: "none" },
  radio: { display: "flex", alignItems: "center", gap: "8px", padding: "10px 14px", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", cursor: "pointer", fontFamily: "var(--ui)", fontSize: "13px", fontWeight: 600, transition: "all 200ms ease" },
  radioActive: { background: "var(--gold)", color: "white", borderColor: "var(--gold)" },
}

// stock general de un producto: suma de sus variantes si las tiene, si no su stock
const stockGeneral = (p) => {
  if (Array.isArray(p?.variantes) && p.variantes.length > 0) {
    return p.variantes.reduce((acc, v) => acc + (Number(v.stock) || 0), 0)
  }
  return p?.stock
}

// stock de una variante puntual (null si no tiene variantes / no se encuentra)
const stockDeVariante = (p, variante) => {
  if (Array.isArray(p?.variantes) && variante) {
    const v = p.variantes.find((x) => x.nombre === variante)
    return v ? Number(v.stock) || 0 : null
  }
  return null
}

function BadgeStock({ p }) {
  const s = stockGeneral(p)
  if (s === undefined || s === null) return <span className={styles.stockOk}>1 uni</span>
  if (!s || s <= 0) return <span className={styles.stockOut}>Agotado</span>
  if (s === 1) return <span className={styles.stockLow}>Última unidad</span>
  if (s <= 5) return <span className={styles.stockLow}>{s} uni</span>
  return <span className={styles.stockOk}>{s} uni</span>
}

const posKey = (item) => `${item.product._id}__${item.variante || ""}`

function ProductGrid({ products, cart, onPick }) {
  return (
    <div className={styles.posGrid}>
      {products.length === 0 && <p style={{ color: "var(--text-secondary)", gridColumn: "1 / -1" }}>No hay productos</p>}
      {products.map((p) => {
        const enCarrito = cart
          .filter((i) => i.product._id === p._id)
          .reduce((acc, i) => acc + i.cantidad, 0)
        const totStock = stockGeneral(p)
        const sinStock = Number(totStock) <= 0
        const sinMas = Number(totStock) > 0 && enCarrito >= Number(totStock)
        return (
          <button
            key={p._id}
            type="button"
            disabled={sinStock}
            className={`${styles.posProduct} ${sinStock ? styles.posProductDisabled : ""}`}
            onClick={() => onPick(p)}
          >
            {p.images?.[0] && <img src={p.images[0].url} alt={p.nombre} className={styles.posProductImg} />}
            <div className={styles.posProductInfo}>
              <strong className={styles.posProductName}>{p.nombre}</strong>
              {p.variantes?.length > 0 && (
                <span style={{ fontFamily: "var(--ui)", fontSize: "11px", color: "var(--text-secondary)" }}>
                  {p.variantes.map((v) => v.nombre).join(" · ")}
                </span>
              )}
              <div className={styles.posProductRow}>
                <span className={styles.posProductPrice}>${p.precio?.toLocaleString()}</span>
                <BadgeStock p={p} />
              </div>
            </div>
            {sinMas && !sinStock && <span className={styles.posSinMas}>Máx.</span>}
          </button>
        )
      })}
    </div>
  )
}

function CartItem({ item, onInc, onDec, onRemove }) {
  return (
    <div className={styles.posCartItem}>
      <div className={styles.posCartItemInfo}>
        <span className={styles.posCartItemName}>
          {item.product.nombre}
          {item.variante && ` · ${item.variante}`}
        </span>
        <span className={styles.posCartItemPrice}>${(item.product.precio * item.cantidad).toLocaleString()}</span>
      </div>
      <div className={styles.posCartActions}>
        <button className={styles.posQtyBtn} onClick={() => onDec(posKey(item))}>−</button>
        <input className={s.qty} value={item.cantidad} readOnly />
        <button className={styles.posQtyBtn} onClick={() => onInc(posKey(item))}>+</button>
        <button className={styles.posRemove} onClick={() => onRemove(posKey(item))}>✕</button>
      </div>
    </div>
  )
}

export default function CajaVenta({ toast }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [cart, setCart] = useState([])
  const [clienteNombre, setClienteNombre] = useState("")
  const [pago, setPago] = useState("")
  const [montoRecibido, setMontoRecibido] = useState("")
  const [cobrando, setCobrando] = useState(false)
  const [showSidebar, setShowSidebar] = useState(false)
  const [variantePicker, setVariantePicker] = useState(null)

  const load = useCallback(() => {
    setLoading(true)
    getProducts({ limit: 1000 })
      .then((res) => setProducts(res.data.products || []))
      .catch(() => toast("error", "No se pudieron cargar los productos"))
      .finally(() => setLoading(false))
  }, [toast])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load()
  }, [load])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return products
    return products.filter((p) => (p.nombre || "").toLowerCase().includes(q))
  }, [products, search])

  const total = useMemo(() => cart.reduce((acc, i) => acc + i.product.precio * i.cantidad, 0), [cart])
  const monto = parseFloat(montoRecibido)
  const vuelto = Number.isFinite(monto) ? monto - total : null
  const vueltoValido = pago === "efectivo" && vuelto !== null && vuelto < 0

  const addProduct = (p, variante) => {
    setCart((prev) => {
      const existe = prev.find((i) => posKey(i) === `${p._id}__${variante || ""}`)
      const limite = stockDeVariante(p, variante) ?? stockGeneral(p)
      if (existe) {
        if (Number(limite) > 0 && existe.cantidad >= Number(limite)) return prev
        return prev.map((i) => (posKey(i) === `${p._id}__${variante || ""}` ? { ...i, cantidad: i.cantidad + 1 } : i))
      }
      return [...prev, { product: p, variante, cantidad: 1, limite }]
    })
    setVariantePicker(null)
    setShowSidebar(false)
  }

  // si el producto tiene variantes, primero se elige cuál
  const pickProduct = (p) => {
    if (p.variantes?.length > 0) {
      setVariantePicker(p)
    } else {
      addProduct(p)
    }
  }

  const inc = (key) => setCart((prev) => prev.map((i) => {
    if (posKey(i) !== key) return i
    const limite = i.limite
    if (Number(limite) > 0 && i.cantidad >= Number(limite)) return i
    return { ...i, cantidad: i.cantidad + 1 }
  }))

  const dec = (key) => setCart((prev) => prev
    .map((i) => (posKey(i) === key ? { ...i, cantidad: i.cantidad - 1 } : i))
    .filter((i) => i.cantidad > 0))

  const remove = (key) => setCart((prev) => prev.filter((i) => posKey(i) !== key))

  const cobrar = async () => {
    if (cart.length === 0) return toast("error", "Agregá al menos un producto")
    if (!pago) return toast("error", "Seleccioná la forma de pago")
    if (vueltoValido) return toast("error", "El monto recibido es menor al total")

    const pedido = {
      origen: "presencial",
      cliente: {
        nombre: clienteNombre.trim() || "Venta presencial",
        apellido: "",
        email: "venta@presencial.local",
        telefono: "",
        direccion: "Local",
      },
      productos: cart.map((i) => ({ ...i.product, variante: i.variante, cantidad: i.cantidad })),
      entrega: "retiro",
      pago,
      total,
    }

    setCobrando(true)
    try {
      const { data } = await crearPedido(pedido)
      const recibido = pago === "efectivo" && Number.isFinite(monto) ? monto : null
      try {
        generarTicketPDF(data, { montoRecibido: recibido, vuelto: recibido !== null ? recibido - total : null })
        toast("success", "Venta registrada y ticket generado")
      } catch (e) {
        console.error("Error generando el ticket PDF:", e)
        toast("success", "Venta registrada (no se pudo generar el PDF)")
      }
      setCart([])
      setClienteNombre("")
      setPago("")
      setMontoRecibido("")
      load()
    } catch (error) {
      const msg = error.response?.data?.error || error.message || "Error al registrar la venta"
      toast("error", msg)
    } finally {
      setCobrando(false)
    }
  }

  const catalogContent = (
    <>
      <div className={styles.posCatalogSearch}>
        <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "14px", flexWrap: "wrap" }}>
          <input
            className={s.search}
            style={{ flex: 1, minWidth: 0 }}
            placeholder="Buscar producto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span style={{ fontFamily: "var(--ui)", fontSize: "13px", color: "var(--text-secondary)" }}>
            {loading ? "Cargando..." : `${filtered.length} productos`}
          </span>
        </div>
      </div>
      <div className={styles.posProductGridWrapper}>
        <ProductGrid products={filtered} cart={cart} onPick={pickProduct} />
      </div>
    </>
  )

  return (
    <div className={styles.posLayout}>
      {/* Desktop catalog */}
      <div className={styles.posCatalog}>
        {catalogContent}
      </div>

      {/* Mobile sidebar */}
      <div
        className={`${styles.posCatalogSidebar} ${showSidebar ? styles.posCatalogSidebarOpen : ""}`}
      >
        <div className={styles.posCatalogSidebarHeader}>
          <strong style={{ fontFamily: "var(--heading)", fontSize: "16px" }}>Productos</strong>
          <button className={styles.posCatalogSidebarClose} onClick={() => setShowSidebar(false)}>✕</button>
        </div>
        {catalogContent}
      </div>

      {/* Overlay */}
      <div
        className={`${styles.posSidebarOverlay} ${showSidebar ? styles.posSidebarOverlayOpen : ""}`}
        onClick={() => setShowSidebar(false)}
      />

      {/* Toggle button (mobile) */}
      <button
        className={styles.posSidebarToggle}
        onClick={() => setShowSidebar(true)}
      >
        ☰ Productos{cart.length > 0 ? ` (${cart.length})` : ""}
      </button>

      {/* Cart panel */}
      <div className={styles.posCartPanel}>
        <h3 style={{ fontFamily: "var(--heading)", fontSize: "18px", margin: "0 0 12px" }}>Venta actual</h3>

        <div>
          <div style={{ fontFamily: "var(--ui)", fontSize: "13px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "6px" }}>Nombre del cliente (opcional)</div>
          <input
            className={s.search}
            type="text"
            placeholder="Ej: María García"
            value={clienteNombre}
            onChange={(e) => setClienteNombre(e.target.value)}
          />
        </div>

        <div className={styles.posCartList}>
          {cart.length === 0 && (
            <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
              Tocá "Productos" para agregar items.
            </p>
          )}
          {cart.map((i) => (
            <CartItem key={posKey(i)} item={i} onInc={inc} onDec={dec} onRemove={remove} />
          ))}
        </div>

        <div className={styles.posCartFooter}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <strong style={{ fontFamily: "var(--subheading)", fontSize: "20px" }}>Total</strong>
            <strong style={{ fontFamily: "var(--subheading)", fontSize: "24px", color: "var(--gold-dark)" }}>
              ${total.toLocaleString()}
            </strong>
          </div>

          <div>
            <div style={{ fontFamily: "var(--ui)", fontSize: "13px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "8px" }}>Forma de pago</div>
            <div className={styles.posPayRow}>
              <button
                type="button"
                className={styles.posPayOption}
                style={pago === "efectivo" ? s.radioActive : undefined}
                onClick={() => setPago("efectivo")}
              >
                Efectivo
              </button>
              <button
                type="button"
                className={styles.posPayOption}
                style={pago === "transferencia" ? s.radioActive : undefined}
                onClick={() => setPago("transferencia")}
              >
                Transferencia
              </button>
            </div>
          </div>

          {pago === "efectivo" && (
            <div>
              <div style={{ fontFamily: "var(--ui)", fontSize: "13px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "6px" }}>Monto recibido</div>
              <input
                className={s.search}
                type="number"
                min="0"
                step="0.01"
                placeholder="Ej: 5000"
                value={montoRecibido}
                onChange={(e) => setMontoRecibido(e.target.value)}
              />
              {Number.isFinite(monto) && (
                <div style={{ marginTop: "8px", fontFamily: "var(--ui)", fontSize: "14px", fontWeight: 700, color: vueltoValido ? "#dc2626" : "#16a34a" }}>
                  {vueltoValido ? "Falta $" + Math.abs(vuelto).toLocaleString() : `Vuelto: $${vuelto.toLocaleString()}`}
                </div>
              )}
            </div>
          )}

          <button
            className={styles.posCobrarBtn}
            onClick={cobrar}
            disabled={cobrando}
            style={cobrando ? { opacity: 0.6, cursor: "not-allowed" } : undefined}
          >
            {cobrando ? "Procesando..." : "Cobrar y emitir ticket"}
          </button>
        </div>
      </div>

      {/* Picker de variante */}
      {variantePicker && (
        <div style={s.overlay} onClick={() => setVariantePicker(null)}>
          <div
            style={{ background: "white", borderRadius: "var(--radius-md)", padding: "24px", maxWidth: "360px", width: "90%" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontFamily: "var(--heading)", fontSize: "18px", margin: "0 0 6px" }}>
              {variantePicker.nombre}
            </h3>
            <p style={{ fontFamily: "var(--ui)", fontSize: "13px", color: "var(--text-secondary)", margin: "0 0 14px" }}>
              Elegí la variante:
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "16px" }}>
              {variantePicker.variantes.map((v) => {
                const agotada = (Number(v.stock) || 0) <= 0
                return (
                  <button
                    key={v.nombre}
                    type="button"
                    disabled={agotada}
                    className={agotada ? `${styles.posPayOption} ${styles.posPayOptionDisabled}` : styles.posPayOption}
                    onClick={() => addProduct(variantePicker, v.nombre)}
                  >
                    {v.nombre}{agotada ? "" : ` · ${Number(v.stock) || 0} uni`}
                  </button>
                )
              })}
            </div>
            <button
              type="button"
              onClick={() => setVariantePicker(null)}
              style={{ ...s.btn, background: "var(--border-light)", color: "var(--text)" }}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
