import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

import styles from "./CategorySliderT.module.css";

export default function CategorySlider({ categories = [], onSelect }) {
  return (
    <Swiper
    autoplay={{ delay: 3000 }}
      speed={1000} 
      grabCursor={true}
      breakpoints={{
        0: {
          slidesPerView: 4.5,
          spaceBetween: 5,
        },
        425: {
          slidesPerView: 5,
          spaceBetween: 8,
        },
        1024: {
          slidesPerView: 5,
          spaceBetween: 10,
        },
      }}
    >
      {categories?.map((cat, index) => (
        <SwiperSlide key={index} className={styles.slide}>
          <button
            className={styles.card}
            onClick={() => onSelect?.(cat)}
          >
            <div className={styles.imageWrapper}>
              <img
                src={cat.image || "/placeholder.jpg"}
                alt={cat.name}
                className={styles.image}
              />
            </div>

            <span className={styles.title}>{cat.name}</span>
          </button>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}