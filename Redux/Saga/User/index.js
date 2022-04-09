import { all } from "redux-saga/effects";
import { userAuthSaga } from "./AuthSaga";

export default function* UserSaga() {
  return yield all([userAuthSaga]);
}
