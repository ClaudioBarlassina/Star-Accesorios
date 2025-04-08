import { useEffect, useRef, useState } from "react";
import "./ProductosCarrusel.css"; // lo creamos después

const productos = [1, 2, 3];

const ProductosCarrusel = () => {
  const carruselRef = useRef(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const intervalo = setInterval(() => {
      setIndex((prev) => (prev + 1) % productos.length);
    }, 5000);
    return () => clearInterval(intervalo);
  }, []);

  useEffect(() => {
    if (carruselRef.current) {
      carruselRef.current.scrollTo({
        left: carruselRef.current.offsetWidth * index,
        behavior: "smooth",
      });
    }
  }, [index]);

  return (
    <section id="productos" className="landing-section productos-section">
      <h2 className="section-title">Productos destacados</h2>
      <div className="productos-carrusel" ref={carruselRef}>
        {productos.map((item) => (
          <div key={item} className="producto-card">
            <div className="producto-imagen"></div>
            <h3 className="producto-nombre">Producto {item}</h3>
            <p className="producto-descripcion">Descripción corta del producto</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductosCarrusel;
