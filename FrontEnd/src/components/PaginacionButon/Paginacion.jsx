import styles from './Paginacion.module.css'



export default function Paginacion({ totalPaginas, pagina, handler }) {

  const numeros = [...Array(totalPaginas)].map((_, index) => index + 1)

  return (
    <article>
      {numeros.map((item) => (
        <button
          key={item}
          onClick={() => handler(item)}
          className={`${styles.buttons}${pagina === item ? ' active' : ''}`}
        >
          {item}
        </button>
      ))}
    </article>
  )
}