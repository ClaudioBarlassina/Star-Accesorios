import { useMemo } from "react"
import styles from "./CardSW.module.css"

import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination, Autoplay } from "swiper/modules"

function StockBadge({ stock }) {
  if (stock === undefined || stock === null) return null
  if (stock <= 0) return <span className={`${styles.stockBadge} ${styles.stockOut}`}>Agotado</span>
  if (stock === 1) return <span className={`${styles.stockBadge} ${styles.stockLow}`}>Última unidad</span>
  if (stock <= 5) return <span className={`${styles.stockBadge} ${styles.stockLow}`}>{stock} uni</span>
  return <span className={`${styles.stockBadge} ${styles.stockOk}`}>{stock} uni</span>
}

export default function Card({
  onClick,
  images = [],
  title,
  price,
  stock,
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
        <StockBadge stock={stock} />
        {children}
      </div>

      {action && (
        <div className={styles.footer}>
          {stock !== undefined && stock !== null && stock <= 0 ? (
            <button disabled className={styles.button} style={{ opacity: 0.5, cursor: 'not-allowed', borderColor: '#dc2626', color: '#dc2626' }}>
              Agotado
            </button>
          ) : action}
        </div>
      )}
    </article>
  )
}