import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Menu from '../src/Components/Menu'
import Home from './Components/Home'
import Details from './Components/Details'
import Cart from './Components/Cart'
import LandingPage from './Components/landingPage'
import CargaDatos from './Components/CargaDatos1'
import ProductsList from './Components/ProductsList'
import OrderSummary from './Components/OrderSummary'
import PedidosList from './Components/PedidosList'
import { useEffect } from 'react'
import AOS from "aos";
import Footer from './Components/fotter'
import {
  ToastContainer,
  toast,
  Slide,
  Flip,
  Bounce,
  Zoom,
} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import whats from '../src/assets/social.png'

function App() {

  useEffect(( ) => {
    AOS.init({duration:2000})
  },[])



  return (
    <div>
      {/* Esto se ve solo en pantallas grandes */}
      <div
        className="only-mobile"
        style={{ padding: '2rem', textAlign: 'center' }}
      >
        <h2>¡Esta página solo está disponible en dispositivos móviles!</h2>
        <p>Por favor, accedé desde tu celular.</p>
      </div>

      {/* Esto es el sitio real, que se oculta en pantallas grandes */}
      <div className="not-mobile">
        <Router>
        

          <a
            href="https://wa.me/5493537571489?text=Hola!%20Quiero%20más%20info%20sobre.. "
            className="whatsapp-float"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img className="image-whats" src={whats} alt="WhatsApp" />
          </a>

          <Menu />

          <ToastContainer
            transition={Flip}
            autoClose={2000}
            hideProgressBar
            transitionDuration={10}
          />

          <div className="">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/home" element={<Home />} />
              <Route path="/Details/:productoId" element={<Details />} />
              <Route path="/Carrito" element={<Cart />} />
              <Route path="/Admin" element={<CargaDatos />} />
              <Route path="/Order" element={<OrderSummary />} />
              <Route path="/Productos" element={<ProductsList />} />
              <Route path="/Pedidos" element={<PedidosList />} />
              <Route path="/Landing" element={<LandingPage />} />
            </Routes>
          </div>

          {/* <Footer /> */}
        </Router>
      </div>
    </div>
  )
}

export default App
