export const cartInicialState = [];

export const CartReducer = (state, action) => {
  const { type: actionType, payload: actionPayload } = action;

  switch (actionType) {
    case "ADD_TO_CART": {
      const { id, quantity } = actionPayload;

      // Buscar si el producto ya existe en el carrito
      const productInCartIndex = state.findIndex((item) => item.id === id);

      // Si el producto ya está en el carrito, sumamos la cantidad
      if (productInCartIndex >= 0) {
        const newState = structuredClone(state);

        // Se incrementa la cantidad del producto existente por la cantidad seleccionada
        newState[productInCartIndex].quantity += quantity;

        return newState;
      }

      // Si el producto no está en el carrito, lo agregamos con la cantidad seleccionada
      return [
        ...state,
        {
          ...actionPayload,
          quantity: quantity, // Utilizar la cantidad seleccionada
        },
      ];
    }
    case"REMOVE_ITEM":{
      const {id} = actionPayload;
      const updateState = state.filter(item => item.id != id )
     
      console.log(JSON.stringify(updateState))
      return updateState
    }
    case "UPDATE_QUANTITY":
  return state.map(item =>
    item.id === action.payload.id
      ? { ...item, quantity: action.payload.newQuantity }
      : item
  );


    default:
      return state;
  }
};