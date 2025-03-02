import React from 'react'
import "./Cart.css";
import { FaRegTrashAlt } from "react-icons/fa";
import { Link } from 'react-router-dom';

import { useCart } from '../Hook/useCart';
const Cart = () => {
 
    const {cart, removeItem,updateQuantity } = useCart()
     //contador numerito

  const contadores = cart.reduce((total, item) => total + item.quantity, 0);

  //

  // contador total 
  const totalPrecio = cart.reduce((total, item) => total + (item.precio * item.quantity),0 );
 
 //


  return (
    <div className='Cont-Cart'>
  <h2>PREPARAMOS TU PEDIDO </h2>
   {cart.map((item, index) => (
         <div key={index} className="cart-item">
   
           <img src={item.image} alt="" className="imagen-items-carrito" />
           
           <div className="cant-nombre">
           <p>{item.nombre}</p>
   
           <div className="conjunto-botones">
        <button className="botton-carrito"onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>-</button>
        <span>{item.quantity}</span>
        <button className="botton-carrito" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
          </div>
           </div>
           <div >
           <FaRegTrashAlt className="boton-borrar" onClick={()=>removeItem(item.id)} />
           <p> c/u ${item.precio}</p>
           

         
         </div>
           <p>  ${item.precio*item.quantity}</p>
           </div>
       ))}
<div className='carrito-pagina'>

<span>{`Cantidad Total: ${contadores}`}</span>
<span>{`Total a pagar: $${totalPrecio}`}</span>
</div>
<Link to={"/"
}>
    <button className='boton-confir'>Agregar </button>
</Link>

    </div>
  )
}

export default Cart