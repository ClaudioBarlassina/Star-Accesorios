import React from "react";
import { useState } from "react";
import "./Menu.css";
// import Data from "../assets/Data.json";
import DataCateg from "../assets/DataCateg.json";
import { CiShoppingCart } from "react-icons/ci";
import { RxHamburgerMenu } from "react-icons/rx";
import logo from "../assets/Logo2-capa.Png"

import { useFilters } from "../Hook/Usefilter";

const Menu = () => {
  const { filters, setFilters } = useFilters();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setCartOpen] = useState(false);
  const [active, setActive] = useState(null);

 

  const handlerCategoriaClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const handlerCartClic = () => {
    setCartOpen(!isCartOpen);
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
              <li >
                {/* <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlerSeleccion("all", "all");
                  }}
                >
                  Todas las categorías
                </a> */}
                <button className="boton-categoria" onClick={()=>handlerSeleccion("all", "all")}> Todas las categorias</button>
              </li>

              {/*----------------------------------------------------------------------- */}
              
              <div>
                {DataCateg.map((categ, index) => (
                  <div key={index}>
                    <button className="boton-categoria"onClick={() => buttonAcordeon(index)}>
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
