import React from "react";
import "./Productos.css";
import Card from "./Card";
import { useSelector } from "react-redux";

function Productos( {Prod }) { 
 
 
 const filtro = useSelector(state =>  state.Productos.filters)
  console.log(filtro.categoria)

  return (
    <div className="productos">
    <h2>  {filtro.categoria} / {filtro.subcategoria}</h2>
    <div className="productos-grid">
      {Prod.map((item, index) => (
        <div
          key={item.id}
          // data-aos="fade-up"
          // data-aos-delay={index * 30}
        >
          <Card
            id={item.id}
            img={Array.isArray(item.img) ? item.img[0] : item.img}
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
