import styles from "./CardCarrito.module.css"

export default function Card({
  image,
  title,
  subtitle,
  price,
  quantity = 1,
  onIncrease,
  onDecrease,
  onRemove
}) {
  return (
    <article className={styles.card}>
      
      <div className={styles.imageWrapper}>
        <img src={image} alt={title} />
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        {subtitle && (
          <span className={styles.subtitle}>{subtitle}</span>
        )}
        <span className={styles.price}>${price}</span>

        <div className={styles.bottomRow}>
          <div className={styles.quantity}>
            <button onClick={onDecrease} disabled={quantity <= 1}>−</button>
            <span>{quantity}</span>
            <button onClick={onIncrease}>+</button>
          </div>

          <button 
            className={styles.removeBtn}
            onClick={onRemove}
          >
            🗑
          </button>
        </div>
      </div>

    </article>
  )
}
