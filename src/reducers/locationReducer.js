import getUnique from "../components/common/getUnique";

let initialState = {
  countries: [],
  addiv1s: [],
  addiv2s: [],
  addiv3s: [],
};

if (typeof window !== undefined) {
  if (localStorage.getItem("location")) {
    initialState = {...initialState, ...JSON.parse(localStorage.getItem("location"))};
  }
}

const reducerExec = (state, payload) => {
  if (Object.keys(payload).filter(key => key === "countries").length > 0) {
    const unique = getUnique(state.countries, payload.countries);
    localStorage.setItem("location", JSON.stringify({ ...state, countries: unique.all }));
    return { ...state, countries: unique.all };
  } else if (Object.keys(payload).filter(key => key === "addiv1s").length > 0) {
    const unique = getUnique(state.addiv1s, payload.addiv1s);
    localStorage.setItem("location", JSON.stringify({ ...state, addiv1s: unique.all }));
    return { ...state, addiv1s: unique.all };
  } else if (Object.keys(payload).filter(key => key === "addiv2s").length > 0) {
    const unique = getUnique(state.addiv2s, payload.addiv2s);
    if(unique.all.length < 500)
      localStorage.setItem("location", JSON.stringify({ ...state, addiv2s: unique.all }));
    return { ...state, addiv2s: unique.all };
  } else if (Object.keys(payload).filter(key => key === "addiv3s").length > 0) {
    const unique = getUnique(state.addiv3s, payload.addiv3s);
    if(unique.all.length < 1000)
      localStorage.setItem("location", JSON.stringify({ ...state, addiv3s: unique.all }));
    return { ...state, addiv3s: unique.all };
  } else {
    localStorage.setItem("location", JSON.stringify({...initialState}));
    return {...initialState};
  }
}

export const locationReducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOCATION_LIST_I":
      return reducerExec(state, action.payload);
    case "LOCATION_LIST_II":
      return reducerExec(state, action.payload);
    case "LOCATION_LIST_III":
      return reducerExec(state, action.payload);
    case "LOCATION_LIST_IV":
      return reducerExec(state, action.payload);
    case "LOCATION_LIST_V":
      return reducerExec(state, action.payload);
    case "LOCATION_LIST_VI":
      return reducerExec(state, action.payload);
    case "LOCATION_LIST_VII":
      return reducerExec(state, action.payload);
    case "LOCATION_LIST_VIII":
      return reducerExec(state, action.payload);
    case "LOCATION_LOGOUT":
      return action.payload;
    default:
      return state;
  }
};
