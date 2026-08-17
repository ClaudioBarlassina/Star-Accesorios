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
  const ok = await addPedidos(data)
  console.log("Pedido enviado:", data)
  return ok
}
const handler1 = () => {
  const pedidos = useStore.getState().Pedidos
  const ultimo = pedidos[pedidos.length - 1]
  if (ultimo?._id) {
    sessionStorage.setItem("recibo_autodownload", ultimo._id)
  }
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
      <Checkout productos={carrito} onConfirm={handler} onSubmit={handler1} />
    </div>
  </LayoutShop>
  )
}

export default CheckoutPage