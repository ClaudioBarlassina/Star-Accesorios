import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Data from "../assets/Data.json";
import "./Details.css";
import { useCart } from "../Hook/useCart";

const Details = () => {
  const { addToCart, cart } = useCart();

  const { productoId } = useParams();
  const product = Data.find((item) => item.id === productoId);
  
  const [cantidad, setCantidad] = useState(1)
  console.log(cantidad)
  

 const handlerAddCart = () =>{
  const productos = {
    id: product.id,
    image : product.image,
    nombre:  product.nombre,
    precio: product.precio,
    quantity: cantidad

  }
 
  addToCart(productos)
  console.log(cart)
 }

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
            <button onClick={() => setCantidad((prev) => Math.max(prev - 1, 1))}>-</button>
           <span>{cantidad}</span>
            <button onClick={() => setCantidad((prev) => prev + 1)}>+</button>
          </div>
        </div>
        <div className="separador"></div>
      </div>
      
      <button className="button-card " onClick={handlerAddCart}>
        Agregar Al Carrito
      </button>
     
    </div>
  );
};

export default Details;
