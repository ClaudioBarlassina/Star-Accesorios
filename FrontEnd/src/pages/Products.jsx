import { getProducts } from '../api/products.api'
import { useState, useEffect } from 'react'
import LayoutShop from '../components/layoudShopLogM/LayoutShop'
import AuthComponent from '../components/layoudShopLogM/components/AuthModal/AuthComponent'
import useAuthListener from '../components/layoudShopLogM/hooks/useAuthListener'
import useStore from '../store/useStore'
import Paginacion from "../components/PaginacionButon/Paginacion.jsx"
import GridCuadricula from '../components/Grid-Cuadricula/Grid'
import CardSW from '../components/Card1-EcomSW/CardSW'
import Filtros from '../components/FiltroAutomatico/FiltroAut'
import { useNavigate } from 'react-router-dom'

const Products = () => {
  const navigate = useNavigate()
  useAuthListener()
  const user = useStore((s) => s.user)
  const logout = useStore((s) => s.logout)
  const carrito = useStore((s) => s.Carrito)
  const incr = useStore((s) => s.addAumentar)
  const decr = useStore((s) => s.addDisminuir)
  const remov = useStore((s) => s.addEliminar)
  const addCarrito = useStore((s) => s.addCarrito)

  const [cartOpen, setCartOpen] = useState(false)
  const [products, setProducts] = useState([])
  const [onSearch, setOnSearch] = useState('')
  const [btnCateg, setBtnCateg] = useState('')
  const [pag, setPag] = useState({})
  const [es, setes] = useState(1)
  const [valores, setvalores] = useState({
    category: '',
    subcategory: '',
  })

  useEffect(() => {
    getProducts({
      category: valores.category,
      subcategory: valores.subcategory || btnCateg?.name,
      search: onSearch,
      page: es,
    })
      .then((res) => {
        const prods = res.data.products || res.data
        setProducts(prods)
        setPag(res.data)
      })
      .catch((err) => console.error('Error al cargar productos:', err))
  }, [valores, es, onSearch, btnCateg])

  const handler = (product) => {
    addCarrito(product)
    setCartOpen(true)
  }

  const handlerFinalizar = () => {
    navigate('/order')
  }

  return (
    <div>
      <LayoutShop
        user={user}
        logout={logout}
        authComponent={<AuthComponent />}
        prod={carrito}
        incr={incr}
        decr={decr}
        remov={remov}
        onSearch={(v) => setOnSearch(v)}
        cartOpen={cartOpen}
        setCartOpen={setCartOpen}
        EnlaseFinalizar={handlerFinalizar}
      >
        <div className="filtros" style={{ marginTop: '100px' }}>
          <h3 className="sectionTitle">Productos</h3>

          <Paginacion totalPaginas={pag.pages} pagina={pag.page} handler={setes}></Paginacion>

          <Filtros
            filters={[
              {
                name: 'category',
                label: 'Categoría',
                options: [
                  'Acero Quirurgico',
                  'Acero Dorado',
                  'Fantasia',
                  'Perfumes',
                  'Accesorios',
                ],
              },
              {
                name: 'subcategory',
                label: 'Subcategoría',
                options: [
                  'Aros',
                  'Anillos',
                  'Pulseras',
                  'Colgantes',
                  'Cadenas',
                  'Tobilleras',
                  'Perfumes',
                  'Cabello',
                ],
              },
            ]}
            onChange={(newValores) => {
              setvalores(newValores)
              setBtnCateg(null)
            }}
          ></Filtros>
        </div>

        <GridCuadricula minWidth={170} gap={15}>
          {products.map((item, index) => (
            <CardSW
              id={item._id}
              key={index}
              title={item.nombre}
              price={item.precio}
              images={item.images}
              onClick={() => navigate(`/product/${item._id}`)}
              action={
                <button className="addToCartBtn" onClick={() => handler(item)}>
                  Agregar al carrito
                </button>
              }
            ></CardSW>
          ))}
        </GridCuadricula>
      </LayoutShop>
    </div>
  )
}

export default Products
