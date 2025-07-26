import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../supabaseClient"; // Importa correctamente tu cliente de Supabase

// Función para obtener datos desde localStorage
const loadFromLocalStorage = (key, defaultValue) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : defaultValue;
};

// Estado inicial con localStorage
const initialState = {
  Productos: [],
  cart: loadFromLocalStorage("cart", []),
  stock: {},
  loading: false,
  error: null,
  filters: {
    categoria: "Todos Los Productos",
    subcategoria: "Todo",
  },
};

// Thunk para cargar productos y stock desde Supabase
export const fetchProductos = createAsyncThunk("Productos/fetchProductos", async () => {
  const { data, error } = await supabase.from("Productos").select("id, img, nombre, precio, stock, Categoria, SubCategoria");
  if (error) throw error;

  const stockData = data.reduce((acc, producto) => {
    acc[producto.id] = producto.stock;
    return acc;
  }, {});

  return { productos: data, stock: stockData };
});

const productosSlice = createSlice({
  name: "productos",
  initialState,
  reducers: {
    // Reducir stock cuando se agrega al carrito
    reducirStock: (state, action) => {
      const { id, quantity } = action.payload;
      if (state.stock[id] && state.stock[id] >= quantity) {
        state.stock[id] -= quantity;
        localStorage.setItem("stock", JSON.stringify(state.stock));
      }
    },

    // Agregar al carrito y reducir stock
    addToCart: (state, action) => {
      const { id, quantity } = action.payload;
      if (state.stock[id] && state.stock[id] >= quantity) {
        const productInCart = state.cart.find((item) => item.id === id);

        if (productInCart) {
          productInCart.quantity += quantity;
        } else {
          state.cart.push({ ...action.payload, quantity });
        }

        state.stock[id] -= quantity;

        // Guardar en localStorage
        localStorage.setItem("cart", JSON.stringify(state.cart));
        localStorage.setItem("stock", JSON.stringify(state.stock));
      }
    },

    // Remover del carrito y restaurar stock
    removeItem: (state, action) => {
      const  id  = action.payload;
      console.log(JSON.stringify(action.payload))
      const item = state.cart.find((item) => item.id === id);
      if (item && state.stock[id] !== undefined) {
        state.stock[id] += item.quantity;
      }
      state.cart = state.cart.filter((item) => item.id !== id);

      // Guardar en localStorage
      localStorage.setItem("cart", JSON.stringify(state.cart));
      localStorage.setItem("stock", JSON.stringify(state.stock));
    },

    // Actualizar cantidad en el carrito y ajustar stock
    updateQuantity: (state, action) => {
      const { id, newQuantity } = action.payload;
      const item = state.cart.find((item) => item.id === id);
      if (item && state.stock[id] !== undefined) {
        const totalStock = state.stock[id] + item.quantity;
        if (newQuantity <= totalStock) {
          state.stock[id] = totalStock - newQuantity;
          item.quantity = newQuantity;

          // Guardar en localStorage
          localStorage.setItem("cart", JSON.stringify(state.cart));
          localStorage.setItem("stock", JSON.stringify(state.stock));
        }
      }
    },

    // Vaciar carrito y restaurar stock
    clearCart: (state) => {
      state.cart.forEach((item) => {
        if (state.stock[item.id] !== undefined) {
          state.stock[item.id] += item.quantity;
        }
      });
      state.cart = [];

      // Guardar en localStorage
      localStorage.setItem("cart", JSON.stringify(state.cart));
      localStorage.setItem("stock", JSON.stringify(state.stock));
    },

    // Actualizar filtros
    setCategoria: (state, action) => {
      state.filters.categoria = action.payload;
    },

    setSubcategoria: (state, action) => {
      state.filters.subcategoria = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductos.fulfilled, (state, action) => {
        state.loading = false;
        state.Productos = action.payload.productos;

        // Si el stock en localStorage está vacío, usa el de Supabase
        if (Object.keys(state.stock).length === 0) {
          state.stock = action.payload.stock;
          localStorage.setItem("stock", JSON.stringify(state.stock));
        }
      })
      .addCase(fetchProductos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        console.error(action.error.message);
      });
  },
});

// Selector para obtener productos filtrados
export const selectFilteredProducts = (state) => {
  const { categoria, subcategoria } = state.Productos.filters;
  return state.Productos.Productos.filter((product) =>
    (categoria === "Todos Los Productos" || product.Categoria === categoria) &&
    (subcategoria === "Todo" || product.SubCategoria === subcategoria)
  );
};

export const {
  reducirStock,
  addToCart,
  removeItem,
  updateQuantity,
  clearCart,
  setCategoria,
  setSubcategoria,
} = productosSlice.actions;
export default productosSlice.reducer;
