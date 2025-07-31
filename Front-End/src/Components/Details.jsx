import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { reducirStock } from '../Redux/Reducer/'
import { addToCart } from '../Redux/Reducer' // Importar la acción de Redux
import './Details.css'

// Swiper
import { Swiper, SwiperSlide } from 'swiper/react'
import { Thumbs } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/thumbs'

// ----------------

const Details = () => {
  const dispatch = useDispatch()
  const { productoId } = useParams()

  const [thumbsSwiper, setThumbsSwiper] = useState(null)

  // Obtener producto desde Redux
  const product = useSelector((state) =>
    state.Productos.Productos.find((item) => item.id === Number(productoId))
  )

  const stock = useSelector((state) => state.Productos.stock[productoId])

  console.log(stock)
  const [cantidad, setCantidad] = useState(1)
  // const handleImageClick = () => {
  //   window.open(product.Image, '_blank')
  // }
  const handlerAddCart = () => {
    if (stock >= cantidad) {
      const productos = {
        id: product.id,
        image: product.img,
        nombre: product.nombre,
        precio: product.precio,
        quantity: cantidad,
      }

      dispatch(addToCart(productos))
      dispatch(reducirStock(product.id, cantidad))
    }
  }

  return (
    <div className="Details-conteiner">
      <h4>
        {product.Categoria} / {product.SubCategoria}
      </h4>
      {/*  */}
      <div >
        {/* Imagen principal */}
        <Swiper
          modules={[Thumbs]}
          spaceBetween={10}
          thumbs={{ swiper: thumbsSwiper }}
        >
          {product.img.map((image, i) => (
            <SwiperSlide key={i}>
              <img src={image} alt={`Imagen ${i}`} style={{ width: '100%' }} />
            </SwiperSlide>
          ))}
        </Swiper>

       
      </div>

      {/*  */}

      <div className="Details-info">
        <p className="Details-Nombre">{product.nombre}</p>
        <p className="Details-Categoria">Subnombre</p>
        {/* <p className="Details-Categoria">{product.Categoria}</p> */}
        <div className="separador"></div>
        {/* Descripcion */}
        <div className="Details-Descripcion">
          <p>Descripcion: </p>
          <span>
            Colgate Corazon de Acero Quirurgico con strass incrustados
          </span>
        </div>
        {/* modelo */}
        <div className="Details-Modelo">
          <div className="separador"></div>
          <div className='Details-Modelo-Nombre'>

           <p>Modelo </p>
          </div>
          <div className='Details-opciones-modelo'>
           <div className='op'>


          <h5>imagen1</h5>
          <button></button>
           </div>
           <div className='op'>

          <h5>imagen2</h5>
          <button></button>
           </div>
           <div className='op'>

          <h5>imagen3</h5>
          <button></button>
           </div>
          </div>
        </div>

        <div className="separador"></div>
        <div className="select-cantidad">
          <div className='conjunto-cantidad'>

          <p>Cantidad:</p>
          <div>
            <button
              onClick={() => setCantidad((prev) => Math.max(prev - 1, 1))}
            >
              -
            </button>
            <span>{cantidad}</span>
            <button
              onClick={() =>
                setCantidad((prev) => (prev < stock ? prev + 1 : prev))
              }
            >
              +
            </button>
          </div>
          </div>
          <div>
            {stock === 0 ? (
              <span className="sin-stock">Sin stock</span>
            ) : (
              <strong>Stock: {stock}</strong>
            )}
          </div>
        </div>
        <div className="separador"></div>
        <div>
          
        </div>

      </div>
      <div className='precio-boton'>


      <button
        className="button-card-details {
          "
        onClick={handlerAddCart}
        disabled={product.stock === 0}
      >
        {product.stock === 0 ? 'Sin stock' : 'Agregar al carrito'}
      </button>
          <p className="Details-Precio"> ${product.precio}</p>
      </div>
    </div>
  )
}

export default Details
