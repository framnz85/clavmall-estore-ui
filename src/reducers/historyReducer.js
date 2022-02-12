export const historyReducer = (state = [], action) => {
  switch (action.type) {
    case "HISTORY_LIST":
      return action.payload;
    case "DASHBOARD_LIST":
      return action.payload;
    default:
      return state;
  }
};
