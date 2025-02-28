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
    
  //conexion por el JSON 
  // const [Product] = useState(data)
  // const {filterProduct} = useFilters();
  // const fitroProductos = filterProduct(Product)
useEffect(()=>{
  HandlerUsers2(dispatch)

},[dispatch])

  return (
    
   
    <div> 
    
    <Productos Prod={products}/></div>
    
  )
}

export default Home