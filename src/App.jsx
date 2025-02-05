import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Menu from "../src/Components/Menu";
import Home from "./Components/Home";
import Details from "./Components/Details";
import { CartProvider } from "./Context/CartContext";
import { EstadoProvider } from "./Context/EstadoCom";
import Notificacion from "./Components/Notificacion";
import { ToastContainer, toast, Slide, Flip, Bounce, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <Router>
        <EstadoProvider>
          <CartProvider>
            <Menu></Menu>

            {/* //NOTIFICACION CON TOAST */}
            <ToastContainer
              transition={Zoom} // Puedes probar otros como Zoom, Bounce o Flip
              autoClose={3000}
              hideProgressBar
              transitionDuration={10}
            ></ToastContainer>

            <Routes>
              <Route path="/" element={<Home></Home>}></Route>
              <Route
                path="/Details/:productoId"
                element={<Details></Details>}
              ></Route>
            </Routes>
          </CartProvider>
        </EstadoProvider>
      </Router>
    </>
  );
}

export default App;
