import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import styles from "./Slider.module.css";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { getCarousel } from "../../api/carousel.api";

const imageModules = import.meta.glob('./img/*.{jpg,jpeg,png,webp,avif}', { eager: true })
const defaultImages = Object.values(imageModules).map(mod => mod.default)

export default function Carousel({ images: imagesProp }) {
  const [remoteImages, setRemoteImages] = useState(null)

  useEffect(() => {
    let activo = true
    getCarousel()
      .then((res) => {
        if (activo && Array.isArray(res.data) && res.data.length > 0) {
          setRemoteImages(res.data.map((img) => img.url))
        }
      })
      .catch(() => {})
    return () => {
      activo = false
    }
  }, [])

  const images = imagesProp || remoteImages || defaultImages

  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      navigation
      pagination={{ clickable: true }}
      autoplay={{ delay: 3000 }}
      speed={1000}
      loop={true}
      style={{ height: "60vh" }}
    >
      {images?.map((img, index) => (
        <SwiperSlide key={index} className={styles.slide}>
      <img src={img} alt={`slide-${index}`} className={styles.slideImg} />
    </SwiperSlide>
      ))}
    </Swiper>
  );
}
