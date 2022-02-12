export const couponReducer = (state = {}, action) => {
  switch (action.type) {
    case "COUPON_LIST":
      return action.payload;
    default:
      return state;
  }
};
