import React from 'react'

import Productos from "../Components/Productos"
import data from "../assets/Data.json";
import { useState } from 'react'
import { useFilters } from '../Hook/Usefilter'

const Home = () => {

    const [Product] = useState(data)
    const {filterProduct} = useFilters();
  
    const fitroProductos = filterProduct(Product)


  return (
    

    <div> 
    <Productos Prod={fitroProductos}/></div>
   
  )
}

export default Home