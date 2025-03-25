import { useReducer, useEffect} from "react";
import { createContext } from "react";
import { cartInicialState,CartReducer} from "../Reducer/CartReducer";

// crear contexto

export const CartContext = createContext();

//creamnos el provider

export function CartProvider({ children }) {
  
 // Estado inicial con localStorage
 const initialCart = JSON.parse(localStorage.getItem("cart")) || cartInicialState;

 const [state, dispatch] = useReducer(CartReducer, initialCart);

 // Guardar en localStorage cada vez que cambie el carrito
 useEffect(() => {
   localStorage.setItem("cart", JSON.stringify(state));
 }, [state]);

  const addToCart = (product) =>
    dispatch({
      type: "ADD_TO_CART",
      payload: product,
    });

    const removeItem = id => dispatch({
      type:"REMOVE_ITEM",
      payload:{id}

    })
    const updateQuantity = (id, newQuantity) => {
      dispatch({
        type: "UPDATE_QUANTITY",
        payload: { id, newQuantity }
      });
    };
    const clearCart = () => {
      dispatch({ type: "CLEAR_CART" });
    };
    
    
    

  const removeToCart = (product) => dispatch({});

  return (
    <CartContext.Provider value={{ cart: state, addToCart, removeItem,updateQuantity,clearCart }}>
      {children}
    </CartContext.Provider>
  );
}
