export const locationReducer = (state = {}, action) => {
  switch (action.type) {
    case "LOCATION_LIST":
      return { ...state, ...action.payload };
    default:
      return state;
  }
};
