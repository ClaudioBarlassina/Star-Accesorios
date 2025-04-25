import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Productos from '../Components/Productos'
import { fetchProductos, selectFilteredProducts } from '../Redux/Reducer' // Importa la acción y el selector

const Home = () => {
  const dispatch = useDispatch()

  const products = useSelector(selectFilteredProducts)

  useEffect(() => {
    dispatch(fetchProductos()) // Carga productos desde Supabase al montar el componente
  }, [dispatch])

  return (
    <div>
      
      <Productos Prod={products} />
    </div>
  )
}

export default Home
