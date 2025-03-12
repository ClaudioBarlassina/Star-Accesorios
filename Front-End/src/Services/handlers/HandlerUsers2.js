// import {productosBD }from "../../Redux/Reducer.js";

// export const HandlerUsers2 = async dispatch => {
//   try {
//     const response = await fetch("https://star-accesorios.onrender.com/");

//     if (!response.ok) {
//       throw new Error("La respuesta de la red no fue exitosa");
//     }
//     const data = await response.json();
//     console.log(data)
//      dispatch(productosBD(data));
     
     
    

//   } catch (error) {
//       console.log("error de usuario", error);

//   }
// };
import { productosBD } from "/src/Redux/Reducer.js";  // Asegúrate de que productosBD esté exportado correctamente
import { supabase } from '../../supabaseClient';  // Importa tu cliente de Supabase

export const HandlerUsers2 = async (dispatch) => {
  try {
    // Realizar la solicitud a Supabase para obtener los productos
    const { data, error } = await supabase
      .from('Productos')  // Cambia 'Productos' por el nombre de tu tabla en Supabase
      .select('id ,nombre, precio, "Image", Categoria, SubCategoria'); // Seleccionamos las columnas necesarias

    // Manejo de errores en caso de que la consulta falle
    if (error) {
      throw new Error(error.message);
    }

    // Verificar que data contiene los productos
    if (!data || data.length === 0) {
      throw new Error("No se encontraron productos en la base de datos");
    }

    console.log("Productos obtenidos desde Supabase:", data);

    // Despachar los productos a la acción de Redux
    dispatch(productosBD(data));

  } catch (error) {
    // Manejo de errores
    console.error("Error al obtener productos:", error.message);
  }
};
