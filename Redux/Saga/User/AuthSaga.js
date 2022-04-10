import { all, takeLatest, call, put, takeEvery } from "redux-saga/effects";
import { UnsecureApiHandler } from "../../../Utils/ApiUtilities/UnsecureApiHandler";
import { Tokens } from "../../../Utils/Configs/ApiConfigs";
import { SaveUserData } from "../../Actions/User/DataAction";
import { LOG_IN_REQ, SIGN_UP_USER } from "../../Types/Users/AuthType";

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

  Tokens.access = response.data.access;
  Tokens.refresh = response.data.refresh;
  console.log(Tokens);

  return yield put(SaveUserData(response.data));
}

function* SignUpUserSaga({ data }) {
  let apiConfig = {
    method: "POST",
    url: "user/auth/signup",
    data: data.data,
  };

  let response = yield call(UnsecureApiHandler, apiConfig, true, "Sign up");

  if (!response.res || !response.success) {
    return yield data.onFailed(response.message);
  }

  data.onSuccess(response.data);

  Tokens.access = response.data.access;
  Tokens.refresh = response.data.refresh;

  return yield put(SaveUserData(response.data));
}

export const userAuthSaga = all([
  takeLatest(LOG_IN_REQ, LogInUserSaga),
  takeLatest(SIGN_UP_USER, SignUpUserSaga),
]);
