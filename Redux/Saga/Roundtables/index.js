import {
  CREATE_ROUNDTABLE,
  GET_ROUNDTABLES_ALL,
} from "../../Types/Users/RoundtableTypes";
import { all, call, put, takeLatest } from "redux-saga/effects";
import { Tokens } from "../../../Utils/Configs/ApiConfigs";
import { SecureApiHandler } from "../../../Utils/ApiUtilities/SecureApiHandler";
import { DeleteAll } from "../../Actions/DeleteAll";

function* GetAllRoundtablesSaga({ data }) {
  let apiConfig = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${Tokens.refresh}`,
    },
    url: "roundtable/all",
  };

  let response = yield call(
    SecureApiHandler,
    apiConfig,
    false,
    "Got All Roundtables"
  );

  if (response.logout) {
    yield put(DeleteAll());
    data.onFailed();
  }

  if (!response.res || !response.success) {
    return data.onFailed(response.message);
  }

  return data.onSuccess(response.data);
}

function* CreateRoundtablesSaga({ data }) {
  let apiConfig = {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${Tokens.refresh}`,
    },
    url: "roundtable/create",
    data: data.data,
  };

  let response = yield call(
    SecureApiHandler,
    apiConfig,
    true,
    "Roundtable Creation"
  );

  if (response.logout) {
    yield put(DeleteAll());
    data.onFailed();
  }

  if (!response.res || !response.success) {
    return data.onFailed();
  }

  return data.onSuccess();
}

export const roundtableDataSaga = all([
  takeLatest(GET_ROUNDTABLES_ALL, GetAllRoundtablesSaga),
  takeLatest(CREATE_ROUNDTABLE, CreateRoundtablesSaga),
]);
