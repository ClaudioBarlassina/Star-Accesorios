import { useEffect, useState, useRef, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProductos } from "../Redux/Reducer";
import "./ProductosCarrusel.css";

const ProductosCarrusel = () => {
  const dispatch = useDispatch();
  const productos = useSelector((state) => state.Productos.Productos) || [];
  const [index, setIndex] = useState(0);
  const carruselRef = useRef(null);

  useEffect(() => {
    dispatch(fetchProductos());
  }, [dispatch]);

  const productosAleatorios = useMemo(() => {
    return [...productos].sort(() => Math.random() - 0.5);
  }, [productos]);

  useEffect(() => {
    const intervalo = setInterval(() => {
      setIndex((prev) => (prev + 1) % productosAleatorios.length);
    }, 4000);
    return () => clearInterval(intervalo);
  }, [productosAleatorios.length]);

  const handleAnterior = () => {
    setIndex((prev) => (prev - 1 + productosAleatorios.length) % productosAleatorios.length);
  };

  const handleSiguiente = () => {
    setIndex((prev) => (prev + 1) % productosAleatorios.length);
  };

  return (
    <section className="carrusel-container">
      <h2>Productos Destacados</h2>
      <div className="carrusel">
        <button className="flecha izquierda" onClick={handleAnterior}>‹</button>

        <div className="carrusel-viewport">
          <div
            className="carrusel-slider"
            ref={carruselRef}
            style={{
              transform: `translateX(-${Math.max(0, index - 1) * 300}px)`,
            }}
          >
            {productosAleatorios.map((producto) => (
              <div key={producto.id} className="carrusel-item">
                <img src={producto.Image} alt={producto.nombre} />
                <h3>{producto.nombre}</h3>
              </div>
            ))}
          </div>
        </div>

        <button className="flecha derecha" onClick={handleSiguiente}>›</button>
      </div>

      <div className="indicadores">
        {productosAleatorios.map((_, i) => (
          <span
            key={i}
            className={`dot ${i === index ? "activo" : ""}`}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </section>
  );
};

export default ProductosCarrusel;
