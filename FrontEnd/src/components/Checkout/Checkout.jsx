import { useState, useMemo } from 'react'
import styles from './Checkout.module.css'
import useStore from '../../store/useStore'

export default function Checkout({ productos = [], onConfirm, onSubmit }) {
  const loading = useStore(state => state.loadingPedido)
  const error = useStore(state => state.errorPedido)
  const [delivery, setDelivery] = useState('')
  const [errors, setErrors] = useState({})
  const [payment, setPayment] = useState('')
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    direccion: '',
  })

  const total = useMemo(() => {
    return productos.reduce((acc, item) => acc + item.precio * item.cantidad, 0)
  }, [productos])

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  const validate = () => {
    const newErrors = {}

    if (!form.nombre.trim()) newErrors.nombre = 'Nombre obligatorio'
    if (!form.apellido.trim()) newErrors.apellido = 'Apellido obligatorio'

    if (!form.email.trim()) {
      newErrors.email = 'Email obligatorio'
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Email inválido'
    }

    if (!form.telefono.trim()) newErrors.telefono = 'Teléfono obligatorio'

    if (!delivery) newErrors.delivery = 'Selecciona forma de entrega'

    if (delivery === 'domicilio' && !form.direccion.trim()) {
      newErrors.direccion = 'Dirección obligatoria'
    }

    if (!payment) newErrors.payment = 'Selecciona forma de pago'

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return

    const pedido = {
      cliente: form,
      productos,
      entrega: delivery,
      pago: payment,
      total,
      fecha: new Date(),
    }

    await onConfirm(pedido)
    onSubmit()
  }

  return (
    <div className={styles.checkout}>
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Resumen del pedido</h2>

        {productos.map((item) => {
          const subtotal = item.precio * item.cantidad
          return (
            <div key={item._id} className={styles.itemRow}>
              <div className={styles.image}>
                <img src={item.images?.[0]?.url || ''} alt={item.nombre} />
              </div>
              <div className={styles.name}>{item.nombre}</div>
              <div className={styles.price}>${item.precio}</div>
              <div className={styles.quantity}>{item.cantidad}</div>
              <div className={styles.subtotal}>${subtotal}</div>
            </div>
          )
        })}

        <div className={styles.h3}>
          <h3>Total:</h3>
          <h3>${total.toLocaleString()}</h3>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Datos de contacto</h2>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Nombre</label>
            <input name="nombre" placeholder="Tu nombre" onChange={handleChange} />
            {errors.nombre && <p className={styles.error}>{errors.nombre}</p>}
          </div>
          <div className={styles.formGroup}>
            <label>Apellido</label>
            <input name="apellido" placeholder="Tu apellido" onChange={handleChange} />
            {errors.apellido && <p className={styles.error}>{errors.apellido}</p>}
          </div>
        </div>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Email</label>
            <input name="email" placeholder="tu@email.com" onChange={handleChange} />
            {errors.email && <p className={styles.error}>{errors.email}</p>}
          </div>
          <div className={styles.formGroup}>
            <label>Teléfono</label>
            <input name="telefono" placeholder="+54 11 1234-5678" onChange={handleChange} />
            {errors.telefono && <p className={styles.error}>{errors.telefono}</p>}
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Forma de entrega</h2>
        <div className={styles.radioGroup}>
          {[
            { value: 'retiro', label: 'Retiro en local' },
            { value: 'domicilio', label: 'Envío a domicilio' },
          ].map((opt) => (
            <label
              key={opt.value}
              className={`${styles.radioOption} ${delivery === opt.value ? styles.selected : ''}`}
            >
              <input
                type="radio"
                name="delivery"
                value={opt.value}
                checked={delivery === opt.value}
                onChange={(e) => setDelivery(e.target.value)}
              />
              {opt.label}
            </label>
          ))}
        </div>
        {delivery === 'domicilio' && (
          <div className={styles.formGroup}>
            <label>Dirección</label>
            <input name="direccion" placeholder="Calle y número" onChange={handleChange} />
            {errors.direccion && <p className={styles.error}>{errors.direccion}</p>}
          </div>
        )}
        {errors.delivery && <p className={styles.error}>{errors.delivery}</p>}
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Forma de pago</h2>
        <div className={styles.radioGroup}>
          {[
            { value: 'efectivo', label: 'Efectivo' },
            { value: 'transferencia', label: 'Transferencia bancaria' },
            { value: 'mercadopago', label: 'Mercado Pago' },
          ].map((opt) => (
            <label
              key={opt.value}
              className={`${styles.radioOption} ${payment === opt.value ? styles.selected : ''}`}
            >
              <input
                type="radio"
                name="payment"
                value={opt.value}
                checked={payment === opt.value}
                onChange={(e) => setPayment(e.target.value)}
              />
              {opt.label}
            </label>
          ))}
        </div>
        {errors.payment && <p className={styles.error}>{errors.payment}</p>}
      </div>

      {error && <p className={styles.error}>{error}</p>}
      <button onClick={handleSubmit}  className={styles.submit}>
       Confirmar Pedido
      </button>
    </div>
  )
}
