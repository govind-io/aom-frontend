import { all } from "redux-saga/effects";

import { userAuthSaga } from "./User/AuthSaga";
import { userDataSaga } from "./User/DataSaga";

export default function* rootSaga() {
  return yield all([userAuthSaga, userDataSaga]);
}
