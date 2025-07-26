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
      <h4>{product.Categoria} / {product.SubCategoria}</h4>
    {/*  */}
 <div style={{ width: '100%', maxWidth: '600px', margin: '0 auto' }}>
      {/* Imagen principal */}
      <Swiper
        modules={[Thumbs]}
        spaceBetween={10}
        thumbs={{ swiper: thumbsSwiper }}
      >
        {product.img.map((image, i) => (
          <SwiperSlide key={i}>
            <img src={image} alt={`Imagen ${i}`} style={{ width: '100%', height:"400px", objectFit:"cover "}} />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Miniaturas */}
      <Swiper
        onSwiper={setThumbsSwiper}
        spaceBetween={10}
        slidesPerView={5}
        freeMode={true}
        watchSlidesProgress={true}
        style={{ marginTop: '10px' }}
      >

        
        {product.img.map((img, i) => (
          <SwiperSlide key={i}>
            <img
              src={img}
              alt={`Miniatura ${i}`}
              style={{
                width: '100%',
                height: '60px',
                objectFit: 'cover',
                borderRadius: '4px',
              }}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>


{/*  */}

    
      <div className="Details-info">
        <p className="Details-Nombre">{product.nombre}</p>
        <p className="Details-Categoria">{product.Categoria}</p>
        <p className="Details-Precio">Precio: ${product.precio}</p>
        <div className="separador"></div>
        <p>{product.descripcion}</p>
        <div className="select-cantidad">
          <p>Cant:</p>
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
          <div>
            {stock === 0 ? (
              <span className="sin-stock">Sin stock</span>
            ) : (
              <strong>Stock: {stock}</strong>
            )}
          </div>
        </div>

        <div className="separador"></div>
      </div>

      <button
        className="button-card-details {
"
        onClick={handlerAddCart}
        disabled={product.stock === 0}
      >
        {product.stock === 0 ? 'Sin stock' : 'Agregar al carrito'}
      </button>
    </div>
  )
}

export default Details
