let initialState = [];

if (typeof window !== undefined) {
  if (localStorage.getItem("estore")) {
    initialState = JSON.parse(localStorage.getItem("estore"));
  }
}

export const estoreReducer = (state = initialState, action) => {
  switch (action.type) {
    case "ESTORE_INFO":
      return { ...state, ...action.payload };
    default:
      return state;
  }
};
