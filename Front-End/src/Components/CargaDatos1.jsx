import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import './CargaDatos.css'

const CargaDatos1 = () => {
  const navigate = useNavigate()
  const nombreRef = useRef(null) // ref para el primer input

  // Estado principal del producto
  const [producto, setProducto] = useState({
    id: Date.now(),
    name: '',
    price: '',
    categoria: '',
    subCategoria: '',
    modelos: [], // cada modelo es { id, nombre, cantidad, archivo }
  })

  // Categorías y subcategorías
  const categorias = [
    'Acero Quirurgico',
    'Acero Blanco',
    'Acero Dorado',
    'Piedras Naturales',
    'Fantasía',
    'Cosméticos',
    'Relojes',
  ]

  const subCategorias = {
    'Acero Quirurgico': ['Anillos', 'Colgantes', 'Aros', 'Pulseras', 'Piercing', 'Accesorios'],
    'Acero Blanco': ['Anillos', 'Colgantes', 'Aros', 'Pulseras'],
    'Acero Dorado': ['Anillos', 'Colgantes', 'Aros', 'Pulseras'],
    'Piedras Naturales': ['Dijes', 'Kits'],
    Fantasía: ['Anillos', 'Aros', 'Accesorios Cabello', 'Pulseras'],
    Cosméticos: ['Todos'],
    Relojes: ['Todos'],
  }

  // Guardar producto
  const handleGuardar = async () => {
    if (!producto.name || !producto.price || !producto.categoria) {
      alert('Por favor completa nombre, precio y categoría')
      return
    }

    try {
      // Subir imágenes de los modelos a Cloudinary
      const modelosConUrl = []

      for (const modelo of producto.modelos) {
        let url = null
        if (modelo.archivo) {
          const formData = new FormData()
          formData.append('file', modelo.archivo)
          formData.append('upload_preset', 'activa')

          const response = await fetch(
            'https://api.cloudinary.com/v1_1/deo4yfqad/image/upload',
            { method: 'POST', body: formData }
          )

          const data = await response.json()
          if (!response.ok) throw new Error('Error al subir la imagen')

          url = data.secure_url.replace('/upload/', '/upload/f_auto,q_auto/')
        }

        modelosConUrl.push({
          id: modelo.id,
          nombre: modelo.nombre,
          cantidad: modelo.cantidad,
          url,
        })
      }

      // Crear objeto producto para Supabase
      const nuevoProducto = {
        id: producto.id,
        nombre: producto.name,
        precio: producto.price,
        Categoria: producto.categoria,
        SubCategoria: producto.subCategoria,
        Modelo: modelosConUrl,
      }

      const { data, error } = await supabase.from('Productos').insert([nuevoProducto])

      if (error) {
        console.error('Error al guardar:', error)
        alert('Error al guardar producto ❌')
      } else {
        alert('Producto guardado con éxito ✅')

        // Limpiar formulario
        setProducto({
          id: Date.now(),
          name: '',
          price: '',
          categoria: '',
          subCategoria: '',
          modelos: [],
        })

        // Volver focus al primer input
        nombreRef.current.focus()
      }
    } catch (err) {
      console.error('Error inesperado:', err)
      alert('Ocurrió un error al subir las imágenes ❌')
    }
  }

  return (
    <div className="conteiner-cargadatos">
      <div className="conjunto-botones-cart">
        <button className="botton-listado" onClick={() => navigate('/Productos')}>Listado Productos</button>
        <button className="botton-listado" onClick={() => navigate('/Pedidos')}>Listado de Pedidos</button>
      </div>

      <form className="Formulario">
        <h2>INGRESO DE PRODUCTOS</h2>

        <input
          ref={nombreRef}
          type="text"
          placeholder="Nombre del producto"
          value={producto.name}
          onChange={(e) => setProducto({ ...producto, name: e.target.value })}
        />

        <input
          type="number"
          placeholder="Precio"
          value={producto.price}
          onChange={(e) => setProducto({ ...producto, price: e.target.value })}
        />

        <select
          value={producto.categoria}
          onChange={(e) =>
            setProducto({ ...producto, categoria: e.target.value, subCategoria: '' })
          }
        >
          <option value="">Selecciona una categoría</option>
          {categorias.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
        </select>

        {producto.categoria && (
          <select
            value={producto.subCategoria}
            onChange={(e) => setProducto({ ...producto, subCategoria: e.target.value })}
            required
          >
            <option value="">Selecciona una subcategoría</option>
            {subCategorias[producto.categoria]?.map((subCat) => (
              <option key={subCat} value={subCat}>{subCat}</option>
            ))}
          </select>
        )}

        <h2>Modelos</h2>
        {producto.modelos.map((m, i) => (
          <div key={m.id} className="conjunto-imagen-nombre">
            <input
              type="text"
              placeholder="Nombre del modelo"
              value={m.nombre}
              onChange={(e) => {
                const nuevosModelos = [...producto.modelos]
                nuevosModelos[i].nombre = e.target.value
                setProducto({ ...producto, modelos: nuevosModelos })
              }}
            />
            <input
              type="number"
              placeholder="Cantidad"
              value={m.cantidad}
              onChange={(e) => {
                const nuevosModelos = [...producto.modelos]
                nuevosModelos[i].cantidad = e.target.value
                setProducto({ ...producto, modelos: nuevosModelos })
              }}
            />
            <input
              type="file"
              onChange={(e) => {
                const nuevosModelos = [...producto.modelos]
                nuevosModelos[i].archivo = e.target.files[0]
                setProducto({ ...producto, modelos: nuevosModelos })
              }}
            />
          </div>
        ))}

        <button
          type="button"
          onClick={() =>
            setProducto({
              ...producto,
              modelos: [
                ...producto.modelos,
                { id: Date.now(), nombre: '', cantidad: '', archivo: null },
              ],
            })
          }
        >
          ➕ Agregar Modelo
        </button>

        <button type="button" onClick={handleGuardar}>Enviar</button>
      </form>
    </div>
  )
}

export default CargaDatos1
