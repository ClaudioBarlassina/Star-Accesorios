import React from 'react'
import OrderItem from '../OrderSumary/OrderItems/OrderItem'
import style from '../OrderSumary/OrderSumary.module.css'

const OrderSummary = ({
  items,
  onIncrease,
  onDecrease,
  onRemove,
  onCheckout,
  onContinue,
}) => {
  const total = items.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0,
  )
  return (
    <div className={style.conteiner_Orden}>
      {/* "conteiner_Orden" */}
      <h2>PREPARAMOS TU PEDIDO</h2>

      <div className={style.conteiner_Orden_item}>
      
        {items.map((item) => (
          <OrderItem
            key={item._id}
            item={item}
            onIncrease={onIncrease}
            onDecrease={onDecrease}
            onRemove={onRemove}
          />
        ))}

        <ul className={style.tabla_orden_final}>
          {/* tabla_orden_final */}
          <li>TOTAL</li>
          <li>${total}</li>
        </ul>
      </div>

      <div className={style.button_order}>
     
        <button onClick={onCheckout}>FINALIZAR COMPRA</button>

        <button onClick={onContinue}>SEGUIR COMPRANDO</button>
      </div>
    </div>
  )
}

export default OrderSummary
