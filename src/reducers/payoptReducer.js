export const payoptReducer = (state = "", action) => {
  switch (action.type) {
    case "SET_PAYMENT_OPTION":
      return action.payload;
    default:
      return state;
  }
};
