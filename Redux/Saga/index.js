import { all } from "redux-saga/effects";

import { userAuthSaga } from "./User/AuthSaga";
import { userDataSaga } from "./User/DataSaga";
import { roundtableDataSaga } from "./Roundtables/index";

export default function* rootSaga() {
  return yield all([userAuthSaga, userDataSaga, roundtableDataSaga]);
}
