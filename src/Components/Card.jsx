import React from "react";
import { Link } from "react-router-dom";
import "./Card.css";

function Card({ id, image, nombre, precio }) {





  return (
    <div className="conteiner-card">
      <img src={image} alt="" className="imagen" />
      <div className="info-card">
        <h2>{nombre}</h2>
        <h3>{precio}</h3>
      </div>
      <Link to={`/Details/${id}`} className="button-card">
      Ver Detalle
      </Link>
      
      
     
    </div>
  );
}

export default Card;
