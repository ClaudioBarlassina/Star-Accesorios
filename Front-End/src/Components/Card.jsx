import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useCart } from "../Hook/useCart";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { reducirStock } from "../Redux/Reducer"; // Importar la acción de Redux
import "./Card.css";

function Card({ id, image, nombre, precio }) {
  const dispatch = useDispatch();
  const { addToCart } = useCart();

  // Obtener el stock actualizado desde Redux
  const stock = useSelector((state) =>
    state.Productos.Productos.find((p) => p.id === id)?.stock ?? 0
  );

  const HandlerAdd = () => {
    if (stock > 0) {
      const productos = { id, image, nombre, precio, quantity: 1 };
      addToCart(productos);

      // Reducir stock en Redux
      dispatch(reducirStock(id));

      // Notificación con Toast
      toast(
        <div className="cuerpo-notificacion">
          <img src={productos.image} alt="" className="image-notificacion" />
          <div className="cuerpo-datos">
            <h1 className="N-datos">{productos.nombre}</h1>
            <span className="N-precio">${productos.precio}</span>
          </div>
        </div>,
        { className: "notificacion-men" }
      );
    }
  };

  return (
    <div className="conteiner-card">
      <Link to={`/Details/${id}`}>
        <img src={image} alt={nombre} className="imagen" style={{ cursor: "pointer" }} />
      </Link>

      <div className="info-card">
        <h2>{nombre}</h2>
        <h3>${precio}</h3>
      </div>

      <div className="stock-info">
        {/* {stock === 0 ? <span className="sin-stock">Sin stock</span> : <strong>Stock: {stock}</strong>} */}
      </div>

      <button
        onClick={HandlerAdd}
        disabled={stock === 0} // Desactiva el botón cuando no hay stock
        style={{
          cursor: stock === 0 ? "not-allowed" : "pointer",
          opacity: stock === 0 ? 0.5 : 1,
        }}
        className="botton-card"
      >
        {stock === 0 ? "Sin stock" : "Ingresar al carrito"}
      </button>
    </div>
  );
}

export default Card;
