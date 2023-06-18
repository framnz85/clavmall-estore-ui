let initialState = {
  products: {
    values: [],
    pages: [],
    itemsCount: 0,
  },
  orders: {
    values: [],
    pages: [],
    itemsCount: 0,
  },
  categories: [],
  users: []
};

export const adminReducer = (state = initialState, action) => {
  switch (action.type) {
    case "ADMIN_OBJECT_I":
      return { ...state, ...action.payload };
    case "ADMIN_OBJECT_II":
      return { ...state, ...action.payload };
    case "ADMIN_OBJECT_III":
      return { ...state, ...action.payload };
    case "ADMIN_OBJECT_IV":
      return { ...state, ...action.payload };
    case "ADMIN_OBJECT_V":
      return { ...state, ...action.payload };
    case "ADMIN_OBJECT_VI":
      return { ...state, ...action.payload };
    case "ADMIN_OBJECT_VII":
      return { ...state, ...action.payload };
    case "ADMIN_OBJECT_VIII":
      return { ...state, ...action.payload };
    case "ADMIN_OBJECT_IX":
      return { ...state, ...action.payload };
    case "ADMIN_OBJECT_X":
      return { ...state, ...action.payload };
    case "ADMIN_OBJECT_XI":
      return { ...state, ...action.payload };
    case "ADMIN_OBJECT_XII":
      return { ...state, ...action.payload };
    case "ADMIN_OBJECT_XIII":
      return { ...state, ...action.payload };
    case "ADMIN_OBJECT_XIV":
      return { ...state, ...action.payload };
    case "ADMIN_OBJECT_XV":
      return { ...state, ...action.payload };
    case "ADMIN_OBJECT_XVI":
      return { ...state, ...action.payload };
    case "ADMIN_OBJECT_XVII":
      return { ...state, ...action.payload };
    case "ADMIN_OBJECT_XVIII":
      return { ...state, ...action.payload };
    case "ADMIN_OBJECT_XIX":
      return { ...state, ...action.payload };
    case "ADMIN_OBJECT_XX":
      return { ...state, ...action.payload };
    default:
      return state;
  }
};
