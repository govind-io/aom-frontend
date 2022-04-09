import { all } from "redux-saga/effects";

import { userAuthSaga } from "./User/AuthSaga";

export default function* rootSaga() {
  return yield all([userAuthSaga]);
}
