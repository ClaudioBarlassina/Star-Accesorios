import styles from './Success.module.css'
import { useNavigate } from 'react-router-dom'

export default function Success({ order }) {
  const navigate = useNavigate()
  const data = order?.[order.length - 1]

  if (!data) return null

  return (
    <div className={styles.container}>
      <div className={styles.icon}>🎉</div>
      <h1 className={styles.title}>¡Gracias por tu compra!</h1>
      <p className={styles.subtitle}>
        Tu pedido fue confirmado correctamente.
        Te enviamos un email con los detalles.
      </p>
      <div className={styles.orderId}>#{data._id}</div>

      <h2 style={{ fontFamily: 'var(--heading)', fontSize: '18px', textAlign: 'left', margin: '0 0 var(--space-md)' }}>Resumen del pedido</h2>

      <ul className={styles.products}>
        {data.productos.map((p, i) => (
          <li key={i}>
            <span>{p.nombre} × {p.cantidad}</span>
            <span>${p.precio * p.cantidad}</span>
          </li>
        ))}
      </ul>

      <p className={styles.total}>Total: ${data.total}</p>

      <div className={styles.actions}>
        <button
          onClick={() => navigate('/')}
          style={{
            width: '100%',
            padding: '14px',
            background: 'var(--dark)',
            color: 'white',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            fontFamily: 'var(--ui)',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'background var(--transition)',
          }}
          onMouseEnter={(e) => e.target.style.background = 'var(--gold)'}
          onMouseLeave={(e) => e.target.style.background = 'var(--dark)'}
        >
          Volver al inicio
        </button>
      </div>
    </div>
  )
}