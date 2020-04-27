import { FETCH_FRIENDS } from "../actions/index.js";
export default (state = {}, action) => {
  switch (action.type) {
    case FETCH_FRIENDS:
      return action.payload;
    default:
      return state;
  }
};
