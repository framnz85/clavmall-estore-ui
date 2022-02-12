let initialState = { prodCount: 0, prodPages: [], products: [] };

if (typeof window !== undefined) {
  if (localStorage.getItem("admin")) {
    initialState = JSON.parse(localStorage.getItem("admin"));
  }
}

export const adminReducer = (state = initialState, action) => {
  switch (action.type) {
    case "ADMIN_OBJECT":
      return { ...state, ...action.payload };
    default:
      return state;
  }
};
