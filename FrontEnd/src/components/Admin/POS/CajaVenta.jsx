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

function BadgeStock({ p }) {
  if (p.stock === undefined || p.stock === null) return <span className={styles.stockOk}>1 u.</span>
  if (!p.stock || p.stock <= 0) return <span className={styles.stockOut}>Agotado</span>
  if (p.stock <= 5) return <span className={styles.stockLow}>Stock bajo ({p.stock})</span>
  return <span className={styles.stockOk}>{p.stock} u.</span>
}

function ProductGrid({ products, cart, onAdd }) {
  return (
    <div className={styles.posGrid}>
      {products.length === 0 && <p style={{ color: "var(--text-secondary)", gridColumn: "1 / -1" }}>No hay productos</p>}
      {products.map((p) => {
        const enCarrito = cart.find((i) => i.product._id === p._id)?.cantidad || 0
        const sinStock = !Number(p.stock) || Number(p.stock) <= 0
        const sinMas = Number(p.stock) > 0 && enCarrito >= Number(p.stock)
        return (
          <button
            key={p._id}
            type="button"
            disabled={sinStock}
            className={`${styles.posProduct} ${sinStock ? styles.posProductDisabled : ""}`}
            onClick={() => onAdd(p)}
          >
            {p.images?.[0] && <img src={p.images[0].url} alt={p.nombre} className={styles.posProductImg} />}
            <div className={styles.posProductInfo}>
              <strong className={styles.posProductName}>{p.nombre}</strong>
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
        <span className={styles.posCartItemName}>{item.product.nombre}</span>
        <span className={styles.posCartItemPrice}>${(item.product.precio * item.cantidad).toLocaleString()}</span>
      </div>
      <div className={styles.posCartActions}>
        <button className={styles.posQtyBtn} onClick={() => onDec(item.product._id)}>−</button>
        <input className={s.qty} value={item.cantidad} readOnly />
        <button className={styles.posQtyBtn} onClick={() => onInc(item.product._id)}>+</button>
        <button className={styles.posRemove} onClick={() => onRemove(item.product._id)}>✕</button>
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

  const addProduct = (p) => {
    setCart((prev) => {
      const existe = prev.find((i) => i.product._id === p._id)
      if (existe) {
        if (Number(p.stock) > 0 && existe.cantidad >= Number(p.stock)) return prev
        return prev.map((i) => (i.product._id === p._id ? { ...i, cantidad: i.cantidad + 1 } : i))
      }
      return [...prev, { product: p, cantidad: 1 }]
    })
  }

  const inc = (id) => setCart((prev) => prev.map((i) => {
    if (i.product._id !== id) return i
    if (Number(i.product.stock) > 0 && i.cantidad >= Number(i.product.stock)) return i
    return { ...i, cantidad: i.cantidad + 1 }
  }))

  const dec = (id) => setCart((prev) => prev
    .map((i) => (i.product._id === id ? { ...i, cantidad: i.cantidad - 1 } : i))
    .filter((i) => i.cantidad > 0))

  const remove = (id) => setCart((prev) => prev.filter((i) => i.product._id !== id))

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
      productos: cart.map((i) => ({ ...i.product, cantidad: i.cantidad })),
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

  return (
    <div className={styles.posLayout}>
      <div className={styles.posCatalog}>
        <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "14px", flexWrap: "wrap" }}>
          <input
            className={s.search}
            style={{ flex: 1, minWidth: "200px" }}
            placeholder="Buscar producto por nombre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span style={{ fontFamily: "var(--ui)", fontSize: "13px", color: "var(--text-secondary)" }}>
            {loading ? "Cargando..." : `${filtered.length} productos`}
          </span>
        </div>

        <div className={styles.posProductGridWrapper}>
          <ProductGrid products={filtered} cart={cart} onAdd={addProduct} />
        </div>
      </div>

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
              Tocá un producto para agregarlo a la venta.
            </p>
          )}
          {cart.map((i) => (
            <CartItem key={i.product._id} item={i} onInc={inc} onDec={dec} onRemove={remove} />
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
    </div>
  )
}
