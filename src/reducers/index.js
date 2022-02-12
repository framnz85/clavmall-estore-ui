import { combineReducers } from "redux";
import { estoreReducer } from "./estoreReducer";
import { userReducer } from "./userReducer";
import { searchReducer } from "./searchReducer";
import { cartReducer } from "./cartReducer";
import { drawerReducer } from "./drawerReducer";
import { payoptReducer } from "./payoptReducer";
import { categoryReducer } from "./categoryReducer";
import { productReducer } from "./productReducer";
import { adminReducer } from "./adminReducer";
import { subcatReducer } from "./subcatReducer";
import { parentReducer } from "./parentReducer";
import { locationReducer } from "./locationReducer";
import { couponReducer } from "./couponReducer";
import { historyReducer } from "./historyReducer";

const appReducer = combineReducers({
  estore: estoreReducer,
  user: userReducer,
  search: searchReducer,
  cart: cartReducer,
  drawer: drawerReducer,
  payopt: payoptReducer,
  categories: categoryReducer,
  products: productReducer,
  admin: adminReducer,
  subcats: subcatReducer,
  parents: parentReducer,
  location: locationReducer,
  coupon: couponReducer,
  history: historyReducer,
});

const rootReducer = (state, action) => {
  if (action.type === "USER_LOGOUT") {
    return appReducer(undefined, action);
  }

  return appReducer(state, action);
};

export default rootReducer;
