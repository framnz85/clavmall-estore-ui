import getUnique from "../components/common/getUnique";

let initialState = [];

if (typeof window !== undefined) {
  if (localStorage.getItem("parents")) {
    initialState = JSON.parse(localStorage.getItem("parents"));
  }
}

const reducerExec = (state, payload) => {
  if (payload.length > 0) {
    const unique = getUnique(state, payload);
    if (unique.all.length < 500)
      localStorage.setItem("parents", JSON.stringify(unique.all));
    return unique.all;
  } else {
    localStorage.removeItem("parents");
    return [];
  }
}

export const parentReducer = (state = initialState, action) => {
  switch (action.type) {
    case "PARENT_LIST_I":
      return reducerExec(state, action.payload);
    case "PARENT_LIST_II":
      return reducerExec(state, action.payload);
    case "PARENT_LIST_III":
      return reducerExec(state, action.payload);
    case "PARENT_LIST_IV":
      return reducerExec(state, action.payload);
    case "PARENT_LIST_V":
      return reducerExec(state, action.payload);
    case "PARENT_LIST_VI":
      return reducerExec(state, action.payload);
    case "PARENT_LIST_VII":
      return reducerExec(state, action.payload);
    case "PARENT_LIST_VIII":
      return reducerExec(state, action.payload);
    case "PARENT_LIST_IX":
      return reducerExec(state, action.payload);
    case "PARENT_LIST_X":
      return reducerExec(state, action.payload);
    case "PARENT_LIST_XI":
      return reducerExec(state, action.payload);
    case "PARENT_LIST_XII":
      return reducerExec(state, action.payload);
    case "PARENT_LIST_XIII":
      return reducerExec(state, action.payload);
    case "PARENT_LIST_XIV":
      return reducerExec(state, action.payload);
    case "PARENT_REMOVE":
      return action.payload;
    default:
      return state;
  }
};
