import React from "react";
import { Link } from "react-router-dom";
import "./Card.css";
import { MdAddShoppingCart } from "react-icons/md";

function Card({ id, image, nombre, precio }) {





  return (
    <div className="conteiner-card">
      <Link to={`/Details/${id}`} >
      <img src={image} alt="" className="imagen" />
      </Link>
      <div className="info-card">
        <h2>{nombre}</h2>
        <h3>{precio}</h3>
      </div>
     
     <MdAddShoppingCart className="icon-cart"/>
     
      
      
     
    </div>
  );
}

export default Card;
