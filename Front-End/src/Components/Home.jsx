import React, { useEffect } from 'react'
import {useDispatch, useSelector} from "react-redux"
import Productos from "../Components/Productos"
import { HandlerUsers2 } from '../Services/handlers/HandlerUsers2';
import data from "../assets/Data.json";
import { useState } from 'react'
import { useFilters } from '../Hook/Usefilter'


const Home = () => {

  const dispatch = useDispatch();
  const products = useSelector(state => state.Productos)
    console.log(products)
  //conexion por el JSON 
  // const [Product] = useState(data)

  const {filterProduct} = useFilters();
  const filtroProductos = filterProduct(products.Productos)
  console.log(filtroProductos)


  const agruparProductosUnicos = (productos) => {
    const vistos = new Set();
    return productos.filter(producto => {
      if (!vistos.has(producto.nombre)) {
        vistos.add(producto.nombre);
        return true;
      }
      return false;
    });
  };


  const productosUnicos = agruparProductosUnicos(filtroProductos);


useEffect(()=>{
  HandlerUsers2(dispatch)

},[dispatch])

  return (
    
   
    <div> 
    
    <Productos Prod={productosUnicos}/></div>
    
  )
}

export default Home