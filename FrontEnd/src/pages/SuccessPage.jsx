import { useState } from 'react'
import Success from '../components/Success/Success'
import useStore from "../store/useStore"
import LayoutShop from "../components/layoudShopLogM/LayoutShop"
import AuthComponent from "../components/layoudShopLogM/components/AuthModal/AuthComponent"
import useAuthListener from "../components/layoudShopLogM/hooks/useAuthListener"

const SuccessPage = () => {
    const [cartOpen, setCartOpen] = useState(false)
    const user = useStore(state => state.user)
    const logout = useStore(state => state.logout)
    const Pedidos = useStore(state => state.Pedidos)
    useAuthListener()

  return (
    <LayoutShop
      user={user}
      logout={logout}
      authComponent={<AuthComponent />}
      prod={[]}
      cartOpen={cartOpen}
      setCartOpen={setCartOpen}
    >
      <Success order={Pedidos} />
    </LayoutShop>
  )
}

export default SuccessPage