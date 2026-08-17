import { useState } from 'react'
import MisPedidos from '../components/MisPedidos/MisPedidos'
import useStore from "../store/useStore"
import LayoutShop from "../components/layoudShopLogM/LayoutShop"
import AuthComponent from "../components/layoudShopLogM/components/AuthModal/AuthComponent"
import useAuthListener from "../components/layoudShopLogM/hooks/useAuthListener"

const MisPedidosPage = () => {
  const [cartOpen, setCartOpen] = useState(false)
  const user = useStore(state => state.user)
  const logout = useStore(state => state.logout)
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
      <MisPedidos />
    </LayoutShop>
  )
}

export default MisPedidosPage
