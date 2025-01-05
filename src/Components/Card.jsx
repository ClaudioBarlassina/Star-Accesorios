import React from "react";
import { Link } from "react-router-dom";
import "./Card.css";

function Card({ image, nombre, precio }) {
  return (
    <div className="conteiner-card">
      <img src={image} alt="" className="imagen" />
      <div className="info-card">
        <h2>{nombre}</h2>
        <h3>{precio}</h3>
      </div>
      <button className="button-card">detalle</button>
    </div>
  );
}

export default Card;
