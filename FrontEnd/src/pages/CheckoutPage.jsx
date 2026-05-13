import { useState } from 'react'
import Checkout from "../components/Checkout/Checkout"
import useStore from "../store/useStore"
import {useNavigate} from 'react-router-dom'
import LayoutShop from "../components/layoudShopLogM/LayoutShop"
import AuthComponent from "../components/layoudShopLogM/components/AuthModal/AuthComponent"
import useAuthListener from "../components/layoudShopLogM/hooks/useAuthListener"

const CheckoutPage = () => {
const [cartOpen, setCartOpen] = useState(false)
const navigate = useNavigate()
const user = useStore(state => state.user)
const logout = useStore(state => state.logout)
const carrito = useStore(state => state.Carrito)
const addPedidos = useStore(state => state.addPedidos)
useAuthListener()

const handler = async (data) => {
  await addPedidos(data)
}
const handler1 = () => {
 navigate("/success")
}

return (
  <LayoutShop
    user={user}
    logout={logout}
    authComponent={<AuthComponent />}
    prod={carrito}
    cartOpen={cartOpen}
    setCartOpen={setCartOpen}
  >
    <div style={{ marginTop: '80px' }}>
      <Checkout productos={carrito} onConfirm={handler} onSubmit={handler1}/>
    </div>
  </LayoutShop>
  )
}

export default CheckoutPage