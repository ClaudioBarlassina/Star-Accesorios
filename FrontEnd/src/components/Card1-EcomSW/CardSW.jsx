import { useMemo } from "react"
import styles from "./CardSW.module.css"

import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination, Autoplay } from "swiper/modules"

export default function Card({
 
  onClick,
  images = [],
  title,
  price,
  children,
  action,
  className = ""
}) {

  // 🔥 delay aleatorio entre 2000ms y 5000ms
  const randomDelay = useMemo(() => {
    return Math.floor(Math.random() * 3000) + 2000
  }, [])

  return (
    <article className={`${styles.card} ${className}`}>

      {images.length > 0 && (
        <div className={styles.imageWrapper}>
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            // navigation
            // pagination={{ clickable: true }}
            autoplay={{
              delay: randomDelay,
              disableOnInteraction: false
            }}
            loop={images.length > 1}
          onClick={onClick}>
            {images.map((img, i) => (
              <SwiperSlide key={i}>
                <img src={img.url} alt={`${title}-${i}`} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}

      <div className={styles.content}>
        {title && <h3 className={styles.title}>{title}</h3>}
        {price && <span className={styles.price}>${price}</span>}
        {children}
      </div>

      {action && (
        <div className={styles.footer}>
          {action}
        </div>
      )}
    </article>
  )
}