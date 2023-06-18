let initialState = {
  cart: [],
  searchText: "",
  payopt: "",
  couponCode: "",
  couponAmount: "",
};

if (typeof window !== undefined) {
  if (localStorage.getItem("cart")) {
    initialState = {
      ...initialState,
      cart: JSON.parse(localStorage.getItem("cart")
      )
    };
  }
}

export const inputsReducer = (state = initialState, action) => {
  switch (action.type) {
    case "INPUTS_OBJECT_I":
      return { ...state, ...action.payload };
    case "INPUTS_OBJECT_II":
      return { ...state, ...action.payload };
    case "INPUTS_OBJECT_III":
      return { ...state, ...action.payload };
    case "INPUTS_OBJECT_IV":
      return { ...state, ...action.payload };
    case "INPUTS_OBJECT_V":
      return { ...state, ...action.payload };
    case "INPUTS_OBJECT_VI":
      return { ...state, ...action.payload };
    case "INPUTS_OBJECT_VII":
      return { ...state, ...action.payload };
    case "INPUTS_OBJECT_VIII":
      return { ...state, ...action.payload };
    case "INPUTS_OBJECT_IX":
      return { ...state, ...action.payload };
    case "INPUTS_OBJECT_X":
      return { ...state, ...action.payload };
    case "INPUTS_OBJECT_XI":
      return { ...state, ...action.payload };
    case "INPUTS_OBJECT_XII":
      return { ...state, ...action.payload };
    case "INPUTS_OBJECT_XIII":
      return { ...state, ...action.payload };
    case "INPUTS_OBJECT_XIV":
      return { ...state, ...action.payload };
    case "INPUTS_OBJECT_XV":
      return { ...state, ...action.payload };
    default:
      return state;
  }
};
