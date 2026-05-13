import { getProducts } from '../api/products.api'

import { useState, useEffect } from 'react'
import LayoutShop from '../components/layoudShopLogM/LayoutShop'
import AuthComponent from '../components/layoudShopLogM/components/AuthModal/AuthComponent'
import useAuthListener from '../components/layoudShopLogM/hooks/useAuthListener'
import useStore from '../store/useStore'
import Carousel from '../components/CarouselBigSwiper/Carousel'
import CategorySlider from '../components/CarouselCategoriasT/CategorySliderT'
import Paginacion from "../components/PaginacionButon/Paginacion.jsx"

import anillo from '../components/CarouselCategoriasT/img/anillos.avif'
import aros from '../components/CarouselCategoriasT/img/aros.webp'
import pulseras from '../components/CarouselCategoriasT/img/pulseras.avif'
import colgantes from '../components/CarouselCategoriasT/img/colgantes.jpg'
import cadenas from '../components/CarouselCategoriasT/img/cadenas.webp'
import tobillera from '../components/CarouselCategoriasT/img/tobilleras.webp'
import perfumes from '../components/CarouselCategoriasT/img/perfumes.avif'
import cabello from '../components/CarouselCategoriasT/img/cabellos.webp'

import GridCuadricula from '../components/Grid-Cuadricula/Grid'
import CardSW from '../components/Card1-EcomSW/CardSW'
import Filtros from '../components/FiltroAutomatico/FiltroAut'
import { useNavigate } from 'react-router-dom'


const Home = () => {
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
    }) // opcional: filtros
      .then((res) => {
        // tu backend devuelve JSON
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
        authComponent={<AuthComponent />} // 🔥 magia
        prod={carrito}
        incr={incr}
        decr={decr}
        remov={remov} 
        onSearch={(v) => setOnSearch(v)}
        cartOpen={cartOpen}
        setCartOpen={setCartOpen}
        EnlaseFinalizar={handlerFinalizar}
      >
        <div className="carousel">
          <Carousel />
        </div>
        <CategorySlider
          categories={[
            { name: 'Anillos', image: anillo },
            { name: 'Aros', image: aros },
            { name: 'Pulseras', image: pulseras },
            { name: 'Colgantes', image: colgantes },
            { name: 'Cadenas', image: cadenas },
            { name: 'Tobilleras', image: tobillera  },
            { name: 'Perfumes', image: perfumes },
            { name: 'Cabello', image: cabello },
          ]}
          onSelect={(cat) => {
            setBtnCateg(cat)
            setvalores({ category: '', subcategory: '' }) // 🔥 limpia filtros
          }}
        />
        <div className="filtros">
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
              setBtnCateg(null) // 🔥 limpia botón
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
                <button
                  className="addToCartBtn"
                onClick={() => handler(item)}>
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

export default Home
