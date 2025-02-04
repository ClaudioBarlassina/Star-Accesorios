import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Card.css";
import { MdAddShoppingCart } from "react-icons/md";
import { useCart } from "../Hook/useCart";
import { toast } from "react-toastify";


function Card({ id, image, nombre, precio }) {
  const { addToCart, cart } = useCart();

  const HandlerAdd = () => {
    const productos = { id, image, nombre, precio, quantity: 1 };
    addToCart(productos);

    // NOTIFICACION CON TOAST-- 
    toast(<div className="cuerpo-notificacion">
  <img src={productos.image} alt="" className="image-notificacion"/>
    <div className="cuerpo-datos">

    <span>{productos.nombre}</span>
    <span>{productos.precio}</span>
    </div>
    
    
    </div>,{
      position: "top-center",
      // autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
     // Opciones: "light", "dark", "colored"
     className:"notificacion-menu",
    });
  };

  return (
    <div className="conteiner-card">
      <Link to={`/Details/${id}`}>
        <img src={image} alt="" className="imagen" />
      </Link>
      <div className="info-card">
        <h2>{nombre}</h2>
        <h3>{precio}</h3>
      </div>

      <MdAddShoppingCart className="icon-cart" onClick={HandlerAdd} />
    </div>
  );
}

export default Card;
