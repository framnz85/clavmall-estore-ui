export const userReducer = (state = {}, action) => {
  switch (action.type) {
    case "LOGGED_IN_USER":
      return action.payload;
    case "USER_UPDATE_ADDRESS":
      return action.payload;
    case "USER_WISHLIST":
      return action.payload;
    default:
      return state;
  }
};
