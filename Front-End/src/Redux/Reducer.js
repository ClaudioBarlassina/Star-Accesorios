import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  Productos: [],
};

const productosSlice = createSlice({
  name: "productos",
  initialState,

  reducers: {
    // Cargar productos desde la BD
    productosBD: (state, action) => {
      state.Productos = action.payload;
    },

    // Reducir stock cuando se agrega al carrito
    reducirStock: (state, action) => {
      const producto = state.Productos.find((p) => p.id === action.payload);
      if (producto && producto.stock > 0) {
        producto.stock -= 1;
      }
    },
  },
});

export const { productosBD, reducirStock } = productosSlice.actions;
export default productosSlice.reducer;
