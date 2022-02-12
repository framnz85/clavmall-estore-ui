let initialState = [];

if (typeof window !== undefined) {
  if (localStorage.getItem("categories")) {
    initialState = JSON.parse(localStorage.getItem("categories"));
  }
}

export const categoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case "CATEGORY_LIST":
      return action.payload;
    default:
      return state;
  }
};
