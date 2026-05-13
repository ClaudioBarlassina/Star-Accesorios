import { useState } from 'react'
import styles from './Filtros.module.css'

export default function Filtros({ filters = [], onChange }) {
  const [values, setValues] = useState({})

  const handleChange = (name, value) => {
    const newValues = {
      ...values,
      [name]: value,
    }

    setValues(newValues)

    if (onChange) {
      onChange(newValues)
    }
  }

  return (
    <article className={styles.card}>
      <h3 className={styles.title}>Filtros</h3>

      <div className={styles.filtersContainer}>
        {filters.map((filter) => (
          <div key={filter.name} className={styles.selectGroup}>
            <label>{filter.label}</label>

            <select
              value={values[filter.name] || ''}
              onChange={(e) => handleChange(filter.name, e.target.value)}
            >
              <option value="">Todos</option>

              {filter.options.map((option, index) => {
                const label =
                  typeof option === 'object' ? Object.keys(option)[0] : option

                const value =
                  typeof option === 'object' ? Object.values(option)[0] : option

                return (
                  <option key={index} value={value}>
                    {label}
                  </option>
                )
              })}
            </select>
          </div>
        ))}
      </div>
    </article>
  )
}
