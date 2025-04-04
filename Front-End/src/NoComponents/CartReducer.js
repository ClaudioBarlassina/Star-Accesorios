// export const cartInicialState = {
//   cart: [],
// };

// export const CartReducer = (state, action) => {
//   const { type, payload } = action;

//   switch (type) {
//     case "ADD_TO_CART": {
//       const { id, quantity } = payload;
      
//       // Buscar si el producto ya está en el carrito
//       const productInCartIndex = state.cart.findIndex((item) => item.id === id);

//       if (productInCartIndex >= 0) {
//         const newCart = structuredClone(state.cart);
//         newCart[productInCartIndex].quantity += quantity;

//         return {
//           ...state,
//           cart: newCart,
//         };
//       }

//       return {
//         ...state,
//         cart: [...state.cart, { ...payload, quantity }],
//       };
//     }

//     case "REMOVE_ITEM": {
//       const { id } = payload;
//       return {
//         ...state,
//         cart: state.cart.filter((item) => item.id !== id),
//       };
//     }

//     case "UPDATE_QUANTITY": {
//       const { id, newQuantity } = payload;
//       return {
//         ...state,
//         cart: state.cart.map((item) =>
//           item.id === id ? { ...item, quantity: newQuantity } : item
//         ),
//       };
//     }

//     case "CLEAR_CART":
//       return {
//         ...state,
//         cart: [],
//       };

//     default:
//       return state;
//   }
// };