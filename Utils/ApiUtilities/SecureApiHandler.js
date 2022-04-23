import axios from "axios";
import { API_BASE_URL, Tokens } from "../Configs/ApiConfigs";
import ToastHandler from "../Toast/ToastHandler";
import getToken from "./GetToken";

const recallApi = async (apiConfig) => {
  let getTokens = await getToken();

  if (!getTokens.res) {
    ToastHandler("warn", "Error getting refresh token " + getTokens.message);
    return { res: false, success: false, message: getTokens.message };
  }

  if (!getToken.success) {
    ToastHandler("warn", "Login Session expired");
    return { res: false, success: false, logout: true };
  }

  apiConfig.headers = {
    ...apiConfig.headers,
    Authorization: `Bearer ${Tokens.refresh}`,
  };

  return await SecureApiHandler(apiConfig, alert, alertMessage);
};

export const SecureApiHandler = async (apiConfig, alert, alertMessage) => {
  apiConfig.url = `${API_BASE_URL}/${apiConfig.url}`;

  let response;

  try {
    response = await axios(apiConfig);
  } catch (e) {
    if (
      e.message.toLowerCase() ===
      "Request failed with status code 401".toLowerCase()
    )
      return await recallApi(apiConfig);

    if (alert) {
      ToastHandler("warn", e.message);
    }

    return { res: false, success: false, message: e.message };
  }

  if (response.status === 200) {
    if (alert) {
      ToastHandler("sus", alertMessage + " Success");
    }
    return { res: true, success: true, data: response.data };
  }

  if (response.status === 401) {
    return await recallApi(apiConfig);
  }

  ToastHandler("warn", response.data.message);

  return { res: true, success: false, messsage: response.data.message };
};
