let initialState = {
  values: [],
  pages: [],
  itemsCount: 0,
};

export const orderReducer = (state = initialState, action) => {
  switch (action.type) {
    case "ORDER_LIST_I":
      return { ...state, ...action.payload };
    case "ORDER_LIST_II":
      return { ...state, ...action.payload };
    default:
      return state;
  }
};