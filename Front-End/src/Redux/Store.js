import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./Reducer";

 const store = configureStore({
  reducer: {
    Productos: userReducer,
  },
});

export default store;