import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";

import "./Details.css";
import { useCart } from "../Hook/useCart";
import { useSelector } from "react-redux";

const Details = () => {
  const { addToCart, cart } = useCart();
  const DataState = useSelector((state) => state.Productos);

  const { productoId } = useParams();

  const product = DataState.Productos.find((item) => item.id === Number(productoId));

  const [cantidad, setCantidad] = useState(1);

  const handlerAddCart = () => {
    const productos = {
      id: product.id,
      image: product.Image,
      nombre: product.nombre,
      precio: product.precio,
      quantity: cantidad,
    };

    addToCart(productos);
    console.log(cart);
  };

  return (
    <div className="Details-conteiner">
      <div>
        <img src={product.Image} alt="" className="Details-image" />
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
            <button
              onClick={() => setCantidad((prev) => Math.max(prev - 1, 1))}
            >
              -
            </button>
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
