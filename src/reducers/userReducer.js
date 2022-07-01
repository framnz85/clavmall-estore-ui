let estore = {};
let userAddress = {};

if (typeof window !== undefined) {
  if (localStorage.getItem("estore")) {
    estore = JSON.parse(localStorage.getItem("estore"));
  }
}

if (estore.userAddress) userAddress = { address: estore.userAddress };

export const userReducer = (state = userAddress, action) => {
  switch (action.type) {
    case "LOGGED_IN_USER_I":
      return { ...state, ...action.payload };
    case "LOGGED_IN_USER_II":
      return { ...state, ...action.payload };
    case "LOGGED_IN_USER_III":
      return { ...state, ...action.payload };
    case "LOGGED_IN_USER_IV":
      return { ...state, ...action.payload };
    case "LOGGED_IN_USER_V":
      return { ...state, ...action.payload };
    case "LOGGED_IN_USER_VI":
      return { ...state, ...action.payload };
    case "LOGGED_IN_USER_VII":
      return { ...state, ...action.payload };
    case "LOGGED_IN_USER_VIII":
      return { ...state, ...action.payload };
    case "LOGGED_IN_USER_IX":
      return { ...state, ...action.payload };
    case "USER_LOGOUT":
      return action.payload;
    default:
      return state;
  }
};
