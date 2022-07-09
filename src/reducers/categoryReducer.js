import getUnique from "../components/common/getUnique";

let initialState = [];

if (typeof window !== undefined) {
  if (localStorage.getItem("categories")) {
    initialState = JSON.parse(localStorage.getItem("categories"));
  }
}

const reducerExec = (state, payload) => {
  if (payload.length > 0) {
    const unique = getUnique(state, payload);
    if (unique.all.length < 100)
        localStorage.setItem("categories", JSON.stringify(unique.all));
    return unique.all;
  } else {
    localStorage.removeItem("categories");
    return [];
  }
}

export const categoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case "CATEGORY_LIST_I":
      return reducerExec(state, action.payload);
    case "CATEGORY_LIST_II":
      return reducerExec(state, action.payload);
    case "CATEGORY_LIST_III":
      return reducerExec(state, action.payload);
    case "CATEGORY_LIST_IV":
      return reducerExec(state, action.payload);
    case "CATEGORY_LIST_V":
      return reducerExec(state, action.payload);
    case "CATEGORY_LIST_VI":
      return reducerExec(state, action.payload);
    case "CATEGORY_LIST_VII":
      return reducerExec(state, action.payload);
    case "CATEGORY_LIST_VIII":
      return reducerExec(state, action.payload);
    case "CATEGORY_LIST_IX":
      return reducerExec(state, action.payload);
    case "CATEGORY_LIST_X":
      return reducerExec(state, action.payload);
    case "CATEGORY_LIST_XI":
      return reducerExec(state, action.payload);
    case "CATEGORY_LIST_XII":
      return reducerExec(state, action.payload);
    case "CATEGORY_LIST_XIII":
      return reducerExec(state, action.payload);
    case "CATEGORY_LIST_XIV":
      return reducerExec(state, action.payload);
    case "CATEGORY_LIST_XV":
      return reducerExec(state, action.payload);
    case "CATEGORY_REMOVE":
      return action.payload;
    default:
      return state;
  }
};
