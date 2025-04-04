// import { useReducer, useEffect, createContext } from "react";
// import { cartInicialState, CartReducer } from "../Reducer/CartReducer";
// import { supabase } from "../supabaseClient"; // Importa Supabase

// // Crear contexto
// export const CartContext = createContext();

// // Crear el provider
// export function CartProvider({ children }) {
//   // Estado inicial con localStorage para el carrito
//   const initialCart = JSON.parse(localStorage.getItem("cart")) || cartInicialState;

//   // Estado con Reducer
//   const [state, dispatch] = useReducer(CartReducer, {
//     cart: initialCart,
//     stock: {}, // Aquí guardamos el stock de Supabase
//   });

//   // Guardar en localStorage cada vez que cambie el carrito
//   useEffect(() => {
//     localStorage.setItem("cart", JSON.stringify(state.cart));
//   }, [state.cart]);

//   // Cargar stock desde Supabase
//   useEffect(() => {
//     const fetchStock = async () => {
//       const { data, error } = await supabase.from("Productos").select("id, stock");

//       if (error) {
//         console.error("Error al obtener el stock:", error.message);
//         return;
//       }

//       // Convertir array en objeto { idProducto: cantidadStock }
//       const stockData = data.reduce((acc, item) => {
//         acc[item.id] = item.stock;
//         return acc;
//       }, {});

//       dispatch({ type: "SET_INITIAL_STOCK", payload: stockData });
//     };

//     fetchStock();
//   }, []);

//   // Funciones del carrito
//   const addToCart = (product) => {
//     dispatch({ type: "ADD_TO_CART", payload: product });
//   };

//   const removeItem = (id) => {
//     dispatch({ type: "REMOVE_ITEM", payload: { id } });
//   };

//   const updateQuantity = (id, newQuantity) => {
//     dispatch({ type: "UPDATE_QUANTITY", payload: { id, newQuantity } });
//   };

//   const clearCart = () => {
//     dispatch({ type: "CLEAR_CART" });
//   };

//   return (
//     <CartContext.Provider value={{ cart: state.cart, stock: state.stock, addToCart, removeItem, updateQuantity, clearCart }}>
//       {children}
//     </CartContext.Provider>
//   );
// }
