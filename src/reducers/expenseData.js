import { FETCH_EXPENSES } from "../actions/index.js";

export default (state = {}, action) => {
  switch (action.type) {
    case FETCH_EXPENSES:
      return action.payload;
    default:
      return state;
  }
};
