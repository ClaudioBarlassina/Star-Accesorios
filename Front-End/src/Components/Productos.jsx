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
            image={"https://img.freepik.com/vector-premium/bolsa-compras-3d-que-ha-convertido-malla-vectorial-que-puede-ampliar-cualquier-tamano_331343-1.jpg?w=740"}
            nombre={item.nombre}
            precio={item.precio}
            descripcion={item.descripcion}
          />
        ))}
      </div>
    </div>
  );
}

export default Productos;
