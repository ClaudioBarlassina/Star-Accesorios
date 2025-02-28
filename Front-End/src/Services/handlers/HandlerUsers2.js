import {productosBD }from "../../Redux/Reducer.js";

export const HandlerUsers2 = async dispatch => {
  try {
    const response = await fetch("http://localhost:3001");

    if (!response.ok) {
      throw new Error("La respuesta de la red no fue exitosa");
    }
    const data = await response.json();
    console.log(data)
     dispatch(productosBD(data));
     
     
    

  } catch (error) {
      console.log("error de usuario", error);

  }
};
