import React from 'react'
import "./Cart.css";
import { FaRegTrashAlt } from "react-icons/fa";

import { useCart } from '../Hook/useCart';
const Cart = () => {
 
    const {cart, removeItem} = useCart()
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
   
           <p className="cantidad">Cant: {item.quantity}</p>
           </div>
           <div >
           <FaRegTrashAlt className="boton-borrar" onClick={()=>removeItem(item.id)} />
           <p> c/u ${item.precio}</p>
           

         
         </div>
           <p>  ${item.precio*item.quantity}</p>
           </div>
       ))}

<span>{`Cantidad Total: ${contadores}`}</span>
<span>{`Total a pagar: $${totalPrecio}`}</span>
    <button>Agregar </button>

    </div>
  )
}

export default Cart