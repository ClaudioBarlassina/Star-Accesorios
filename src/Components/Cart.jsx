import React from 'react'
import { useCart } from '../Hook/useCart'

const Cart = () => {


    const {cart} = useCart
  return (
    <div>
        

     {JSON.stringify(cart)}



    </div>
  )
}

export default Cart