import React from "react";
import { Link } from "react-router-dom";
import "./Card.css";
import { MdAddShoppingCart } from "react-icons/md";
import { PiUserCircleGearDuotone } from "react-icons/pi";
import {useCart} from "../Hook/useCart"



function Card({ id, image, nombre, precio }) {

const {addToCart, cart} = useCart()


const HandlerAdd =() =>{
const productos = {id, image, nombre, precio, quantity:1}
addToCart(productos)

console.log(cart)
}

  return (
    <div className="conteiner-card">
      <Link to={`/Details/${id}`} >
      <img src={image} alt="" className="imagen" />
      </Link>
      <div className="info-card">
        <h2>{nombre}</h2>
        <h3>{precio}</h3>
      </div>
     
     <MdAddShoppingCart className="icon-cart" onClick={HandlerAdd}/>
     
      
      
     
    </div>
  );
}

export default Card;
