import React, { useState, useEffect } from 'react';
import './LandingPage.css';

const slides = [
  {
    titulo: 'Bienvenido a Star-Accesorios',
    subtitulo: 'Estilo, elegancia y actitud en cada detalle.',
    imagen: 'https://futuroastronomo.com.br/wp-content/uploads/2024/04/papeis-de-parede-celular-13-585x1024.jpg'
  },
  {
    titulo: 'Nuevos ingresos',
    subtitulo: 'Descubrí las últimas tendencias en accesorios.',
    imagen: 'https://media.gq.com.mx/photos/61d71814ed3f3306292cea9c/16:9/w_960,c_limit/joyeri%CC%81a-855839820.jpg'
  },
  {
    titulo: 'Envíos a todo el país',
    subtitulo: 'Comprá desde donde estés. Entregamos rápido.',
    imagen: 'https://noticiasyprotagonistas.com/wp-content/uploads/2019/03/envio-puerta-a-puerta.jpg'
  }
];

const Carrusel = () => {
  const [index, setIndex] = useState(0);

  const nextSlide = () => setIndex((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setIndex((prev) => (prev - 1 + slides.length) % slides.length);

  useEffect(() => {
    const interval = setInterval(() => nextSlide(), 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="carrusel-slide-wrapper">
      <div
        className="carrusel-track"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {slides.map((slide, i) => (
          <div
          key={i}
          className="carrusel-slide-horizontal"
          style={{
            backgroundImage: `url(${slide.imagen})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="carrusel-overlay">
            <div className="carrusel-contenido">
              <h1 className="carrusel-titulo">{slide.titulo}</h1>
              <p className="carrusel-subtitulo">{slide.subtitulo}</p>
            </div>
          </div>
          </div>
        ))}
      </div>

      <button className="carrusel-boton prev" onClick={prevSlide}>‹</button>
      <button className="carrusel-boton next" onClick={nextSlide}>›</button>
    </div>
  );
};

export default Carrusel;