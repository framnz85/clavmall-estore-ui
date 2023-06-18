import getUnique from "../components/common/getUnique";
import filterProductsAddress from "../components/common/filterProductsAddress";

let estore = {};
let initialState = [];

if (typeof window !== undefined) {
  if (localStorage.getItem("products")) {
    initialState = JSON.parse(localStorage.getItem("products"));
  }
  if (localStorage.getItem("estore")) {
    estore = JSON.parse(localStorage.getItem("estore"));
  }
}

const reducerExec = (state, payload) => {
  if (payload.length > 0) {
    const unique = getUnique(state, payload);
    const filteredProducts = filterProductsAddress(unique.all, estore.userAddress);
    if (filteredProducts.length < 200)
        localStorage.setItem("products", JSON.stringify(filteredProducts));
    return filteredProducts;
  } else {
    localStorage.removeItem("products");
    return [];
  }
}

export const productReducer = (state = initialState, action) => {
  switch (action.type) {
    case "PRODUCT_LIST_I":
      return reducerExec(state, action.payload);
    case "PRODUCT_LIST_II":
      return reducerExec(state, action.payload);
    case "PRODUCT_LIST_III":
      return reducerExec(state, action.payload);
    case "PRODUCT_LIST_IV":
      return reducerExec(state, action.payload);
    case "PRODUCT_LIST_V":
      return reducerExec(state, action.payload);
    case "PRODUCT_LIST_VI":
      return reducerExec(state, action.payload);
    case "PRODUCT_LIST_VII":
      return reducerExec(state, action.payload);
    case "PRODUCT_LIST_VIII":
      return reducerExec(state, action.payload);
    case "PRODUCT_LIST_IX":
      return reducerExec(state, action.payload);
    case "PRODUCT_LIST_X":
      return reducerExec(state, action.payload);
    case "PRODUCT_LIST_XI":
      return reducerExec(state, action.payload);
    case "PRODUCT_LIST_XII":
      return reducerExec(state, action.payload);
    case "PRODUCT_LIST_XIII":
      return reducerExec(state, action.payload);
    case "PRODUCT_LIST_XIV":
      return reducerExec(state, action.payload);
    case "PRODUCT_LIST_XV":
      return reducerExec(state, action.payload);
    case "PRODUCT_LIST_XVI":
      return reducerExec(state, action.payload);
    case "PRODUCT_LIST_XVII":
      return reducerExec(state, action.payload);
    case "PRODUCT_LIST_XVIII":
      return reducerExec(state, action.payload);
    case "PRODUCT_LIST_XIX":
      return reducerExec(state, action.payload);
    case "PRODUCT_LIST_XX":
      return reducerExec(state, action.payload);
    case "PRODUCT_LIST_XXI":
      return reducerExec(state, action.payload);
    default:
      return state;
  }
};
