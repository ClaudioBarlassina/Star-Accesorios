import React from "react";
import { useState, useContext, useEffect } from "react";
import "./Menu.css";
// import Data from "../assets/Data.json";
import DataCateg from "../assets/DataCateg.json";
import { CiShoppingCart } from "react-icons/ci";
import { RxHamburgerMenu } from "react-icons/rx";
import logo from "../assets/logo2-capa.png";
import { useNavigate } from "react-router-dom";
import { useFilters } from "../Hook/Usefilter";
import { useCart } from "../Hook/useCart";
import { EstadoContext } from "../Context/EstadoCom";

const Menu = () => {
  const { filters, setFilters } = useFilters();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [active, setActive] = useState(null);
  const { isCartOpen, setisCartOpen } = useContext(EstadoContext);
  const [contador, setContador] = useState(0);

  const { cart } = useCart();

  //contador numerito

  const contadores = cart.reduce((total, item) => total + item.quantity, 0);

  //

  // contador total 
  const totalPrecio = cart.reduce((total, item) => total + item.precio * item.quantity,0 );
 console.log(totalPrecio)
 //

  const navigate = useNavigate();

  const handlerCategoriaClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const handlerCartClic = () => {
    setisCartOpen(!isCartOpen);
  };

  const buttonAcordeon = (index) => {
    setActive(active === index ? null : index);
  };
  const handlerSeleccion = (categoria, subcategoria) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      categoria: categoria,
      subcategoria: subcategoria,
    }));
    setIsMenuOpen(false);
    navigate("/");
    console.log(categoria, subcategoria);
  };

  return (
    <div className="conteiner-general">
      <div>
        {/* Categorías ----------------------------------------------------------------*/}
        <div className="categorias-container">
          {/* Boton Abrir / Cerrar ----------------------------------------------------*/}
          <button onClick={handlerCategoriaClick} className="toggle-button">
            <RxHamburgerMenu />
          </button>

          {/* Menu Lateral ----------------------------------------------------------- */}
          <div className={`categoria-list ${isMenuOpen ? "open" : ""}`}>
            {/* <div className="titulo-categorias"> 
              <h2>Categorias</h2>
            </div> */}

            {/* todas las categorias --------------------------------------------------------- */}
            <ul>
              <li>
                {/* <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlerSeleccion("all", "all");
                  }}
                >
                  Todas las categorías
                </a> */}
                <button
                  className="boton-categoria"
                  onClick={() => handlerSeleccion("all", "all")}
                >
                  {" "}
                  Todas las categorias
                </button>
              </li>

              {/*----------------------------------------------------------------------- */}

              <div>
                {DataCateg.map((categ, index) => (
                  <div key={index}>
                    <button
                      className="boton-categoria"
                      onClick={() => buttonAcordeon(index)}
                    >
                      {categ.title}
                    </button>
                    <div
                      className={`acordeon-cont${
                        active === index ? "active" : ""
                      }`}
                      style={{
                        maxHeight: active === index ? "400px" : "0",
                        overflow: "hidden",
                        transition: "max-height 1s ease",
                      }}
                    >
                      <ul>
                        {categ.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="item-subcategoria"
                            onClick={() => handlerSeleccion(categ.title, item)}
                          >
                            {item}
                          </div>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </ul>
          </div>
        </div>
      </div>
      <div>
        <img src={logo} className="image-logo" alt="" />
      </div>
      <div>
        {/* boton Carrito */}
        <div className="conjunto-carrito-numero">
          <CiShoppingCart className="icono-cart" onClick={handlerCartClic} />

          {contadores > 0 && (
            <span className="contador-carrito">{contadores}</span>
          )}
        </div>
        <div className={`cart-menu ${isCartOpen ? "open" : ""}`}>
          {/* Agregamos la lista de productos */}
          <div className="cart-items">
          {cart.length > 0 ? (
  <>
    {cart.map((item, index) => (
      <div key={index} className="cart-item">
        <img src={item.image} alt="" className="imagen-items-carrito" />
        <p>{item.nombre}</p>
        <p>Cantidad: {item.quantity}</p>
        <p>Precio: ${item.precio}</p>
      </div>
    ))}

    {/* Contador total después de la lista de productos */}
    <span>{`Cantidad Total: ${contadores}`}</span>
    <span>{`Total a pagar: $${totalPrecio}`}</span>
  </>
) : (
  <p>El carrito está vacío</p>
)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;
