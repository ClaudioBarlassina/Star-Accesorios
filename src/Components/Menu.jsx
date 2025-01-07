import React from "react";
import { useState } from "react";
import "./Menu.css";
import Data from "../assets/Data.json";
import { CiShoppingCart } from "react-icons/ci";
import { RxHamburgerMenu } from "react-icons/rx";
import logo from "../assets/Logo Star 2.webp";

import { useFilters } from "../Hook/Usefilter";

const Menu = () => {
  const { filters, setFilters } = useFilters();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setCartOpen] = useState(false);

  const Data1 = Data.reduce((acc, item) => {
    // Si la categoría aún no está en el array, la agregamos
    if (!acc.some((cat) => cat.Categoria === item.Categoria)) {
      acc.push(item);
    }
    return acc;
  }, []);

  const handlerCategoriaClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const handlerCartClic = () => {
    setCartOpen(!isCartOpen);
  };
  const handlerCategoriaSel = (categ) => {
    console.log(categ)
      // Actualizamos los filtros para filtrar por categoría seleccionada
      setFilters((prevFilters) => ({
        ...prevFilters,
        categoria: categ,
      }));
      // Cerramos el menú después de seleccionar la categoría
      setIsMenuOpen(false);
   
    
  };

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
              {Data1.map((item) => (
                <li key={item.id}>
                  <a
                    href={item.Categoria}
                    onClick={(e) => {
                      e.preventDefault();
                      handlerCategoriaSel(item.Categoria);
                    }}
                  >
                    {item.Categoria}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div>
        <img src={logo} className="image-logo" alt="" />
      </div>
      <div>
        {/* boton Carrito */}
        <CiShoppingCart className="icono-cart" onClick={handlerCartClic} />
        <div className={`cart-menu ${isCartOpen ? "open" : ""}`}>
          <button onClick={handlerCartClic}>Cerrar</button>
          <p></p>
        </div>
      </div>
    </div>
  );
};

export default Menu;
