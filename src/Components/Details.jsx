import React from "react";
import { useParams, Link } from "react-router-dom";
import Data from "../assets/Data.json";
import "./Details.css";

const Details = () => {
  const { productoId } = useParams();
  const product = Data.find((item) => item.id === productoId);
  console.log(product.nombre);

  return (
    <div className="Details-conteiner">
      <div>
        <img src={product.image} alt="" className="Details-image" />
      </div>
      <div className="Details-info">
        <div>
          <p className="Details-Nombre"> {product.nombre}</p>
        </div>
       

        <p className="Details-Categoria"> {product.Categoria}</p>
        <p className="Details-Precio">Precio : {product.precio}</p>
       <div className="separador"></div>
        <p> {product.descripcion}</p>
        <div className="select-cantidad">
          <p>Cantidad</p>
          <div>

         <button>+</button>
         <select name="" id=""></select>
         <button>-</button>
          </div>
        </div>
          <div className="separador"></div>
      </div>
      <button className="button-card ">Agregar Al Carrito</button>
    </div>
  );
};

export default Details;
