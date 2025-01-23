import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Menu from "../src/Components/Menu";
import Home from "./Components/Home";
import Details from "./Components/Details";

function App() {
  return (
    <>
      <Router>
        <Menu></Menu>
        <Routes>
          <Route path="/" element={<Home></Home>}></Route>
          <Route path="/Details/:productoId"
            element={<Details></Details>}
          ></Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
