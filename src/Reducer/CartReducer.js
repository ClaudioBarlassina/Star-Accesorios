export const cartInicialState = [
 
];

export const CartReducer = (state, action) => {
  const { type: actionType, payload: actionPayload } = action;

  switch (actionType) {
    case "ADD_TO_CART": {
      const { id } = actionPayload;
     

      const productInCartIndex = state.findIndex((item) => item.id === id);

      if (productInCartIndex >= 0) {
        const newState = structuredClone(state);

        newState[productInCartIndex].quantity += 1;
        return newState;
      }
      return [
        ...state,
        {
          ...actionPayload,
          quantity: 1,
        },
      ];
    }
  }
};
