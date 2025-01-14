import Menu from './Components/Menu'
import Productos from "./Components/Productos"
import data from "./assets/Data.json";
import './App.css'
import { useState } from 'react'
import { useFilters } from './Hook/Usefilter'


function App() {
 
 const [Product] = useState(data)
  const {filterProduct} = useFilters();

  const fitroProductos = filterProduct(Product)
  
  return (
    <>
    <Menu></Menu>
    <Productos Prod={fitroProductos}/>
    {/* <Fotter datos={fitroProductos}/> */}
    </>
  )
}

export default App
