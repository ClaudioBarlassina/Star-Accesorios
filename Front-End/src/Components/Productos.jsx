import React from "react";
import "./Productos.css";
import Card from "./Card";
import { useSelector } from "react-redux";

function Productos( {Prod }) { 
 
 
 const filtro = useSelector(state =>  state.Productos.filters)
  console.log(filtro.categoria)

  return (
    <div className="productos">
    <h2> Productos / {filtro.categoria}</h2>
    <div className="productos-grid">
      {Prod.map((item, index) => (
        <div
          key={item.id}
          data-aos="fade-up"
          data-aos-delay={index * 100}
        >
          <Card
            id={item.id}
            image={item.Image}
            nombre={item.nombre}
            precio={item.precio}
          />
        </div>
      ))}
    </div>
  </div>
  );
}

export default Productos;
