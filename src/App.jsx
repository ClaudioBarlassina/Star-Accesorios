import Menu from './Components/Menu'
import Productos from "./Components/Productos"
import data from "./assets/Data.json";
import './App.css'
import { useState } from 'react'
import { useFilters } from './Hook/Usefilter'
import Fotter from './Components/fotter';

function App() {
 
 const [Product] = useState(data)
  const {filterProduct} = useFilters();

  const fitroProductos = filterProduct(Product)
  console.log(fitroProductos)
  return (
    <>
    <Menu></Menu>
    <Productos prod={fitroProductos}/>
    {/* <Fotter datos={fitroProductos}/> */}
    </>
  )
}

export default App
