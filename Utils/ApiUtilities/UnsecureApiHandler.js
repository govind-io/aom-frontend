import axios from "axios";
import { API_BASE_URL } from "../Configs/ApiConfigs";
import ToastHandler from "../Toast/ToastHandler";

export const UnsecureApiHandler = async (apiConfig, alert, alertMessage) => {
  apiConfig.url = `${API_BASE_URL}/${apiConfig.url}`;
  let data;
  try {
    data = await axios(apiConfig);
  } catch (e) {
    if (alert) {
      ToastHandler("warn", e.message);
    }
    return { res: false, success: false, message: e.messag };
  }

  if (data.status !== 200) {
    ToastHandler("warn", data.data.message);
    return { res: true, success: false, message: data.data.message };
  }

  if (alert) {
    ToastHandler("sus", alertMessage + " Success");
  }

  return { res: true, success: true, data: data.data };
};
