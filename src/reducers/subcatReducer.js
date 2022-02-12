let initialState = [];

if (typeof window !== undefined) {
  if (localStorage.getItem("subcats")) {
    initialState = JSON.parse(localStorage.getItem("subcats"));
  }
}

export const subcatReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SUBCAT_LIST":
      return action.payload;
    default:
      return state;
  }
};
