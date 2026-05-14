import { useState, useEffect } from 'react'
import { useParams } from "react-router-dom"
import DetailsComponent from "../components/Details3/ProductDetails.jsx"
import { getProductById } from "../api/products.api"
import LayoutShop from "../components/layoudShopLogM/LayoutShop"
import AuthComponent from "../components/layoudShopLogM/components/AuthModal/AuthComponent"
import useAuthListener from "../components/layoudShopLogM/hooks/useAuthListener"
import useStore from "../store/useStore"

const Details = () => {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [cartOpen, setCartOpen] = useState(false)
  const user = useStore((s) => s.user)
  const logout = useStore((s) => s.logout)
  const carrito = useStore((s) => s.Carrito)
  const incr = useStore((s) => s.addAumentar)
  const decr = useStore((s) => s.addDisminuir)
  const remov = useStore((s) => s.addEliminar)
  useAuthListener()

  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    getProductById(id)
      .then(res => setProduct(res.data))
      .catch(err => {
        console.error("Error al cargar producto:", err)
        setProduct(null)
        setError("No se pudo cargar el producto")
      })
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <LayoutShop
        user={user}
        logout={logout}
        authComponent={<AuthComponent />}
        prod={carrito}
        incr={incr}
        decr={decr}
        remov={remov}
        cartOpen={cartOpen}
        setCartOpen={setCartOpen}
        onSearch={() => {}}
      >
        <div style={{ textAlign: 'center', padding: '4rem', fontFamily: 'var(--body)', color: 'var(--text-secondary)', animation: 'pulse 1.5s ease infinite' }}>Cargando producto...</div>
      </LayoutShop>
    )
  }

  if (error) {
    return (
      <LayoutShop
        user={user}
        logout={logout}
        authComponent={<AuthComponent />}
        prod={carrito}
        incr={incr}
        decr={decr}
        remov={remov}
        cartOpen={cartOpen}
        setCartOpen={setCartOpen}
        onSearch={() => {}}
      >
        <div style={{ textAlign: 'center', padding: '4rem', fontFamily: 'var(--body)', color: 'var(--text-secondary)' }}>{error}</div>
      </LayoutShop>
    )
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
        cartOpen={cartOpen}
        setCartOpen={setCartOpen}
        onSearch={() => {}}
      >
        <DetailsComponent product={product} />
      </LayoutShop>
    </div>
  )
}

export default Details