import { combineReducers } from "redux";
import data from "./data";
import expenseData from "./expenseData";

export default combineReducers({
  data,
  expenseData,
});
