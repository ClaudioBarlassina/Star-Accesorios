import React from "react"
import styles from "../OrderItems/OrderItem.module.css"
import { getCarritoId } from "../../../store/useStore"


const OrderItem = ({
  item,
  onIncrease,
  onDecrease,
  onRemove
}) => {
  const id = getCarritoId(item)

  return (
    <ul className={styles.Tabla_Orden}>
      
      
      
      <li>
        <img
          src={item.images?.[0]?.url || ''}
          width={80}
          height={80}
           style={{ objectFit: 'cover' }}
          alt={item.nombre}
        />
      </li>

      <div className={styles.tabla_Orden_NP}>
        {/* tabla_Orden_NP */}
        <li>{item.nombre}</li>
        {item.variante && (
          <li className={styles.variante}>{item.variante}</li>
        )}
        <li className={styles.precio}>${item.precio}</li>

        <li>
          <div className={styles.tabla_Order_Cantidad}>
            <button onClick={() => onDecrease(id)}>-</button>
            <p>{item.cantidad}</p>
            <button onClick={() => onIncrease(id)}>+</button>
          </div>
        </li>
      </div>

      <li className={styles.precio}>
        ${item.precio * item.cantidad}
      </li>

      <li>
        <button onClick={() => onRemove(id)}>
          🗑
        </button>
      </li>
    </ul>
  )
}

export default OrderItem
