import { combineReducers } from "redux";
import { estoreReducer } from "./estoreReducer";
import { userReducer } from "./userReducer";
import { inputsReducer } from "./inputsReducer";
import { categoryReducer } from "./categoryReducer";
import { productReducer } from "./productReducer";
import { adminReducer } from "./adminReducer";
import { subcatReducer } from "./subcatReducer";
import { parentReducer } from "./parentReducer";
import { locationReducer } from "./locationReducer";
import { orderReducer } from "./orderReducer";

const rootReducer = combineReducers({
  estore: estoreReducer,
  user: userReducer,
  inputs: inputsReducer,
  categories: categoryReducer,
  products: productReducer,
  admin: adminReducer,
  subcats: subcatReducer,
  parents: parentReducer,
  location: locationReducer,
  orders: orderReducer,
});

export default rootReducer;
