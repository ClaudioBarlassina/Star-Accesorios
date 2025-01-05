import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { FilterProvider } from "./Context/Filters.jsx";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <FilterProvider>
    <StrictMode>
      <App />
    </StrictMode>
  </FilterProvider>
);
