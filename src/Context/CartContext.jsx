import { useReducer } from "react";
import { createContext } from "react";
import { cartInicialState,CartReducer} from "../Reducer/CartReducer";

// crear contexto

export const CartContext = createContext();

//creamnos el provider

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(CartReducer, cartInicialState); //reducer y el estado inicial

  const addToCart = (product) =>
    dispatch({
      type: "ADD_TO_CART",
      payload: product,
    });

    const removeItem = id => dispatch({
      type:"REMOVE_ITEM",
      payload:{id}

    })

  const removeToCart = (product) => dispatch({});

  return (
    <CartContext.Provider value={{ cart: state, addToCart, removeItem }}>
      {children}
    </CartContext.Provider>
  );
}
