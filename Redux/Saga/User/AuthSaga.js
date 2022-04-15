import { all, takeLatest, call, put, takeEvery } from "redux-saga/effects";
import { SecureApiHandler } from "../../../Utils/ApiUtilities/SecureApiHandler";
import { UnsecureApiHandler } from "../../../Utils/ApiUtilities/UnsecureApiHandler";
import { Tokens, updateTokens } from "../../../Utils/Configs/ApiConfigs";
import { DeleteAll } from "../../Actions/DeleteAll";
import { DeleteUserData, SaveUserData } from "../../Actions/User/DataAction";
import {
  LOG_IN_REQ,
  LOG_OUT_REQ,
  LOG_OUT_SESSION,
  SIGN_UP_USER,
} from "../../Types/Users/AuthType";

function* LogInUserSaga({ data }) {
  let apiConfig = {
    method: "POST",
    url: "user/auth/signin",
    data: data.data,
  };

  let response = yield call(UnsecureApiHandler, apiConfig, false, "Login Req");

  if (!response.res || !response.success) {
    return data.onFailed(response.message);
  }

  updateTokens({
    access: response.data.access,
    refresh: response.data.refresh,
  });

  data.onSuccess(response.data);

  return yield put(SaveUserData(response.data));
}

function* SignUpUserSaga({ data }) {
  let apiConfig = {
    method: "POST",
    url: "user/auth/signup",
    data: data.data,
  };

  let response = yield call(UnsecureApiHandler, apiConfig, false, "Sign up");

  if (!response.res || !response.success) {
    return data.onFailed(response.message);
  }

  updateTokens({
    access: response.data.access,
    refresh: response.data.refresh,
  });

  data.onSuccess(response.data);

  return yield put(SaveUserData(response.data));
}

function* LogOutUserSaga({ data }) {
  let apiConfig = {
    headers: {
      Authorization: `Bearer ${Tokens.refresh}`,
    },
    method: "POST",
    url: "user/auth/signout",
  };

  let response = yield call(
    SecureApiHandler,
    apiConfig,
    true,
    "Logged Out succesfully"
  );

  console.log(response, "response is");

  if (!response.res || !response.success) {
    if (!data.onFailed) return;
    return data.onFailed(response.message);
  }

  if (!data.onSuccess) {
    data.onSuccess();
  }

  return yield put(DeleteAll());
}

function* ClearSessionsSaga({ data }) {
  let apiConfig = {
    headers: {
      Authorization: `Bearer ${Tokens.refresh}`,
    },
    method: "POST",
    url: "user/auth/clearsession",
  };

  let response = yield call(
    SecureApiHandler,
    apiConfig,
    true,
    "Logged Out of All other sessions succesfully"
  );

  if (!response.res || !response.success) {
    return data.onFailed(response.message);
  }
  console.log(response);
  if (response.logout) {
    data.onFailed();
    return yield put(DeleteAll());
  }

  return data.onSuccess();
}

export const userAuthSaga = all([
  takeLatest(LOG_IN_REQ, LogInUserSaga),
  takeLatest(SIGN_UP_USER, SignUpUserSaga),
  takeLatest(LOG_OUT_REQ, LogOutUserSaga),
  takeLatest(LOG_OUT_SESSION, ClearSessionsSaga),
]);
