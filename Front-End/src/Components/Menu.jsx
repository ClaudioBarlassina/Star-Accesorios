import React from 'react'
import { useState, useContext, useEffect } from 'react'
import './Menu.css'
// import Data from "../assets/Data.json";
import DataCateg from '../assets/DataCateg.json'
import { CiShoppingCart } from 'react-icons/ci'
import { RxHamburgerMenu } from 'react-icons/rx'
import logo from '../assets/logo2-capa.png'
import { useNavigate, Link } from 'react-router-dom'
import { useFilters } from '../Hook/Usefilter'
// import { useCart } from "../Hook/useCart";
import { removeItem, clearCart,updateQuantity } from '../Redux/Reducer'
import { FaRegTrashAlt } from 'react-icons/fa'
import { useSelector, useDispatch } from 'react-redux'

import { setCategoria, setSubcategoria } from '../Redux/Reducer' // Asegúrate de importar las acciones correctas

const Menu = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const filters = useSelector((state) => state.Productos.filters)
  console.log(JSON.stringify(filters))

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [active, setActive] = useState(null)

  const [isCartOpen, setisCartOpen] = useState(false)

  const cart = useSelector((state) => state.Productos.cart)

  //contador numerito

  const contadores = cart.reduce((total, item) => total + item.quantity, 0)

  //

  // contador total
  const totalPrecio = cart.reduce(
    (total, item) => total + item.precio * item.quantity,
    0
  )

  //

  const HandlerCarrito = () => {
    setisCartOpen(!isCartOpen)
  }

  const handlerCategoriaClick = () => {
    setIsMenuOpen(!isMenuOpen)
  }
  const handlerCartClic = () => {
    setisCartOpen(!isCartOpen)
  }

  const buttonAcordeon = (index) => {
    setActive(active === index ? null : index)
  }
  const handlerSeleccion = (categoria, subcategoria) => {
    dispatch(setCategoria(categoria))
    dispatch(setSubcategoria(subcategoria))
    navigate('/home')
    setIsMenuOpen(false)
  }

  return (
    <div className="conteiner-general" data-aos="fade-down"
    >
      <div>
        {/* Categorías ----------------------------------------------------------------*/}
        <div className="categorias-container">
          {/* Boton Abrir / Cerrar ----------------------------------------------------*/}
          <button onClick={handlerCategoriaClick} className="toggle-button">
            <RxHamburgerMenu />
          </button>

          {/* Menu Lateral ----------------------------------------------------------- */}
          <div className={`categoria-list ${isMenuOpen ? 'open' : ''}`}>
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
                  onClick={() => handlerSeleccion('Todos Los Productos','Todo')}
                >
                  {' '}
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
                        active === index ? 'active' : ''
                      }`}
                      style={{
                        maxHeight: active === index ? '400px' : '0',
                        overflow: 'hidden',
                        transition: 'max-height 1s ease',
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
        <div className={`cart-menu ${isCartOpen ? 'open' : ''}`}>
          {/* Agregamos la lista de productos */}
          <div className="cart-items">
            {cart.length > 0 ? (
              <>
                {cart.map((item, index) => (
                  <div key={index} className="cart-item">
                     <FaRegTrashAlt
                        className="boton-borrar"
                        onClick={() => dispatch(removeItem(item.id))}
                      />
                    <img
                      src={item.image}
                      alt=""
                      className="imagen-items-carrito"
                    />

                    <div className="cart-nombre">
                      <p>{item.nombre}</p>

                      <div className="conjunto-botones">
                        <button
                          className="botton-carrito"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          className="botton-carrito"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className='conjunto-total' >
                      {console.log(item.id)}
                     
                      <p className='total-final'>${item.precio * item.quantity}</p>
                    </div>
                  </div>
                ))}

                {/* Contador total después de la lista de productos */}
                <span>{`Cantidad Total: ${contadores}`}</span>
                <span>{`Total a pagar: $${totalPrecio}`}</span>
                <div className="botones-finales">
                  <Link to={'/Carrito'}>
                    <button
                      className="boton-confir"
                      onClick={() => HandlerCarrito()}
                    >
                      ir al Carrito
                    </button>
                  </Link>

                  <button
                    className="boton-confir"
                    onClick={() => dispatch(clearCart())}
                  >
                    Borrar Carrito
                  </button>
                </div>
              </>
            ) : (
              <p>El carrito está vacío</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Menu
