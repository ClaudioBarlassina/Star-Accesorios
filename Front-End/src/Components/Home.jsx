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


  const agruparProductosConStock = (productos) => {
    return productos.reduce((acc, producto) => {
      const existente = acc.find(p => p.nombre === producto.nombre);
      console.log(existente)
      if (existente) {
        existente.stock += 1; // 🔹 Cuenta cuántos productos iguales hay
        existente.cantidad += producto.cantidad; // 🔹 Suma las cantidades
      } else {
        acc.push({ ...producto, stock: 1 }); // 🔹 Inicializa stock y cantidad
      }
      return acc;
    }, []);
  };

  // const agruparProductosConStock = (productos) => {
  //   return productos.reduce((acc, producto) => {
  //     const existente = acc.find(p => p.nombre === producto.nombre);
  //     if (existente) {
  //       existente.stock += 1; // 🔹 Cuenta cuántos productos iguales hay
  //       existente.cantidad += producto.cantidad; // 🔹 Suma las cantidades
  //     } else {
  //       acc.push({ ...producto, stock: 1 }); // 🔹 Agrega la primera vez con stock = 1
  //     }
  //     return acc;
  //   }, []);
  // };
  

  const productosUnicos = agruparProductosConStock(filtroProductos);


useEffect(()=>{
  HandlerUsers2(dispatch)

},[dispatch])

  return (
    
   
    <div> 
    
    <Productos Prod={productosUnicos}/></div>
    
  )
}

export default Home