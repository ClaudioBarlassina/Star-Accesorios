import React, { useState } from "react";
import { MdAddShoppingCart } from "react-icons/md";
import { useCart } from "../Hook/useCart";
import { toast } from "react-toastify";
import "./Card.css";

function Card({ id, image, nombre, precio, stock }) {
  const { addToCart } = useCart();
  const [modalOpen, setModalOpen] = useState(false);

  const HandlerAdd = () => {
    if (stock === 0) return;
    const productos = { id, image, nombre, precio, quantity: 1 };
    addToCart(productos);

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
  };

  return (
    <>
      <div className="conteiner-card">
        <img
          src={image}
          alt={nombre}
          className="imagen"
          onClick={() => setModalOpen(true)}
          style={{ cursor: "pointer" }}
        />

        <div className="info-card">
          <h2>{nombre}</h2>
          <h3> ${precio}</h3>
        </div>

        {stock === 0 ? (
          <span className="sin-stock">Sin stock</span>
        ) : (
          <strong>Stock: {stock}</strong>
        )}

        <MdAddShoppingCart
          className={`icon-cart ${stock === 0 ? "disabled" : ""}`}
          onClick={HandlerAdd}
          style={{
            cursor: stock === 0 ? "not-allowed" : "pointer",
            opacity: stock === 0 ? 0.5 : 1,
          }}
        />
      </div>

      {/* Modal de imagen en grande */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img src={image} alt={nombre} className="modal-image" />
            <button className="close-button" onClick={() => setModalOpen(false)}>
              ✖
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Card;
