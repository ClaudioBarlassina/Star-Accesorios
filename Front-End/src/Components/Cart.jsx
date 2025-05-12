import React, { useState } from 'react'
import './Cart.css'
import { FaRegTrashAlt } from 'react-icons/fa'
import { supabase } from '../supabaseClient.js'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { clearCart, updateQuantity, removeItem } from '../Redux/Reducer.js'

const Cart = () => {
  const cart = useSelector((state) => state.Productos.cart)
  const navigate = useNavigate();

  const dispatch = useDispatch()
  const contadores = cart.reduce((total, item) => total + item.quantity, 0)
  const totalPrecio = cart.reduce(
    (total, item) => total + item.precio * item.quantity,
    0
  )

  const [formData, setFormData] = useState({
    nombre: '',
    direccion: '',
    telefono: '',
    email: '',
    codigoPostal: '',
    ciudad: '',
    metodoPago: 'efectivo',
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target

    if (name === 'codigoPostal' && value.length <= 4 && /^\d*$/.test(value)) {
      setFormData({ ...formData, [name]: value })
      if (value.length === 4) fetchCity(value)
    } else if (name !== 'codigoPostal') {
      setFormData({ ...formData, [name]: value })
    }
  }

  const fetchCity = async (codigoPostal) => {
    try {
      const response = await fetch(
        `https://api.zippopotam.us/ar/${codigoPostal}`
      )
      const data = await response.json()
      if (data?.places?.length > 0) {
        setFormData({ ...formData, ciudad: data.places[0]['place name'] })
      } else {
        setFormData({ ...formData, ciudad: 'Ciudad no encontrada' })
      }
    } catch (error) {
      setFormData({ ...formData, ciudad: 'Error al obtener la ciudad' })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!cart.length) {
      alert('Tu carrito está vacío')
      return
    }

    const pedido = {
      Cliente: [formData], // Array con los datos del cliente
      Productos: cart.map((item) => ({
        nombre: item.nombre,
        cantidad: item.quantity,
        total: item.precio * item.quantity,
      })),
      Total: totalPrecio,
    }

    console.log('Enviando pedido a Supabase...', pedido)

    const { data, error } = await supabase.from('Pedidos').insert([pedido])

    if (error) {
      console.error('Error al enviar pedido:', error.message)
      alert('Hubo un error al procesar tu pedido.')
      return
    }

    console.log('Pedido guardado en Supabase:', data)

    // **Actualizar el stock en la base de datos**
    for (const item of cart) {
      // Obtener el producto actual de la base de datos
      const { data: productData, error: fetchError } = await supabase
        .from('Productos')
        .select('stock')
        .eq('nombre', item.nombre)
        .single() // Obtenemos solo un producto por nombre

      if (fetchError) {
        console.error(
          `Error al obtener el producto ${item.nombre}:`,
          fetchError.message
        )
        continue // Continuamos con los siguientes productos
      }

      if (productData) {
        // Calcular el nuevo stock
        const nuevoStock = productData.stock - item.quantity

        if (nuevoStock < 0) {
          console.error(`No hay suficiente stock para ${item.nombre}`)
          alert(`No hay suficiente stock para ${item.nombre}.`)
          continue
        }

        // Actualizar el stock en la base de datos
        const { error: updateError } = await supabase
          .from('Productos')
          .update({ stock: nuevoStock })
          .eq('nombre', item.nombre)

        if (updateError) {
          console.error(
            `Error al actualizar el stock de ${item.nombre}:`,
            updateError.message
          )
        } else {
          console.log(`Stock de ${item.nombre} actualizado a ${nuevoStock}`)
        }
      }
    }

    // **Vaciar el carrito**
    navigate('/Order', { state: { pedido } })
    dispatch(clearCart())
    // **Limpiar los campos de cliente**
    setFormData({
      nombre: '',
      direccion: '',
      telefono: '',
      email: '',
      codigoPostal: '0',
      ciudad: '',
      metodoPago: 'efectivo',
    })

    alert('Pedido realizado con éxito 🎉')
  }

  return (
    <div className="Cont-Cart">
      <h2>PREPARAMOS TU PEDIDO </h2>
      {cart.map((item, index) => (
        <div key={index} className="cart-item">
          <FaRegTrashAlt
            className="boton-borrar-cart"
            onClick={() => dispatch(removeItem(item.id))}
          ></FaRegTrashAlt>
          <img src={item.image} alt="" className="imagen-items-carrito" />
          <div className="cart-nombre">
            <p>{item.nombre}</p>
            <div className="conjunto-botones">
              <button
                className="botton-carrito"
                onClick={() =>dispatch(updateQuantity(item.id, item.quantity - 1)) }
                disabled={item.quantity <= 1} // Deshabilitado si la cantidad es 1 o menor
              >
                -
              </button>
              <span>{item.quantity}</span>
              <button
                className="botton-carrito"
                onClick={() =>
                   dispatch(updateQuantity(item.id, Math.min(item.quantity + 1)))
                }
                disabled={item.quantity >= item.stock} // Deshabilitado si la cantidad es igual o mayor al stock disponible
              >
                +
              </button>
            </div>
          </div>
          <div className="conjunto-borrar">
            <p>C/u</p>
            <p> ${item.precio}</p>
          </div>
          <div className="conjunto-total">
            <div></div>
            <p className="total-final"> ${item.precio * item.quantity}</p>
          </div>
        </div>
      ))}

      <div className="carrito-pagina">
        <span>{`Cantidad Total: ${contadores}`}</span>
        <span>{`Total a pagar: $${totalPrecio}`}</span>
      </div>

      <form onSubmit={handleSubmit} className="form-datos">
        <h3>Ingresa tus datos</h3>
        <div>
          <label htmlFor="nombre">Nombre:</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="direccion">Dirección:</label>
          <input
            type="text"
            id="direccion"
            name="direccion"
            value={formData.direccion}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="telefono">Teléfono:</label>
          <input
            type="text"
            id="telefono"
            name="telefono"
            value={formData.telefono}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="codigoPostal">Código Postal:</label>
          <input
            type="text"
            id="codigoPostal"
            name="codigoPostal"
            onInput={handleInputChange}
            maxLength={4}
            pattern="\d{4}"
            required
          />
        </div>
        {formData.ciudad && (
          <div>
            <label htmlFor="ciudad">Ciudad:</label>
            <input
              type="text"
              id="ciudad"
              name="ciudad"
              value={formData.ciudad}
              readOnly
            />
          </div>
        )}
        <div>
          <label htmlFor="metodoPago">Método de Pago:</label>
          <select
            id="metodoPago"
            name="metodoPago"
            value={formData.metodoPago}
            onChange={handleInputChange}
            required
          >
            <option value="Efectivo">Efectivo</option>
            <option value="Transferencia">Transferencia</option>
          </select>
        </div>
        {/* Mostrar los detalles de la cuenta para transferencia si el método de pago es transferencia */}
        {formData.metodoPago === 'Transferencia' && (
          <div className="transferencia-info">
            <h4>Detalles para la Transferencia:</h4>
            <p>
              <strong>Alias de Cuenta:</strong> MiAliasDeCuenta
            </p>
            <p>
              <strong>Banco:</strong> Banco XYZ
            </p>
            <p>
              <strong>Cbu:</strong> 1234567890123456789012
            </p>
            <p>
              <strong>Concepto:</strong> Compra en tienda online
            </p>
            <p>
              <strong>Valor a Transferir:</strong> ${totalPrecio}
            </p>
            <p>
              <em>
                Realiza la transferencia con los datos anteriores. Una vez
                realizada, por favor espera la confirmación de tu compra.
              </em>
            </p>
          </div>
        )}
        <button type="submit" className="btn-finalizar">
          Confirmar Datos y Finalizar Compra
        </button>
      </form>
    </div>
  )
}

export default Cart

