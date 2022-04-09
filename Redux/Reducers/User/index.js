import { combineReducers } from "redux";
import { DataReducer } from "./DataReducers";

export const UserReducer = combineReducers({
  data: DataReducer,
});
