import { all, takeLatest, call, put, takeEvery } from "redux-saga/effects";
import { UnsecureApiHandler } from "../../../Utils/ApiUtilities/UnsecureApiHandler";
import { SaveUserData } from "../../Actions/User/DataAction";
import { LOG_IN_REQ } from "../../Types/Users/AuthType";

function* LogInUserSaga({ data }) {
  let apiConfig = {
    method: "POST",
    url: "user/auth/signin",
    data: data.data,
  };

  let response = yield call(UnsecureApiHandler, apiConfig, true, "Login Req");

  if (!response.res || !response.success) {
    return yield data.onFailed(response.message);
  }

  data.onSuccess(response.data);

  return yield put(SaveUserData(response.data));
}

export const userAuthSaga = all([takeLatest(LOG_IN_REQ, LogInUserSaga)]);
