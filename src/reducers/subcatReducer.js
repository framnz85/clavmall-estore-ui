import getUnique from "../components/common/getUnique";

let initialState = [];

if (typeof window !== undefined) {
  if (localStorage.getItem("subcats")) {
    initialState = JSON.parse(localStorage.getItem("subcats"));
  }
}

const reducerExec = (state, payload) => {
  if (payload.length > 0) {
    const unique = getUnique(state, payload);
    if (unique.all.length < 500)
      localStorage.setItem("subcats", JSON.stringify(unique.all));
    return unique.all;
  } else {
    localStorage.removeItem("subcats");
    return [];
  }
}

export const subcatReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SUBCAT_LIST":
      return reducerExec(state, action.payload);
    case "SUBCAT_LIST_I":
      return reducerExec(state, action.payload);
    case "SUBCAT_LIST_II":
      return reducerExec(state, action.payload);
    case "SUBCAT_LIST_III":
      return reducerExec(state, action.payload);
    case "SUBCAT_LIST_IV":
      return reducerExec(state, action.payload);
    case "SUBCAT_LIST_V":
      return reducerExec(state, action.payload);
    case "SUBCAT_LIST_VI":
      return reducerExec(state, action.payload);
    case "SUBCAT_LIST_VII":
      return reducerExec(state, action.payload);
    case "SUBCAT_LIST_VIII":
      return reducerExec(state, action.payload);
    case "SUBCAT_LIST_IX":
      return reducerExec(state, action.payload);
    case "SUBCAT_LIST_X":
      return reducerExec(state, action.payload);
    case "SUBCAT_LIST_XI":
      return reducerExec(state, action.payload);
    case "SUBCAT_LIST_XII":
      return reducerExec(state, action.payload);
    case "SUBCAT_REMOVE":
      return action.payload;
    default:
      return state;
  }
};
