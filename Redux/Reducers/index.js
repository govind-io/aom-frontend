import { combineReducers } from "redux";
import { roundTableReducer } from "./Roundtable/RoundtableData";
import { UserReducer } from "./User";

export const rootReducer = combineReducers({
  user: UserReducer,
  roundtable: roundTableReducer,
});
