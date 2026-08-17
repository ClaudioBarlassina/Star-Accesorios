import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { getMisPedidos } from "../../api/orders.api"
import styles from "./MisPedidos.module.css"

const ESTADOS = ["pendiente", "procesando", "enviado", "entregado"]
const ESTADO_LABELS = {
  pendiente: "Pendiente",
  procesando: "Procesando",
  enviado: "Enviado",
  entregado: "Entregado",
  cancelado: "Cancelado",
}
const ESTADO_COLORS = {
  pendiente: "#856404",
  procesando: "#004085",
  enviado: "#0c5460",
  entregado: "#155724",
  cancelado: "#721c24",
}

function Timeline({ estadoActual }) {
  if (estadoActual === "cancelado") {
    return (
      <div className={styles.canceladoBadge}>
        <span className={styles.canceladoIcon}>✕</span>
        Pedido cancelado
      </div>
    )
  }

  const idx = ESTADOS.indexOf(estadoActual)
  return (
    <div className={styles.timeline}>
      {ESTADOS.map((est, i) => (
        <div key={est} className={`${styles.step} ${i <= idx ? styles.stepActive : ""}`}>
          <div className={`${styles.dot} ${i < idx ? styles.dotDone : i === idx ? styles.dotCurrent : ""}`} />
          {i < ESTADOS.length - 1 && <div className={`${styles.line} ${i < idx ? styles.lineDone : ""}`} />}
          <span className={styles.stepLabel}>{ESTADO_LABELS[est]}</span>
        </div>
      ))}
    </div>
  )
}

export default function MisPedidos() {
  const navigate = useNavigate()
  const [pedidos, setPedidos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getMisPedidos()
      .then((res) => setPedidos(res.data))
      .catch((err) => {
        console.error(err)
        setError("No se pudieron cargar tus pedidos. Iniciá sesión e intentá de nuevo.")
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Cargando tus pedidos...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Mis Pedidos</h1>
        <p className={styles.error}>{error}</p>
        <button className={styles.backBtn} onClick={() => navigate("/")}>Volver al inicio</button>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Mis Pedidos</h1>

      {pedidos.length === 0 ? (
        <div className={styles.empty}>
          <p>Todavía no hiciste ningún pedido.</p>
          <button className={styles.backBtn} onClick={() => navigate("/productos")}>Ir a la tienda</button>
        </div>
      ) : (
        <div className={styles.list}>
          {pedidos.map((pedido) => (
            <div key={pedido._id} className={styles.card}>
              <div className={styles.cardHeader}>
                <div>
                  <span className={styles.orderId}>#{String(pedido._id).slice(-8)}</span>
                  <span className={styles.orderDate}>
                    {new Date(pedido.fecha).toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" })}
                  </span>
                </div>
                <span className={styles.total}>${pedido.total?.toLocaleString()}</span>
              </div>

              <Timeline estadoActual={pedido.estado} />

              <div className={styles.products}>
                {pedido.productos?.map((p, i) => (
                  <div key={i} className={styles.productRow}>
                    <span>{p.nombre} × {p.cantidad}</span>
                    <span>${(p.precio * p.cantidad).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className={styles.cardFooter}>
                <span className={styles.pagoBadge}>
                  {pedido.pago === "efectivo" ? "Efectivo" : pedido.pago === "transferencia" ? "Transferencia" : pedido.pago}
                </span>
                <span className={styles.entregaBadge}>
                  {pedido.entrega === "retiro" ? "Retiro en local" : "Envío a domicilio"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
