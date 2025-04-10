import React from 'react'
import './landingPage.css'
import Carrusel from './Carrusel'
import ProductosCarrusel from './ProductosCarrusel'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setCategoria, setSubcategoria } from '../Redux/Reducer'
const LandingPage = () => {
  const dispatch = useDispatch()

  const navigate = useNavigate()
  const irProductos = () => {
    navigate('/Home')
  }
  const filtrarCategoria = (categoria, subcategoria) => {
    dispatch(setCategoria(categoria))
    dispatch(setSubcategoria(subcategoria))
    navigate('/home')
  }

  return (
    <div className="landing-page">
      {/* Hero */}
      <Carrusel />
      {/* Botones */}
      {/* Categorías destacadas o botones grandes */}
      <section className="landing-section botones-con-imagen">
        <div className="botones-grid">
          <button
            className="boton-imagen"
            onClick={() => filtrarCategoria('Acero Quirurgico', 'all')}
            style={{
              backgroundImage: `url('https://joyasdeaceroquirurgico.com/imagenes-mayorista-joyas-acero-quirurgico/bh-mayorista-joyas-de-acero-quirurgico.jpg')`,
            }}
          >
            <span>Acero quirurgico</span>
          </button>
          <button
            className="boton-imagen"
            onClick={() => filtrarCategoria('Acero Dorado', 'all')}
            style={{
              backgroundImage: `url('https://cdn.shopify.com/s/files/1/0416/9682/1401/products/S120A10230-1_480x480.jpg?v=1622486575')`,
            }}
          >
            <span>Acero Dorado</span>
          </button>
          <button
            className="boton-imagen"
            onClick={() => filtrarCategoria('Acero Blanco', 'all')}
            style={{
              backgroundImage: `url('https://i0.wp.com/maiklibertad.com/wp-content/uploads/2019/10/stainless-878324_1920.jpg?resize=870%2C490&ssl=1')`,
            }}
          >
            <span>Acero Blanco</span>
          </button>
        </div>
      </section>

      {/* Productos */}
      <ProductosCarrusel></ProductosCarrusel>

      <div className="boton-ir-productos">
        <button className="boton-categoria" onClick={() => irProductos()}>
          Mas Productos
        </button>
      </div>

      {/* Beneficios */}
      <section id="beneficios" className="landing-section beneficios-section">
        <h2 className="section-title">¿Por qué elegirnos?</h2>
        <div className="beneficios-grid">
          <div className="beneficio-card">
            <span className="beneficio-icono">🚚</span>
            <h4 className="beneficio-titulo">Envíos rápidos</h4>
            <p className="beneficio-texto">Llegamos a todo el país</p>
          </div>
          <div className="beneficio-card">
            <span className="beneficio-icono">💎</span>
            <h4 className="beneficio-titulo">Productos únicos</h4>
            <p className="beneficio-texto">
              Accesorios seleccionados con estilo
            </p>
          </div>
          <div className="beneficio-card">
            <span className="beneficio-icono">💬</span>
            <h4 className="beneficio-titulo">Atención personalizada</h4>
            <p className="beneficio-texto">Respondemos todas tus dudas</p>
          </div>
        </div>
      </section>

      {/* Footer */}
    </div>
  )
}

export default LandingPage
