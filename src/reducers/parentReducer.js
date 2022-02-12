let initialState = [];

if (typeof window !== undefined) {
  if (localStorage.getItem("parents")) {
    initialState = JSON.parse(localStorage.getItem("parents"));
  }
}

export const parentReducer = (state = initialState, action) => {
  switch (action.type) {
    case "PARENT_LIST":
      return action.payload;
    default:
      return state;
  }
};
