import { all, call, put, takeLatest } from "redux-saga/effects";
import { SecureApiHandler } from "../../../Utils/ApiUtilities/SecureApiHandler";
import { Tokens } from "../../../Utils/Configs/ApiConfigs";
import { DeleteAll } from "../../Actions/DeleteAll";
import { SaveUserData } from "../../Actions/User/DataAction";
import { GET_USER_DATA } from "../../Types/Users/DataTypes";

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

  if (!response.res || !response.success) {
    if (!data.onFailed) return;
    return data.onFailed();
  }

  if (response.logout) {
    if (!data.onFailed) return;
    data.onFailed();
    return put(DeleteAll());
  }

  yield put(SaveUserData(response.data));

  if (!data.onSuccess) return;

  return data.onSuccess();
}

export const userDataSaga = all([takeLatest(GET_USER_DATA, GetUserSaga)]);
