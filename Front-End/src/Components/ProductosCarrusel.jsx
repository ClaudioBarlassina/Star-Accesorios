import { useEffect, useRef, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProductos } from "../Redux/Reducer";
import "./ProductosCarrusel.css";

const ProductosCarrusel = () => {
  const carruselRef = useRef(null);
  const [index, setIndex] = useState(0);
  const dispatch = useDispatch();

  const productos = useSelector((state) => state.Productos.Productos) || [];

  const productosAleatorios = useMemo(() => {
    return [...productos].sort(() => Math.random() - 0.5).slice(0, 3);
  }, [productos]);

  useEffect(() => {
    dispatch(fetchProductos());
  }, [dispatch]);

  useEffect(() => {
    if (productosAleatorios.length === 0) return;

    const intervalo = setInterval(() => {
      setIndex((prev) => (prev + 1) % productosAleatorios.length);
    }, 7000);

    return () => clearInterval(intervalo);
  }, [productosAleatorios]);

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
        {productosAleatorios.map((producto) => (
          <div key={producto.id} className="producto-card">
            <img className="producto-imagen" src={producto.Image} alt={producto.nombre} />
            <h3 className="producto-nombre">{producto.nombre}</h3>
            <p className="producto-descripcion">{producto.descripcion}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductosCarrusel;
