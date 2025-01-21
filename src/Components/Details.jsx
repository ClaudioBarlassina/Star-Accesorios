import React from 'react'
import { useParams, Link } from 'react-router-dom'
import Data from "../assets/Data.json"
import "./Details.css"

const Details = () => {
    const {productoId} = useParams();
     const product = Data.find((item) => item.id === productoId);
  console.log(product.nombre)
  
    return (
   <div className='Details-conteiner'>
    <Link to={"/"} className='button-card'>
    Volver</Link>
    <div>

    <img src={product.image} alt="" className='Details-image'/>
    </div>
    <div className='Details-info'>

   
    <p>Nombre : {product.nombre}</p>
    <p>Tipo Material: {product.Categoria}</p>
    <p>Categoria : {product.SubCategoria}</p>
    <p>Precio : {product.precio}</p>
    <p>Descripcion : {product.descripcion}</p>
   
    </div>
    <button className='button-card '>Agregar Al Carrito</button>
    </div>
  )
}

export default Details