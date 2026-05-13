import styles from "./Grid.module.css"

export default function Grid({ children, minWidth = 0, gap = 1 }) {
  return (
    <div
      className={styles.grid}
      style={{
        "--min": `${minWidth}px`,
        "--gap": `${gap}px`
      }}
    >
      {children}
    </div>
  )
}
