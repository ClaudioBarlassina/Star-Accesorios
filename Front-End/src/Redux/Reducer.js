import { createSlice } from "@reduxjs/toolkit";

const initialState = {
 Productos: []
}

const todoSlice = createSlice({
  //-----------------------------------------------------------------
  //Estado
  name: "productos",
  initialState,

  //-----------------------------------------------------------------
  //Acciones
  reducers: {
    productosBD: (state, action) => {
    state.Productos = action.payload
    },
  },
});

export const { productosBD } = todoSlice.actions;
export default todoSlice.reducer;
