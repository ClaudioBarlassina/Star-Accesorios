import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProductos } from "../Redux/Reducer";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./ProductosCarrusel.css";

const ProductosCarrusel = () => {
  const dispatch = useDispatch();
  const productos = useSelector((state) => state.Productos.Productos) || [];

  useEffect(() => {
    dispatch(fetchProductos());
  }, [dispatch]);

  const productosAleatorios = [...productos].sort(() => Math.random() - 0.5);

  return (
    <section className="carrusel-container">
      <h2>Productos Destacados</h2>
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        // spaceBetween={20}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 4000 }}
        loop={true}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
      >
        {productosAleatorios.map((producto) => (
          <SwiperSlide key={producto.id}>
            <div className="carrusel-item">
              <img src={producto.img[0]} alt={producto.nombre} />
              <h3>{producto.nombre}</h3>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default ProductosCarrusel;
