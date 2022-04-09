import { all } from "redux-saga/effects";
import UserSaga from "./User";

export default function* rootSaga() {
  return yield all([UserSaga]);
}
