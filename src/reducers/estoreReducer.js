let initialState = [];

if (typeof window !== undefined) {
  if (localStorage.getItem("estore")) {
    initialState = JSON.parse(localStorage.getItem("estore"));
  }
}

const reducerExec = (state, payload) => {
  if (Object.keys(payload).length > 0) {
    localStorage.setItem("estore", JSON.stringify({ ...state, ...payload }));
    return { ...state, ...payload };
  } else {
    localStorage.removeItem("estore");
    return [];
  }
}

export const estoreReducer = (state = initialState, action) => {
  switch (action.type) {
    case "ESTORE_INFO_I":
      return reducerExec(state, action.payload);
    case "ESTORE_INFO_II":
      return reducerExec(state, action.payload);
    case "ESTORE_INFO_III":
      return reducerExec(state, action.payload);
    case "ESTORE_INFO_IV":
      return reducerExec(state, action.payload);
    case "ESTORE_INFO_V":
      return reducerExec(state, action.payload);
    case "ESTORE_INFO_VI":
      return reducerExec(state, action.payload);
    case "ESTORE_INFO_VII":
      return reducerExec(state, action.payload);
    case "ESTORE_INFO_VIII":
      return reducerExec(state, action.payload);
    case "ESTORE_INFO_IX":
      return reducerExec(state, action.payload);
    case "ESTORE_INFO_X":
      return reducerExec(state, action.payload);
    case "ESTORE_INFO_XI":
      return reducerExec(state, action.payload);
    case "ESTORE_INFO_XII":
      return reducerExec(state, action.payload);
    case "ESTORE_INFO_XIII":
      return reducerExec(state, action.payload);
    case "ESTORE_INFO_XIV":
      return reducerExec(state, action.payload);
    case "ESTORE_INFO_XV":
      return reducerExec(state, action.payload);
    case "ESTORE_INFO_XVI":
      return reducerExec(state, action.payload);
    case "ESTORE_INFO_XVII":
      return reducerExec(state, action.payload);
    case "ESTORE_INFO_XVIII":
      return reducerExec(state, action.payload);
    case "ESTORE_INFO_XIX":
      return reducerExec(state, action.payload);
    case "ESTORE_INFO_XX":
      return reducerExec(state, action.payload);
    case "ESTORE_INFO_XXI":
      return reducerExec(state, action.payload);
    case "ESTORE_INFO_XXII":
      return reducerExec(state, action.payload);
    case "ESTORE_INFO_XXIII":
      return reducerExec(state, action.payload);
    case "ESTORE_INFO_XXIV":
      return reducerExec(state, action.payload);
    case "ESTORE_LOGOUT":
      return action.payload;
    default:
      return state;
  }
};
