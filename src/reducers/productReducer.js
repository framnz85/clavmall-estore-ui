let initialState = [];

if (typeof window !== undefined) {
  if (localStorage.getItem("products")) {
    initialState = JSON.parse(localStorage.getItem("products"));
  }
}

export const productReducer = (state = initialState, action) => {
  switch (action.type) {
    case "PRODUCT_LIST":
      return action.payload;
    default:
      return state;
  }
};
