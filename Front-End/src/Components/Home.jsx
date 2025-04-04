import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Productos from "../Components/Productos";
import { fetchProductos, selectFilteredProducts } from "../Redux/Reducer"; // Importa la acción y el selector

const Home = () => {
  const dispatch = useDispatch();
  
  // Obtiene los productos filtrados directamente de Redux
  const products = useSelector(selectFilteredProducts);
  // const loading = useSelector((state) => state.productos.loading);
  // const error = useSelector((state) => state.productos.error);

  useEffect(() => {
    dispatch(fetchProductos()); // Carga productos desde Supabase al montar el componente
  }, [dispatch]);

  // if (loading) return <p>Cargando productos...</p>;
  // if (error) return <p>Error al cargar productos: {error}</p>;

  return (
    <div>
      <Productos Prod={products} />
    </div>
  );
};

export default Home;