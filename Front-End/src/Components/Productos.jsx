import React from "react";
import "./Productos.css";
import Card from "./Card";

function Productos( {Prod }) { 
  console.log(Prod) // Extraemos Prod del objeto de props
 

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
            
          />
        ))}
      </div>
    </div>
  );
}

export default Productos;
