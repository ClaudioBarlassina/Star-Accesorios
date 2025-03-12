import React from "react";
import "./Productos.css";
import Card from "./Card";

function Productos( {Prod }) { 
  console.log(Prod) // Extraemos Prod del objeto de props
  // if (!Prod || !Array.isArray(Prod.Productos)) {
  //   console.error("Prod.Productos no es un array", Prod);
  //   return null;  // Evita errores si la estructura no es la esperada.
  // }

  return (
    <div className="productos">
      <div className="productos-grid">
        {Prod.map((item) => (
          <Card
            key={item.id}
            id={item.id}
            image={item.Image}
            nombre={item.nombre}
            precio={item.precio}
            stock={item.stock}
          />
        ))}
      </div>
    </div>
  );
}

export default Productos;
