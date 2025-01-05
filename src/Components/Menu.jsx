import React from "react";
import { useState } from "react";
import "./Menu.css";
import { CiShoppingCart } from "react-icons/ci";
import { RxHamburgerMenu } from "react-icons/rx";
import logo from "../assets/Logo Star 2.webp"

const Menu = () => {
  const Categorias = [
    { id: "1", nombre: "" },
    { id: "2", nombre: "Acero Blanco" },
    { id: "3", nombre: "Acero Dorado" },
    { id: "4", nombre: "Acero Quirurgico" },
  ];
 
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setCartOpen] = useState(false)

  const handlerCategoriaClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const handlerCartClic = ()=>{
    setCartOpen(!isCartOpen)
    console.log(isCartOpen)
  }


  return (
    <div className="conteiner-general">
      <div>
        {/* Categorías */}
        <div className="categorias-container">

          {/* Boton Abrir / Cerrar */}
          <button onClick={handlerCategoriaClick} className="toggle-button">
            <RxHamburgerMenu />
          </button>
          {/* ////////// */}
          <div className={`categoria-list ${isMenuOpen ? "open" : ""}`}>
           <button onClick={handlerCategoriaClick}>Cerrar</button>
            <ul>
              <li>
                <a href="./Acero-blanco">Acero Blanco</a>
              </li>
              <li>
                <a href="./Acero-Dorado">Acero Dorado</a>
              </li>
              <li>
                <a href="./Acero-Quirurgico ">Acero Quirurgico</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div>
        <img
          src={logo}
          className="image-logo"
          alt=""
        />
      </div>
      <div>
        {/* boton Carrito */}
        <CiShoppingCart className="icono-cart" onClick={handlerCartClic}/>
        <div className={`cart-menu ${isCartOpen ? "open" : ""}`}>
        <button onClick={handlerCartClic}>Cerrar</button>
          <p></p>
        </div>
      </div>
    </div>
  );
};

export default Menu;
