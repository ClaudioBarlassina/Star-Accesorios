import React, { useState } from "react";
import "./Productos.css";
import Card from "./Card";

function Productos(Prod) {
  return (
    <div className="productos">
{console.log(Prod)}
      {/* Productos */}
      <div className="productos-grid">
        {Prod.Prod.map((item) => (
          <Card
            key={item.id}
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
