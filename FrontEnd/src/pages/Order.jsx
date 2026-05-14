import { useState } from 'react'
import OrderSummary from "../components/OrderSumary/OrderSummary"
import useStore from "../store/useStore"
import { useNavigate } from 'react-router-dom'
import LayoutShop from "../components/layoudShopLogM/LayoutShop"
import AuthComponent from "../components/layoudShopLogM/components/AuthModal/AuthComponent"
import useAuthListener from "../components/layoudShopLogM/hooks/useAuthListener"

const Order = () => {
    const navigate = useNavigate()
    const [cartOpen, setCartOpen] = useState(false)
    const user = useStore(state => state.user)
    const logout = useStore(state => state.logout)
    const items = useStore(state => state.Carrito)
    const incrementar = useStore(state => state.addAumentar)
    const decrementar = useStore(state => state.addDisminuir)
    const eliminar = useStore(state => state.addEliminar)
    useAuthListener()

    const handleCheckout = () => {
      if (items.length === 0) return
      navigate("/checkout")
    }
    const handleContinue = () => {
      navigate("/")
    }

    return (
      <LayoutShop
        user={user}
        logout={logout}
        authComponent={<AuthComponent />}
        prod={items}
        incr={incrementar}
        decr={decrementar}
        remov={eliminar}
        cartOpen={cartOpen}
        setCartOpen={setCartOpen}
      >
        <OrderSummary
          items={items}
          onIncrease={incrementar}
          onDecrease={decrementar}
          onRemove={eliminar}
          onCheckout={handleCheckout}
          onContinue={handleContinue}
        />
      </LayoutShop>
    )
}

export default Order