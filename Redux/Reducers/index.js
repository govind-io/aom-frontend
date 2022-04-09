import { combineReducers } from "redux";
import { UserReducer } from "./User";

export const rootReducer = combineReducers({
  user: UserReducer,
});
