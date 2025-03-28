import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Menu from "../src/Components/Menu";
import Home from "./Components/Home";
import Details from "./Components/Details";
import Cart from "./Components/Cart";
import CargaDatos from "./Components/CargaDatos"
import ProductsList from "./Components/ProductsList"
import OrderSummary from "./Components/OrderSummary";
import PedidosList from "./Components/PedidosList";
import { CartProvider } from "./Context/CartContext";
import { EstadoProvider } from "./Context/EstadoCom";

import { ToastContainer, toast, Slide, Flip, Bounce, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    < >
      <Router>
        <EstadoProvider>
          <CartProvider>
            <Menu></Menu>

            {/* //NOTIFICACION CON TOAST */}
            <ToastContainer
              transition={Flip} // Puedes probar otros como Zoom, Bounce o Flip
              autoClose={2000}
              hideProgressBar
              transitionDuration={10}
            ></ToastContainer>

            <Routes>
              <Route path="/" element={<Home></Home>}></Route>
              <Route
                path="/Details/:productoId"
                element={<Details></Details>}
              ></Route>
              <Route path="/Carrito" element={<Cart></Cart>}></Route>
            <Route path="/Admin" element={<CargaDatos></CargaDatos>}></Route>
            <Route path="/Order" element={<OrderSummary />}></Route>
            <Route path="/Productos" element={<ProductsList/>}></Route>
            <Route path="/Pedidos" element={<PedidosList/>}></Route>
            </Routes>
          </CartProvider>
        </EstadoProvider>
      </Router>
    </>
  );
}

export default App;
