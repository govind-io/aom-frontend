import { all, call, put, takeLatest } from "redux-saga/effects";
import { SecureApiHandler } from "../../../Utils/ApiUtilities/SecureApiHandler";
import { Tokens } from "../../../Utils/Configs/ApiConfigs";
import { DeleteAll } from "../../Actions/DeleteAll";
import { SaveUserData } from "../../Actions/User/DataAction";
import {
  EDIT_USER_DATA,
  GET_OTHER_USER_DATA,
  GET_USER_DATA,
} from "../../Types/Users/DataTypes";

function* GetUserSaga({ data }) {
  let apiConfig = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${Tokens.refresh}`,
    },
    url: "user/data",
  };

  let response = yield call(
    SecureApiHandler,
    apiConfig,
    false,
    "User Data received"
  );

  if (response.logout) {
    if (!data.onFailed) return;
    data.onFailed();
    return put(DeleteAll());
  }

  if (!response.res || !response.success) {
    if (!data.onFailed) return;
    return data.onFailed();
  }

  yield put(SaveUserData(response.data));

  if (!data.onSuccess) return;

  return data.onSuccess();
}

function* GetOTherUserSaga({ data }) {
  let apiConfig = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${Tokens.refresh}`,
    },
    url: `user/data/${data.data.email}`,
  };

  let response = yield call(
    SecureApiHandler,
    apiConfig,
    false,
    "Other User Data received"
  );

  if (response.logout) {
    data.onFailed();
    return put(DeleteAll());
  }

  if (!response.res || !response.success) {
    return data.onFailed();
  }

  return data.onSuccess(response.data);
}

function* EditUserSaga({ data }) {
  let apiConfig = {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${Tokens.refresh}`,
    },
    url: `user/data`,
  };

  let response = yield call(
    SecureApiHandler,
    apiConfig,
    false,
    "Edited User Data"
  );

  if (response.logout) {
    data.onFailed();
    return put(DeleteAll());
  }

  if (!response.res || !response.success) {
    return data.onFailed();
  }

  return data.onSuccess(response.data);
}

export const userDataSaga = all([
  takeLatest(GET_USER_DATA, GetUserSaga),
  takeLatest(GET_OTHER_USER_DATA, GetOTherUserSaga),
  takeLatest(EDIT_USER_DATA, EditUserSaga),
]);
