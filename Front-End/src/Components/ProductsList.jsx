import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import './ProductsList.css'

const ProductList = () => {
  const [productos, setProductos] = useState([])
  const [editando, setEditando] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProductos = async () => {
      const { data, error } = await supabase.from('Productos').select('*')
      if (error) {
        console.error('Error al obtener productos:', error)
      } else {
        setProductos(data)
      }
    }
    fetchProductos()
  }, [])

  const handleDelete = async (id) => {
    const { error } = await supabase.from('Productos').delete().eq('id', id)
    if (!error) {
      setProductos(productos.filter((producto) => producto.id !== id))
    } else {
      console.error('Error al eliminar producto:', error)
    }
  }

  const handleEditChange = (id, field, value) => {
    setProductos(
      productos.map((prod) =>
        prod.id === id ? { ...prod, [field]: value } : prod
      )
    )
  }

  const handleSave = async (producto) => {
    const { error } = await supabase
      .from('Productos')
      .update({
        nombre: producto.nombre,
        precio: parseFloat(producto.precio),
        stock: parseInt(producto.stock, 10),
      })
      .eq('id', producto.id)

    if (!error) {
      setEditando(null)
    } else {
      console.error('Error al actualizar producto:', error)
    }
  }

  return (
    <div className="product-list-container">
      <h2 className="titulo">Lista de Productos</h2>
      <button className="boton-volver" onClick={() => navigate('/Admin')}>
        Volver
      </button>
      <ul className="lista-productos">
        {productos.map((producto) => (
          <li key={producto.id} className="producto-item">
            <img
              src={producto.img[0]}
              alt={producto.nombre}
              className="imagen-producto"
            />

            {editando === producto.id ? (
              <div className="edicion">
                <div className="inputs">
                  <span>Nombre</span>
                  <input
                    type="text"
                    value={producto.nombre}
                    onChange={(e) =>
                      handleEditChange(producto.id, 'nombre', e.target.value)
                    }
                    className="input-editar"
                  />
                </div>
                <div className="inputs">
                  <span>Precio</span>
                  <input
                    type="number"
                    value={producto.precio}
                    onChange={(e) =>
                      handleEditChange(producto.id, 'precio', e.target.value)
                    }
                    className="input-editar"
                  />
                </div>
                <div className="inputs">
                  <span>Stock</span>
                  <input
                    type="number"
                    value={producto.stock}
                    onChange={(e) =>
                      handleEditChange(producto.id, 'stock', e.target.value)
                    }
                    className="input-editar"
                  />
                </div>
                <button
                  className="boton guardar"
                  onClick={() => handleSave(producto)}
                >
                  Guardar
                </button>
                <button
                  className="boton cancelar"
                  onClick={() => setEditando(null)}
                >
                  Cancelar
                </button>
              </div>
            ) : (
              <div className="info-producto">
                <p className="nombre">
                  <strong>{producto.nombre}</strong>
                </p>
                <p className="precio">Precio: ${producto.precio}</p>
                <p className="stock">Stock: {producto.stock}</p>
                <button
                  className="boton editar"
                  onClick={() => setEditando(producto.id)}
                >
                  Editar
                </button>
                <button
                  className="boton eliminar"
                  onClick={() => handleDelete(producto.id)}
                >
                  Eliminar
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ProductList
