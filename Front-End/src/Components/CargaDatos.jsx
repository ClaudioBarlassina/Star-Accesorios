import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import './CargaDatos.css'
import { useNavigate } from 'react-router-dom'

const AddProduct = () => {
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [images, setImages] = useState([])
  const [previewImages, setPreviewImages] = useState([])
  const [categoria, setCategoria] = useState('')
  const [subCategoria, setSubCategoria] = useState('')
  const [cantidad, setCantidad] = useState(1)
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()
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
    'Acero Quirurgico': [
      'Anillos',
      'Colgantes',
      'Aros',
      'Pulseras',
      'Piercing',
      'Accesorios',
    ],
    'Acero Blanco': ['Anillos', 'Colgantes', 'Aros', 'Pulseras'],
    'Acero Dorado': ['Anillos', 'Colgantes', 'Aros', 'Pulseras'],
    'Piedras Naturales': ['Dijes', 'Kits'],
    Fantasía: ['Anillos', 'Aros', 'Accesorios Cabello', 'Pulseras'],
    Cosméticos: ['Todos'],
    Relojes: ['Todos'],
  }

  useEffect(() => {
    return () => {
      if (previewImages) URL.revokeObjectURL(previewImages)
    }
  }, [images])

  const handleImageChange = (e) => {
    // const file = e.target.files[0];
    // if (file) {
    //   setImage(file);
    //   setPreviewImage(URL.createObjectURL(file)); // Mostrar previsualización en tiempo real
    // }
    const files = Array.from(e.target.files)
    setImages(files)
    const previews = files.map((file) => URL.createObjectURL(file))
    setPreviewImages(previews)
  }

  const handleCategoriaChange = (e) => {
    setCategoria(e.target.value)
    setSubCategoria('')
  }

  const handleCantidadChange = (e) => {
    const value = parseInt(e.target.value, 10)
    setCantidad(isNaN(value) || value <= 0 ? 1 : value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      let imageUrl = []

      for (const file of images) {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('upload_preset', 'activa')

        const response = await fetch(
          'https://api.cloudinary.com/v1_1/deo4yfqad/image/upload',
          {
            method: 'POST',
            body: formData,
          }
        )

        const data = await response.json()
        if (!response.ok) throw new Error('Error al subir la imagen')

        imageUrl.push(data.secure_url.replace('/upload/', '/upload/f_auto,q_auto/'))
        
      }

      const priceNumber = parseFloat(price)
      if (isNaN(priceNumber))
        throw new Error('El precio debe ser un número válido.')

      // Insertar la cantidad de productos con el stock actualizado
      const productosAInsertar = {
        nombre: name,
        precio: priceNumber,
        img: imageUrl,
        Categoria: categoria,
        SubCategoria: subCategoria,
        stock: cantidad, // Solo asignamos la cantidad ingresada al stock de un producto
      }

      // productosAInsertar

      const { error: insertError } = await supabase
        .from('Productos')
        .insert(productosAInsertar)
         console.log(productosAInsertar)
      if (insertError) throw insertError

      alert(`${cantidad} productos cargados exitosamente!`)
      setName('')
      setPrice('')
      setImages(null)
      setPreviewImages(null)
      setCategoria('')
      setSubCategoria('')
      setCantidad(1)
    } catch (error) {
      console.log(error)
      console.error('Error al subir productos:', error)
      alert('Hubo un error al subir los productos.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="conteiner-cargadatos">
        <div className="conjunto-botones-cart">
          <button
            className="botton-listado"
            onClick={() => navigate('/Productos')}
          >
            Listado Productos{' '}
          </button>
          <button
            className="botton-listado"
            onClick={() => navigate('/Pedidos')}
          >
            Listado de Pedidos{' '}
          </button>
        </div>

        <form className="Formulario" onSubmit={handleSubmit}>
          <h2>INGRESO DE PRODUCTOS</h2>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nombre del producto"
            required
          />
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Precio"
            required
          />

          {/* Selección de categoría */}
          <select value={categoria} onChange={handleCategoriaChange} required>
            <option value="">Selecciona una categoría</option>
            {categorias.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Selección de subcategoría */}
          {categoria && (
            <select
              value={subCategoria}
              onChange={(e) => setSubCategoria(e.target.value)}
              required
            >
              <option value="">Selecciona una subcategoría</option>
              {subCategorias[categoria]?.map((subCat) => (
                <option key={subCat} value={subCat}>
                  {subCat}
                </option>
              ))}
            </select>
          )}

          <input
            type="file"
            multiple
            onChange={handleImageChange}
            accept="img/*"
            required
          />

          <input
            type="number"
            // value={cantidad}
            onChange={handleCantidadChange}
            placeholder="Cantidad"
            min="1"
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? 'Subiendo...' : `Subir ${cantidad} Producto(s)`}
          </button>
        </form>

        {name &&
          price &&
          previewImages &&
          categoria &&
          subCategoria &&
          cantidad > 0 && (
            <div className="Previsualizacion">
              <h3>Previsualización</h3>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {previewImages.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`Previsualización ${i}`}
                    style={{
                      width: '100px',
                      height: '100px',
                      objectFit: 'cover',
                    }}
                  />
                ))}
              </div>

              <p>
                <strong>Nombre:</strong> {name}
              </p>
              <p>
                <strong>Precio:</strong> ${price}
              </p>
              <p>
                <strong>Categoría:</strong> {categoria}
              </p>
              <p>
                <strong>Subcategoría:</strong> {subCategoria}
              </p>
              <p>
                <strong>Cantidad:</strong> {cantidad}
              </p>
            </div>
          )}
      </div>
    </>
  )
}
export default AddProduct