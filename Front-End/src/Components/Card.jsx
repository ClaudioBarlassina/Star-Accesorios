import React from 'react'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'
import './Card.css'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '../Redux/Reducer'

function Card({ id, image, nombre, precio }) {
  const dispatch = useDispatch()

  // Obtener el stock desde state.Productos.stock usando el id del producto
  const stock = useSelector((state) => state.Productos.stock[id] || 0)

 
  const HandlerAdd = () => {
    if (stock > 0) {
      const producto = { id, image, nombre, precio, quantity: 1 }

      // Añadir el producto al carrito
      dispatch(addToCart(producto))

      // Notificación con Toast 
      toast(
        <div className="cuerpo-notificacion">
          <img src={producto.image} alt="" className="image-notificacion" />
          <div className="cuerpo-datos">
            <h1 className="N-datos">{producto.nombre}</h1>
            <span className="N-precio">${producto.precio}</span>
          </div>
        </div>,
        { className: 'notificacion-men' }
      )
    }
  }

  return (
    <div className="conteiner-card">
      <Link to={`/Details/${id}`}>
        <img
          src={image}
          alt={nombre}
          className="imagen"
          style={{ cursor: 'pointer' }}
        />
      </Link>

      <div className="info-card">
        <h2>{nombre}</h2>
        <h3>${precio}</h3>
      </div>

      <div className="stock-info">
        {stock === 0 ? (
          <span className="sin-stock">Sin stock</span>
        ) : (
          <strong>Stock: {stock}</strong>
        )}
      </div>

      <button
        onClick={HandlerAdd}
        disabled={stock === 0}
        style={{
          cursor: stock === 0 ? 'not-allowed' : 'pointer',
          opacity: stock === 0 ? 0.5 : 1,
        }}
        className="botton-card"
      >
        {stock === 0 ? 'Sin stock' : 'Ingresar al carrito'}
      </button>
    </div>
  )
}

export default Card
